import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { qrSvg, verificationUrl } from "@/lib/qr";
import Certificate from "@/components/Certificate";
import PrintButton from "@/components/PrintButton";
import Icon from "@/components/Icon";

export default async function CertificatePage({
  params,
}: PageProps<"/certificates/[code]">) {
  const { code } = await params;
  const session = await auth();
  if (!session?.user) redirect("/login");

  const certificate = await prisma.certificate.findUnique({
    where: { code },
    include: {
      user: { select: { id: true, name: true } },
      course: {
        select: { title: true, category: true, _count: { select: { lessons: true } } },
      },
    },
  });

  if (!certificate) notFound();

  // Holders see their own credential; admins can view any.
  const isOwner = certificate.userId === session.user.id;
  const isAdmin = session.user.role === "ADMIN";
  if (!isOwner && !isAdmin) notFound();

  const verifyUrl = verificationUrl(certificate.code);
  const qrMarkup = await qrSvg(verifyUrl);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 print:hidden">
        <Link
          href="/dashboard"
          className="focus-ring inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
        >
          <span className="rotate-180">
            <Icon name="arrowRight" className="h-4 w-4" />
          </span>
          My learning
        </Link>

        <div className="flex items-center gap-3">
          <Link href={`/verify/${certificate.code}`} className="btn btn-secondary press">
            <Icon name="search" className="h-4 w-4" />
            Public link
          </Link>
          <PrintButton />
        </div>
      </div>

      <div className="animate-pop-in">
        <Certificate
          holderName={certificate.user.name}
          courseTitle={certificate.course.title}
          category={certificate.course.category}
          code={certificate.code}
          issuedAt={certificate.issuedAt}
          lessonCount={certificate.course._count.lessons}
          qrMarkup={qrMarkup}
          verifyUrl={verifyUrl}
          revoked={Boolean(certificate.revokedAt)}
        />
      </div>
    </div>
  );
}
