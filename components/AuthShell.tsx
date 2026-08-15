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
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: isAdmin ? "var(--blob-c)" : "var(--blob-a)" }}
        />
      </div>

      <div className="card w-full max-w-md p-8 shadow-[var(--shadow-panel)]">
        <Link href="/" className="mb-6 flex items-center gap-2.5">
          <span
            className={`grid h-9 w-9 place-items-center rounded-xl text-white shadow-md ${
              isAdmin ? "bg-slate-700" : "brand-gradient"
            }`}
          >
            <Icon name={isAdmin ? "lock" : "logo"} className="h-[18px] w-[18px]" />
          </span>
          <span className="text-lg font-bold tracking-tight">EduPlatform</span>
        </Link>

        <h1 className="text-2xl font-bold tracking-tight">{title}</h1>
        <p className="mt-1.5 text-sm text-[var(--text-muted)]">{subtitle}</p>

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
