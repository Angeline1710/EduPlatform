import { NextResponse } from "next/server";
import { z } from "zod";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { stripe } from "@/lib/stripe";

const schema = z.object({ courseId: z.string().min(1) });

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json(
      { error: "You must be signed in to purchase." },
      { status: 401 },
    );
  }

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  // A suspended account keeps its data but must not be able to transact.
  const buyer = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { status: true },
  });
  if (buyer?.status === "SUSPENDED") {
    return NextResponse.json(
      { error: "This account is suspended and cannot enroll." },
      { status: 403 },
    );
  }

  const course = await prisma.course.findUnique({
    where: { id: parsed.data.courseId },
  });
  if (!course || !course.published) {
    return NextResponse.json({ error: "Course not found." }, { status: 404 });
  }

  const existing = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: { userId: session.user.id, courseId: course.id },
    },
  });
  if (existing) {
    return NextResponse.json(
      { error: "You already own this course." },
      { status: 409 },
    );
  }

  // Free courses have nothing to charge, so there is no payment provider to
  // wait on. Enrol immediately and record a settled zero-value payment, so
  // the ledger still shows one row per enrollment.
  if (course.price === 0) {
    await prisma.$transaction([
      prisma.enrollment.create({
        data: { userId: session.user.id, courseId: course.id },
      }),
      prisma.payment.create({
        data: {
          userId: session.user.id,
          courseId: course.id,
          stripeSessionId: `free_${session.user.id}_${course.id}`,
          amount: 0,
          status: "PAID",
        },
      }),
    ]);

    return NextResponse.json({ enrolled: true, courseId: course.id });
  }

  const origin = process.env.NEXTAUTH_URL ?? new URL(req.url).origin;

  let checkoutSession;
  try {
    checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: session.user.email ?? undefined,
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: "usd",
            unit_amount: course.price,
            product_data: {
              name: course.title,
              description: course.description.slice(0, 300),
            },
          },
        },
      ],
      metadata: { userId: session.user.id, courseId: course.id },
      // Return to the course, so the admission sequence plays against the
      // thing that was actually bought.
      success_url: `${origin}/courses/${course.id}?purchase=success`,
      cancel_url: `${origin}/courses/${course.id}?purchase=cancelled`,
    });
  } catch (err) {
    console.error("Stripe checkout failed:", err);
    return NextResponse.json(
      {
        error: "Payment provider unavailable. Check your Stripe keys in .env.",
      },
      { status: 502 },
    );
  }

  await prisma.payment.create({
    data: {
      userId: session.user.id,
      courseId: course.id,
      stripeSessionId: checkoutSession.id,
      amount: course.price,
      status: "PENDING",
    },
  });

  return NextResponse.json({ url: checkoutSession.url });
}
