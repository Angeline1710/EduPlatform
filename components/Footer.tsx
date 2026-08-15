import Link from "next/link";
import Icon from "@/components/Icon";

export default function Footer() {
  return (
    <footer className="mt-24 border-t border-[var(--border)] bg-[var(--bg-subtle)]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-10 sm:flex-row sm:items-center sm:justify-between">
        <Link href="/" className="flex items-center gap-2.5">
          <span className="brand-gradient grid h-8 w-8 place-items-center rounded-lg text-white shadow-sm">
            <Icon name="logo" className="h-4 w-4" />
          </span>
          <span className="text-lg font-bold tracking-tight">EduPlatform</span>
        </Link>

        <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--text-muted)]">
          <Link href="/" className="transition hover:text-[var(--text)]">
            Courses
          </Link>
          <Link href="/dashboard" className="transition hover:text-[var(--text)]">
            My learning
          </Link>
          <Link href="/verify" className="transition hover:text-[var(--text)]">
            Verify credential
          </Link>
          <Link href="/admin/login" className="transition hover:text-[var(--text)]">
            Admin
          </Link>
          <a
            href="https://www.linkedin.com/company/zerobugsolutions/"
            target="_blank"
            rel="noopener noreferrer"
            className="focus-ring inline-flex items-center gap-1.5 transition hover:text-[var(--text)]"
          >
            <Icon name="linkedin" className="h-4 w-4" />
            LinkedIn
          </a>
        </nav>

        <p className="text-sm text-[var(--text-faint)]">
          &copy; {new Date().getFullYear()} EduPlatform
        </p>
      </div>
    </footer>
  );
}
