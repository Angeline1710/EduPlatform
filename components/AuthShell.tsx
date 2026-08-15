import Link from "next/link";
import Icon from "@/components/Icon";

type AuthShellProps = {
  title: string;
  subtitle: string;
  /** Admin variant uses a slate accent so it reads as a separate door. */
  variant?: "student" | "admin";
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export default function AuthShell({
  title,
  subtitle,
  variant = "student",
  children,
  footer,
}: AuthShellProps) {
  const isAdmin = variant === "admin";

  return (
    <div className="relative flex min-h-[80vh] items-center justify-center px-6 py-16">
      {/* Magical backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-50 blur-3xl"
          style={{ background: isAdmin ? "var(--blob-c)" : "var(--blob-a)" }}
        />
        <div
          className="absolute -right-32 bottom-0 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--blob-b)" }}
        />
      </div>

      {/* Decorative stars */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div className="absolute top-20 left-10 text-2xl opacity-10 animate-float">✦</div>
        <div className="absolute top-1/3 right-1/4 text-2xl opacity-8 animate-float-gentle">✧</div>
        <div className="absolute bottom-32 left-1/3 text-xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>✦</div>
      </div>

      <div className="card w-full max-w-md p-8 shadow-[var(--shadow-panel)] border-[var(--border)] hover:border-[var(--glow)] hover:shadow-lg transition-all animate-fade-up">
        <Link href="/" className="mb-6 inline-flex items-center gap-2.5 transition hover:opacity-80">
          <span
            className={`grid h-10 w-10 place-items-center rounded-xl text-white shadow-md font-bold ${
              isAdmin ? "bg-gradient-to-br from-slate-600 to-slate-800" : "bg-gradient-to-br from-[var(--brand)] to-[var(--glow)]"
            }`}
          >
            <Icon name={isAdmin ? "lock" : "logo"} className="h-5 w-5" />
          </span>
          <span className="text-lg font-bold tracking-tight glow-text">EduPlatform</span>
        </Link>

        <div className="mb-4 h-0.5 w-16 bg-gradient-to-r from-[var(--brand)] to-[var(--glow)] rounded-full opacity-60"></div>

        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">✨ {subtitle}</p>

        <div className="mt-7">{children}</div>

        {footer && (
          <div className="mt-6 space-y-2 border-t border-[var(--border)] pt-5 text-sm text-[var(--text-muted)]">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}
