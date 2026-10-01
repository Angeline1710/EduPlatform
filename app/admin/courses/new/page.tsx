import Link from "next/link";
import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/admin";
import CourseForm from "@/components/CourseForm";
import Icon from "@/components/Icon";

export default async function NewCoursePage() {
  const admin = await requireAdmin();
  if (!admin) redirect("/admin/login");

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <Link
        href="/admin"
        className="focus-ring mb-6 inline-flex items-center gap-2 rounded-full text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
      >
        <span className="rotate-180">
          <Icon name="arrowRight" className="h-4 w-4" />
        </span>
        Back to dashboard
      </Link>

      <h1 className="mb-8 text-4xl font-extrabold tracking-tight">
        New course
      </h1>
      <CourseForm />
    </div>
  );
}
