import Link from "next/link";
import Icon from "@/components/Icon";

export default function Hero({ courseCount }: { courseCount: number }) {
  return (
    <section className="relative overflow-hidden">
      {/* Magical mystical backdrop */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -left-40 -top-48 h-[32rem] w-[32rem] rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--blob-a)" }}
        />
        <div
          className="absolute -right-32 top-0 h-[28rem] w-[28rem] rounded-full opacity-50 blur-3xl"
          style={{ background: "var(--blob-b)" }}
        />
        <div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 h-80 w-80 rounded-full opacity-40 blur-3xl"
          style={{ background: "var(--blob-c)" }}
        />
      </div>

      {/* Decorative magical elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-10 left-10 text-4xl opacity-10 animate-float">✦</div>
        <div className="absolute top-32 right-20 text-3xl opacity-15 animate-float-gentle" style={{ animationDelay: "1s" }}>✧</div>
        <div className="absolute bottom-20 left-1/4 text-3xl opacity-10 animate-float" style={{ animationDelay: "2s" }}>✦</div>
        <div className="absolute bottom-32 right-1/4 text-2xl opacity-12 animate-float-gentle" style={{ animationDelay: "1.5s" }}>✧</div>
      </div>

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 pb-32 pt-20 lg:grid-cols-3 lg:pt-28">
        <div className="lg:col-span-2">
          <h1 className="text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl lg:text-7xl">
            Learn something
            <br />
            <span className="glow-text bg-gradient-to-r from-[var(--brand)] via-[var(--glow)] to-[var(--brand)] bg-clip-text text-transparent animate-glow-pulse">
              new today
            </span>
          </h1>

          <div className="mt-1 h-1 w-20 bg-gradient-to-r from-[var(--brand)] to-[var(--glow)] rounded-full opacity-60"></div>

          <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--text-muted)]">
            {courseCount} expert-led courses. Buy once, keep lifetime access. Begin your magical learning journey today.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href="#courses"
              className="focus-ring btn-primary group inline-flex items-center gap-3 rounded-full px-7 py-3.5 font-semibold text-white shadow-lg hover:shadow-xl transition transform hover:scale-105 press"
            >
              ✨ Explore Courses
              <span className="grid h-7 w-7 place-items-center rounded-full bg-white/25 transition group-hover:translate-x-1">
                <Icon name="arrowRight" className="h-4 w-4" />
              </span>
            </Link>

            <Link
              href="/register"
              className="focus-ring inline-flex items-center gap-2.5 rounded-full px-5 py-3.5 font-semibold text-[var(--text)] border border-[var(--border)] transition hover:text-[var(--brand)] hover:border-[var(--glow)] lift"
            >
              <Icon name="play" className="h-5 w-5 text-[var(--brand)]" />
              Start free
            </Link>
          </div>

          <div className="mt-12 flex items-center gap-4">
            <div className="flex -space-x-3">
              {["#D4A574", "#B8A0FF", "#E8C66F", "#D4679F"].map((c, i) => (
                <span
                  key={c}
                  className="grid h-10 w-10 place-items-center rounded-full border-2 border-[var(--bg)] text-xs font-bold text-white shadow-sm"
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

/** Magical stats showcase with glowing effects */
function HeroArt() {
  return (
    <div aria-hidden="true" className="relative mx-auto hidden lg:flex lg:flex-col lg:gap-4">
      {/* Stat Card 1 */}
      <div className="animate-fade-up group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)] hover:border-[var(--glow)] hover:shadow-lg transition-all overflow-hidden">
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition bg-gradient-to-br from-[var(--brand)] to-[var(--glow)]" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--glow)] text-white font-bold text-xl">
            12+
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">Expert Courses</p>
            <p className="text-sm font-medium text-[var(--text)]">Master-crafted content</p>
          </div>
        </div>
      </div>

      {/* Stat Card 2 */}
      <div className="animate-fade-up group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)] hover:border-[var(--glow)] hover:shadow-lg transition-all overflow-hidden" style={{ animationDelay: "0.1s" }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition bg-gradient-to-br from-[var(--brand)] to-[var(--glow)]" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow)] to-[var(--brand)] text-white font-bold">
            ∞
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">Lifetime Access</p>
            <p className="text-sm font-medium text-[var(--text)]">Learn at your pace</p>
          </div>
        </div>
      </div>

      {/* Stat Card 3 */}
      <div className="animate-fade-up group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)] hover:border-[var(--glow)] hover:shadow-lg transition-all overflow-hidden" style={{ animationDelay: "0.2s" }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition bg-gradient-to-br from-[var(--brand)] to-[var(--glow)]" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--glow)] text-white font-bold text-lg">
            ♥
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">1000+ Happy</p>
            <p className="text-sm font-medium text-[var(--text)]">Learners worldwide</p>
          </div>
        </div>
      </div>

      {/* Stat Card 4 */}
      <div className="animate-fade-up group rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-[var(--shadow-lift)] hover:border-[var(--glow)] hover:shadow-lg transition-all overflow-hidden" style={{ animationDelay: "0.3s" }}>
        <div className="absolute inset-0 opacity-0 group-hover:opacity-5 transition bg-gradient-to-br from-[var(--brand)] to-[var(--glow)]" />
        <div className="relative flex items-center gap-4">
          <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--glow)] to-[var(--brand)] text-white font-bold">
            24/7
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-[var(--text-faint)]">Support</p>
            <p className="text-sm font-medium text-[var(--text)]">Always here to help</p>
          </div>
        </div>
      </div>
    </div>
  );
}
