import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import CourseForm from "@/components/CourseForm";

export default async function NewCoursePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <Link href="/admin" className="mb-6 inline-block text-sm text-blue-600 hover:underline">
        ← Back to dashboard
      </Link>
      <h1 className="mb-6 text-3xl font-bold">New course</h1>
      <CourseForm />
    </div>
  );
}
