import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import PageHeader from "@/components/PageHeader";
import ClaimCertificateButton from "./ClaimCertificateButton";

export const metadata = { title: "My Learning · EduPlatform" };

function greeting(d: Date) {
  const h = d.getHours();
  if (h < 12) return "Good morning";
  if (h < 18) return "Good afternoon";
  return "Good evening";
}

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.email) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      desiredCourses: true,
      courseEnrollments: { include: { course: true } },
      internshipEnrollments: { include: { internship: true } },
      certificates: { include: { course: true, internship: true } },
    },
  });

  if (!user) redirect("/login");

  const enrolledCourseIds = user.courseEnrollments.map(e => e.courseId);
  const completedCourses = user.courseEnrollments
    .filter(e => e.completedAt || user.certificates.some(c => c.courseId === e.courseId))
    .map(e => e.course);
  
  const topics = new Set<string>();
  completedCourses.forEach(c => {
    c.topics.split(",").forEach(t => topics.add(t.trim().toLowerCase()));
  });
  user.desiredCourses.forEach(d => topics.add(d.topic.trim().toLowerCase()));

  const allOtherCourses = await prisma.course.findMany({
    where: { id: { notIn: enrolledCourseIds } }
  });

  const recommendedCourses = allOtherCourses.map(course => {
    const courseTopics = course.topics.split(",").map(t => t.trim().toLowerCase());
    const score = courseTopics.reduce((acc, t) => acc + (topics.has(t) ? 1 : 0), 0);
    return { course, score };
  })
  .sort((a, b) => b.score - a.score)
  .map(c => c.course)
  .slice(0, 3);

  const firstName = session.user.name?.split(" ")[0] ?? "Scholar";

  return (
    <>
      <PageHeader
        eyebrow={greeting(new Date())}
        title={firstName}
        lead="Manage your courses, internships, and desired learning paths."
      />

      <section className="min-h-[60vh] px-6 py-12 xl:px-10 text-white">
        <div className="mx-auto max-w-[1400px] grid gap-8 lg:grid-cols-3">
          
          <div className="lg:col-span-2 space-y-8">
            {/* Enrollments */}
            <div>
              <h2 className="mb-4 text-2xl font-bold border-b border-gray-700 pb-2">Active Enrollments</h2>
              
              {user.courseEnrollments.length === 0 && user.internshipEnrollments.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded text-center border border-gray-700 text-gray-400">
                  You are not enrolled in any programs yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.courseEnrollments.map(e => {
                    const claimed = user.certificates.some(c => c.courseId === e.courseId);
                    return (
                      <div key={e.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                        <span className="text-xs bg-indigo-600 text-white px-2 py-1 rounded">Course</span>
                        <Link href={`/courses/${e.courseId}`} className="hover:underline text-indigo-300">
                          <h3 className="text-lg font-bold mt-2">{e.course.title}</h3>
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                        {!claimed && (
                          <ClaimCertificateButton 
                            enrollmentId={e.id} 
                            type="COURSE" 
                            title={e.course.title} 
                            courseId={e.courseId} 
                          />
                        )}
                        {claimed && <p className="mt-4 text-xs text-emerald-400">Certificate Claimed ✓</p>}
                      </div>
                    );
                  })}
                  {user.internshipEnrollments.map(e => {
                    const claimed = user.certificates.some(c => c.internshipId === e.internshipId);
                    return (
                      <div key={e.id} className="bg-gray-800 p-4 rounded border border-gray-700">
                        <span className="text-xs bg-emerald-600 text-white px-2 py-1 rounded">Internship</span>
                        <Link href={`/internships/${e.internshipId}`} className="hover:underline text-emerald-300">
                          <h3 className="text-lg font-bold mt-2">{e.internship.title}</h3>
                        </Link>
                        <p className="text-sm text-gray-400 mt-1">Enrolled: {new Date(e.enrolledAt).toLocaleDateString()}</p>
                        {!claimed && (
                          <ClaimCertificateButton 
                            enrollmentId={e.id} 
                            type="INTERNSHIP" 
                            title={e.internship.title} 
                            internshipId={e.internshipId} 
                          />
                        )}
                        {claimed && <p className="mt-4 text-xs text-emerald-400">Certificate Claimed ✓</p>}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Certificates */}
            <div>
              <h2 className="mb-4 text-2xl font-bold border-b border-gray-700 pb-2">My Certificates</h2>
              
              {user.certificates.length === 0 ? (
                <div className="bg-gray-800 p-6 rounded text-center border border-gray-700 text-gray-400">
                  No certificates earned yet.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {user.certificates.map(c => (
                    <Link key={c.id} href={`/verify/${c.credentialId}`} className="block bg-gray-800 p-4 rounded border border-gray-700 hover:border-indigo-500 transition">
                      <h3 className="text-lg font-bold">{c.course?.title || c.internship?.title}</h3>
                      <p className="text-xs text-indigo-400 font-mono mt-1">{c.credentialId}</p>
                      <p className="text-sm text-gray-400 mt-2">Issued: {new Date(c.issuedAt).toLocaleDateString()}</p>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <aside className="space-y-6">
            {/* Recommendations */}
            <div className="bg-gray-800 p-6 rounded border border-gray-700">
              <h3 className="text-lg font-bold mb-4 border-b border-gray-700 pb-2">Recommended for You</h3>
              {recommendedCourses.length === 0 ? (
                <p className="text-sm text-gray-400 mb-4">Keep learning to get personalized recommendations!</p>
              ) : (
                <div className="space-y-4 mb-4">
                  {recommendedCourses.map(rc => (
                    <Link key={rc.id} href={`/courses/${rc.id}`} className="block bg-gray-900 p-3 rounded border border-gray-700 hover:border-indigo-500 transition">
                      <h4 className="font-bold text-sm text-indigo-300">{rc.title}</h4>
                      <p className="text-xs text-gray-400 mt-1 line-clamp-2">{rc.description}</p>
                    </Link>
                  ))}
                </div>
              )}
              
              <Link href="/courses" className="text-sm text-indigo-400 hover:text-indigo-300 transition">
                Browse All Courses &rarr;
              </Link>
            </div>

            {/* Desired Courses */}
            <div className="bg-gray-800 p-6 rounded border border-gray-700">
              <h3 className="text-lg font-bold mb-4">My Desired Topics</h3>
              {user.desiredCourses.length === 0 ? (
                <p className="text-sm text-gray-400 mb-4">No desired topics added yet.</p>
              ) : (
                <ul className="space-y-2 mb-4">
                  {user.desiredCourses.map(dc => (
                    <li key={dc.id} className="bg-gray-900 px-3 py-2 rounded text-sm text-gray-300">
                      {dc.topic}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
