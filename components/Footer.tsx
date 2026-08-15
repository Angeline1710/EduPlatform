import Link from "next/link";
import Icon from "@/components/Icon";
import { Crest, Diamond } from "@/components/Ornament";

export default function Footer() {
  return (
    <footer className="shell-panel border-t border-[var(--shell-line)]">
      <div className="mx-auto max-w-[1400px] px-6 py-9 xl:px-10">
        <div className="flex items-center gap-3" aria-hidden="true">
          <span className="rule-fade flex-1" />
          <Diamond size={5} />
          <span className="rule-fade w-16" />
          <Diamond size={5} />
          <span className="rule-fade flex-1" />
        </div>

        <div className="mt-7 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <Link href="/" className="group flex items-center gap-3">
            <span className="transition-transform duration-500 group-hover:scale-105">
              <Crest size={32} />
            </span>
            <span>
              <span className="gold-leaf block font-serif text-lg font-bold leading-none">
                EduPlatform
              </span>
              <span className="mt-1 block text-[10px] uppercase tracking-[0.22em] text-[var(--shell-text-muted)]">
                Learn. Grow. Succeed.
              </span>
            </span>
          </Link>

          <nav className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-[var(--shell-text-muted)]">
            <Link href="/" className="transition hover:text-[var(--gold-bright)]">
              Courses
            </Link>
            <Link href="/dashboard" className="transition hover:text-[var(--gold-bright)]">
              My learning
            </Link>
            <Link href="/verify" className="transition hover:text-[var(--gold-bright)]">
              Verify credential
            </Link>
            <Link href="/admin/login" className="transition hover:text-[var(--gold-bright)]">
              Admin
            </Link>
            <a
              href="https://www.linkedin.com/company/zerobugsolutions/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition hover:text-[var(--gold-bright)]"
            >
              <Icon name="linkedin" className="h-4 w-4" />
              LinkedIn
            </a>
          </nav>

          <p className="text-sm text-[var(--shell-text-muted)]">
            &copy; {new Date().getFullYear()} EduPlatform
          </p>
        </div>
      </div>
    </footer>
  );
}
