import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export default async function DashboardPage({ searchParams }: PageProps<"/dashboard">) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const { purchase } = await searchParams;

  const enrollments = await prisma.enrollment.findMany({
    where: { userId: session.user.id },
    orderBy: { purchasedAt: "desc" },
    include: { course: { include: { _count: { select: { lessons: true } } } } },
  });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      {purchase === "success" && (
        <div className="mb-6 rounded border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
          Payment successful. Your course is unlocked below.
        </div>
      )}

      <h1 className="mb-2 text-3xl font-bold">My courses</h1>
      <p className="mb-8 text-gray-600">Welcome back, {session.user.name}.</p>

      {enrollments.length === 0 ? (
        <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
          <p className="mb-4 text-gray-600">You have not enrolled in any courses yet.</p>
          <Link
            href="/"
            className="inline-block rounded bg-blue-600 px-5 py-2 font-medium text-white hover:bg-blue-700"
          >
            Browse courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrollments.map(({ id, course }) => (
            <Link
              key={id}
              href={`/learn/${course.id}`}
              className="flex flex-col rounded-lg border border-gray-200 bg-white p-5 transition hover:shadow-md"
            >
              <h2 className="mb-2 text-lg font-semibold">{course.title}</h2>
              <p className="mb-4 flex-1 text-sm text-gray-600">{course.description}</p>
              <span className="text-sm font-medium text-blue-600">
                Continue · {course._count.lessons} lessons
              </span>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
