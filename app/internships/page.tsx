import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import Reveal from "@/components/Reveal";

export const metadata = {
  title: "Internships · EduPlatform",
  description: "Browse internship opportunities offered by EduPlatform.",
};

export default async function InternshipsPage() {
  const internships = await prisma.internship.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <>
      <PageHeader
        eyebrow="Opportunities"
        title="Internships"
        lead="Gain real-world experience. Apply for internships matched to your interests."
      />

      <section className="px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1400px]">

          <div className="mt-4 flex items-center gap-4 border-b border-gray-700 pb-4">
            <p className="text-sm text-gray-400">
              {internships.length === 0
                ? "No internships available yet."
                : <>Showing <span className="font-bold text-white">{internships.length}</span> internship{internships.length !== 1 ? "s" : ""}.</>}
            </p>
          </div>

          {internships.length === 0 ? (
            <div className="mx-auto mt-10 max-w-lg rounded border border-dashed border-gray-700 px-6 py-14 text-center">
              <p className="text-2xl font-bold text-white">No internships available yet.</p>
            </div>
          ) : (
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {internships.map((internship, i) => (
                <Reveal key={internship.id} delay={(i % 3) * 0.06}>
                  <div className="flex flex-col bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700 h-full">
                    <h2 className="text-xl font-bold text-white mb-2">{internship.title}</h2>
                    <p className="text-gray-400 text-sm mb-4 flex-1">{internship.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {internship.topics.split(",").map((t) => (
                        <span
                          key={t.trim()}
                          className="px-2 py-1 bg-emerald-900 text-emerald-300 text-xs rounded-full"
                        >
                          {t.trim()}
                        </span>
                      ))}
                    </div>
                    <a
                      href={`mailto:advinnetworks@gmail.com?subject=${encodeURIComponent(`Internship application: ${internship.title}`)}`}
                      className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white text-center font-medium py-2 px-4 rounded transition-colors"
                    >
                      Apply by Email
                    </a>
                  </div>
                </Reveal>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
