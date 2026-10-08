import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Hero from "@/components/Hero";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { Diamond } from "@/components/Ornament";
import { AcademyCrest } from "@/components/Crests";
import LivingInk from "@/components/magic/LivingInk";

const FEATURES = [
  {
    icon: "crown",
    title: "Lifetime Access",
    body: "Learn at your own pace, anytime, anywhere.",
  },
  {
    icon: "learners",
    title: "Expert Instructors",
    body: "Industry professionals with real-world experience.",
  },
  {
    icon: "book",
    title: "Premium Content",
    body: "High-quality lessons and hands-on projects.",
  },
  {
    icon: "headset",
    title: "24/7 Support",
    body: "We're here to help you succeed always.",
  },
];

export default async function HomePage() {
  const allCourses = await prisma.course.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
  });



  return (
    <>
      <Hero courseCount={allCourses.length} />

      <section
        id="courses"
        className="paper relative border-y border-[var(--border)] px-6 py-16 xl:px-10"
      >
        <div className="mx-auto max-w-[1400px]">
          <div
            className="mb-5 flex items-center justify-center gap-3"
            aria-hidden="true"
          >
            <span className="rule-fade w-20 sm:w-28" />
            <span className="text-[var(--gold)]">
              <AcademyCrest size={26} />
            </span>
            <span className="rule-fade w-20 sm:w-28" />
          </div>

          <h2 className="text-center font-serif text-[38px] leading-none tracking-tight text-[var(--brand)] sm:text-[46px]">
            <LivingInk>Our Programs</LivingInk>
          </h2>

          <div
            className="mt-4 flex items-center justify-center gap-2.5"
            aria-hidden="true"
          >
            <span className="rule-fade w-16" />
            <Diamond size={5} />
            <span className="rule-fade w-16" />
          </div>

          <div className="mt-16 mb-8 text-center text-2xl font-bold text-white">Courses</div>

          {allCourses.length === 0 ? (
            <div className="rounded-sm border border-dashed border-[var(--border-strong)] px-6 py-16 text-center">
              <p className="font-serif text-lg font-bold text-white">No courses found</p>
            </div>
          ) : (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {allCourses.map((course, i) => (
                <Reveal key={course.id} delay={(i % 3) * 0.06}>
                  <Link href={`/courses/${course.id}`} className="block h-full transition hover:scale-[1.02]">
                    <div className="bg-gray-800 p-6 rounded border border-gray-700 shadow-lg text-white h-full">
                      <h3 className="text-xl font-bold">{course.title}</h3>
                      <p className="mt-2 text-gray-400">{course.description}</p>
                      <div className="mt-4 flex gap-2 flex-wrap">
                        {course.topics.split(",").filter((topic) => topic.trim()).map(t => (
                          <span key={t.trim()} className="bg-indigo-600 text-xs px-2 py-1 rounded">{t.trim()}</span>
                        ))}
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          )}


        </div>
      </section>

      <section
        id="why"
        className="shell-panel border-t border-[var(--shell-line)] text-white"
      >
        <div className="mx-auto max-w-[1400px] px-6 pt-16 pb-8 xl:px-10">
          <h2 className="text-center font-serif text-[32px] font-bold text-[var(--gold)] mb-12">
            How Learning Works
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] mb-4 shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                <Icon name="search" className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Discover</h3>
              <p className="text-xs text-gray-400">Find your path in the archives</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] mb-4 shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                <Icon name="book" className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Learn</h3>
              <p className="text-xs text-gray-400">Study expert manuscripts</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] mb-4 shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                <Icon name="code" className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Practice</h3>
              <p className="text-xs text-gray-400">Apply knowledge directly</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full border border-[var(--gold)] flex items-center justify-center text-[var(--gold)] mb-4 shadow-[0_0_15px_rgba(201,162,39,0.3)]">
                <Icon name="award" className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-sm tracking-widest uppercase mb-2">Master</h3>
              <p className="text-xs text-gray-400">Earn your credentials</p>
            </div>
          </div>
        </div>

        <div className="mx-auto grid max-w-[1400px] gap-8 px-6 py-9 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0 xl:px-10 border-t border-[var(--shell-line-soft)] mt-8">
          {FEATURES.map((f, i) => (
            <div
              key={f.title}
              className={`group flex items-start gap-3.5 lg:px-7 ${
                i > 0 ? "lg:border-l lg:border-[var(--shell-line-soft)]" : ""
              }`}
            >
              <span className="mt-0.5 shrink-0 text-[var(--gold)] transition-transform duration-300 group-hover:scale-110">
                <Icon name={f.icon} className="h-7 w-7" />
              </span>
              <div className="min-w-0">
                <p className="font-serif font-bold text-[var(--shell-text)]">
                  {f.title}
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-[var(--shell-text-muted)]">
                  {f.body}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
