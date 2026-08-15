import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin";

const schema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("suspend") }),
  z.object({ action: z.literal("activate") }),
  z.object({ action: z.literal("promote") }),
  z.object({ action: z.literal("demote") }),
  z.object({ action: z.literal("grant"), courseId: z.string().min(1) }),
  z.object({ action: z.literal("revokeAccess"), courseId: z.string().min(1) }),
  z.object({ action: z.literal("revokeCertificate"), certificateId: z.string().min(1) }),
  z.object({ action: z.literal("restoreCertificate"), certificateId: z.string().min(1) }),
]);

export async function PATCH(req: Request, { params }: RouteContext<"/api/admin/users/[id]">) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const target = await prisma.user.findUnique({ where: { id } });
  if (!target) return NextResponse.json({ error: "User not found." }, { status: 404 });

  const body = parsed.data;

  // An admin must not be able to lock themselves out of their own console.
  const selfDestructive =
    target.id === admin.id &&
    (body.action === "suspend" || body.action === "demote");
  if (selfDestructive) {
    return NextResponse.json(
      { error: "You cannot suspend or demote your own account." },
      { status: 409 },
    );
  }

  switch (body.action) {
    case "suspend":
      await prisma.user.update({ where: { id }, data: { status: "SUSPENDED" } });
      break;

    case "activate":
      await prisma.user.update({ where: { id }, data: { status: "ACTIVE" } });
      break;

    case "promote":
      await prisma.user.update({ where: { id }, data: { role: "ADMIN" } });
      break;

    case "demote": {
      // Refuse to remove the last remaining admin.
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot demote the only remaining admin." },
          { status: 409 },
        );
      }
      await prisma.user.update({ where: { id }, data: { role: "STUDENT" } });
      break;
    }

    case "grant":
      await prisma.enrollment.upsert({
        where: { userId_courseId: { userId: id, courseId: body.courseId } },
        update: {},
        create: { userId: id, courseId: body.courseId },
      });
      break;

    case "revokeAccess":
      await prisma.enrollment.deleteMany({
        where: { userId: id, courseId: body.courseId },
      });
      break;

    case "revokeCertificate":
    case "restoreCertificate": {
      // updateMany matches zero rows silently, so check before reporting ok —
      // otherwise a bad id looks like a successful revoke.
      const { count } = await prisma.certificate.updateMany({
        where: { id: body.certificateId, userId: id },
        data: {
          revokedAt: body.action === "revokeCertificate" ? new Date() : null,
        },
      });
      if (count === 0) {
        return NextResponse.json(
          { error: "Certificate not found for this user." },
          { status: 404 },
        );
      }
      break;
    }
  }

  return NextResponse.json({ ok: true });
}

export async function DELETE(
  _req: Request,
  { params }: RouteContext<"/api/admin/users/[id]">,
) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "Forbidden." }, { status: 403 });

  const { id } = await params;
  if (id === admin.id) {
    return NextResponse.json({ error: "You cannot delete your own account." }, { status: 409 });
  }

  const paymentCount = await prisma.payment.count({ where: { userId: id } });
  if (paymentCount > 0) {
    return NextResponse.json(
      {
        error:
          "This user has payment records, which must be kept. Suspend the account instead.",
      },
      { status: 409 },
    );
  }

  await prisma.user.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
