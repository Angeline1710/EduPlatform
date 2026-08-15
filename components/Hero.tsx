import Link from "next/link";
import Icon from "@/components/Icon";

export default function Hero({ courseCount }: { courseCount: number }) {
  return (
    <section className="relative overflow-hidden">
      {/* Soft colour blobs behind the hero */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-32 -top-40 h-[28rem] w-[28rem] rounded-full opacity-70 blur-3xl"
          style={{ background: "var(--blob-a)" }}
        />
        <div
          className="absolute -right-20 top-10 h-[26rem] w-[26rem] rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--blob-b)" }}
        />
        <div
          className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--blob-c)" }}
        />
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-28 pt-16 lg:grid-cols-2 lg:pt-24">
        <div>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
            Learn something
            <br />
            <span className="text-gradient">new today</span>
          </h1>

          <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--text-muted)]">
            {courseCount} expert-led courses. Buy once, keep lifetime access.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="#courses"
              className="focus-ring brand-gradient group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg transition hover:opacity-90"
            >
              Explore Courses
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/20 transition group-hover:translate-x-0.5">
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/register"
              className="focus-ring inline-flex items-center gap-2.5 rounded-full px-4 py-3.5 font-semibold text-[var(--text)] transition hover:text-[var(--brand)]"
            >
              Start free
              <Icon name="play" className="h-7 w-7 text-[var(--brand)]" />
            </Link>
          </div>

          <div className="mt-10 flex items-center gap-3">
            <div className="flex -space-x-2.5">
              {["#8b5cf6", "#ec4899", "#f59e0b", "#10b981"].map((c, i) => (
                <span
                  key={c}
                  className="grid h-9 w-9 place-items-center rounded-full border-2 border-[var(--bg)] text-xs font-bold text-white"
                  style={{ background: c }}
                >
                  {["A", "M", "J", "S"][i]}
                </span>
              ))}
            </div>
            <p className="text-sm leading-tight text-[var(--text-muted)]">
              Join <span className="font-semibold text-[var(--text)]">20K+ learners</span>
              <br />
              growing their skills
            </p>
          </div>
        </div>

        <HeroArt />
      </div>
    </section>
  );
}

/** Decorative composition: floating stat cards over an abstract study scene. */
function HeroArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden h-[26rem] w-full max-w-lg lg:block">
      <div
        className="absolute inset-6 rounded-[3rem] opacity-90"
        style={{ background: "linear-gradient(150deg, var(--blob-a), var(--blob-b))" }}
      />

      {/* Desk scene */}
      <svg viewBox="0 0 400 340" className="absolute inset-0 h-full w-full">
        <defs>
          <linearGradient id="hoodie" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>
          <linearGradient id="laptop" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e2e0f0" />
            <stop offset="100%" stopColor="#b9b5d4" />
          </linearGradient>
        </defs>

        {/* head + body */}
        <circle cx="200" cy="120" r="34" fill="#f5c9a8" />
        <path d="M166 112a34 34 0 0 1 68 0c0-26-14-38-34-38s-34 12-34 38z" fill="#3b2f2a" />
        <path d="M150 250c0-33 22-56 50-56s50 23 50 56z" fill="url(#hoodie)" />
        {/* laptop */}
        <path d="M138 250h124l16 30H122z" fill="url(#laptop)" />
        <rect x="150" y="205" width="100" height="46" rx="4" fill="#cfcbe6" />
        <circle cx="200" cy="228" r="6" fill="#8b5cf6" opacity=".7" />
        {/* desk items */}
        <rect x="86" y="262" width="34" height="8" rx="2" fill="#f472b6" />
        <rect x="90" y="254" width="34" height="8" rx="2" fill="#818cf8" />
        <rect x="286" y="252" width="22" height="20" rx="3" fill="#a5b4fc" />
        <circle cx="98" cy="232" r="14" fill="#34d399" />
      </svg>

      {/* Floating: progress */}
      <div className="absolute left-0 top-8 w-44 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4 shadow-[var(--shadow-lift)]">
        <p className="text-xs font-medium text-[var(--text-muted)]">Your Progress</p>
        <p className="mt-1 text-2xl font-bold text-[var(--brand)]">68%</p>
        <div className="mt-2 h-2 overflow-hidden rounded-full bg-[var(--surface-2)]">
          <div className="brand-gradient h-full w-[68%] rounded-full" />
        </div>
      </div>

      {/* Floating: certificate */}
      <div className="absolute bottom-16 left-2 flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 shadow-[var(--shadow-lift)]">
        <span className="grid h-9 w-9 place-items-center rounded-full bg-[var(--brand-soft)] text-[var(--brand)]">
          <Icon name="award" className="h-5 w-5" />
        </span>
        <span className="text-sm font-semibold">Certificate Earned</span>
      </div>

      {/* Floating icon tiles */}
      <span className="absolute right-2 top-16 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-500 text-white shadow-lg">
        <Icon name="code" className="h-5 w-5" />
      </span>
      <span className="absolute -right-1 top-44 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg">
        <Icon name="play" className="h-5 w-5" />
      </span>
      <span className="absolute bottom-20 right-6 grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-lg">
        <Icon name="chart" className="h-5 w-5" />
      </span>
    </div>
  );
}
