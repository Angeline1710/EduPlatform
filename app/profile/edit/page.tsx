import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import ProfileForm from "@/components/ProfileForm";
import PageHeader from "@/components/PageHeader";
import Icon from "@/components/Icon";

export const metadata = { title: "Edit Record · EduPlatform" };

export default async function EditProfilePage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const record = await getProfile(session.user.id);
  if (!record) redirect("/login");

  const { user, profile, interests } = record;

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Edit Record"
        lead="Every field is optional. What you share shapes what the owl suggests."
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[900px]">
          <Link
            href="/profile"
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-[var(--text-muted)] transition hover:text-[var(--text)]"
          >
            <span className="rotate-180">
              <Icon name="arrowRight" className="h-4 w-4" />
            </span>
            Back to my record
          </Link>

          <ProfileForm
            initial={{
              name: user.name,
              headline: profile?.headline ?? "",
              bio: profile?.bio ?? "",
              // <input type="date"> needs YYYY-MM-DD.
              dateOfBirth: profile?.dateOfBirth
                ? profile.dateOfBirth.toISOString().slice(0, 10)
                : "",
              phone: profile?.phone ?? "",
              country: profile?.country ?? "",
              city: profile?.city ?? "",
              educationLevel: profile?.educationLevel ?? "",
              fieldOfStudy: profile?.fieldOfStudy ?? "",
              institution: profile?.institution ?? "",
              graduationYear: profile?.graduationYear ? String(profile.graduationYear) : "",
              occupation: profile?.occupation ?? "",
              experienceLevel: profile?.experienceLevel ?? "",
              interests,
              goals: profile?.goals ?? "",
              weeklyHours: profile?.weeklyHours ? String(profile.weeklyHours) : "",
              linkedinUrl: profile?.linkedinUrl ?? "",
              githubUrl: profile?.githubUrl ?? "",
              websiteUrl: profile?.websiteUrl ?? "",
              marketingOptIn: profile?.marketingOptIn ?? false,
            }}
            accolades={
              profile?.accolades.map((a) => ({
                id: a.id,
                kind: a.kind,
                title: a.title,
                issuer: a.issuer,
                year: a.year,
                url: a.url,
                description: a.description,
              })) ?? []
            }
          />
        </div>
      </section>
    </>
  );
}
