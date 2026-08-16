import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { getProfile } from "@/lib/profile";
import PageHeader from "@/components/PageHeader";
import ProfileTabs from "@/components/profile/ProfileTabs";
import SettingsForm from "@/components/profile/SettingsForm";
import Icon from "@/components/Icon";

export const metadata = { title: "Settings · EduPlatform" };

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const record = await getProfile(session.user.id);
  if (!record) redirect("/login");

  const { user, profile } = record;

  return (
    <>
      <PageHeader
        eyebrow="The Academy"
        title="Settings"
        lead="Visibility, contact preferences, and how you sign in."
      />

      <section className="paper min-h-[60vh] px-6 py-12 xl:px-10">
        <div className="mx-auto max-w-[900px]">
          <ProfileTabs />

          <SettingsForm
            email={user.email}
            isPublic={profile?.isPublic ?? false}
            marketingOptIn={profile?.marketingOptIn ?? false}
          />

          {/* Public link, only once it would actually work */}
          {profile?.isPublic && (
            <div className="mt-6 rounded-sm border border-[var(--gold)]/50 bg-[var(--gold-soft)] p-5">
              <h2 className="flex items-center gap-2 font-serif text-lg font-bold text-[var(--brand)]">
                <Icon name="grid" className="h-4 w-4" />
                Your public page
              </h2>
              <p className="mt-1.5 text-sm text-[var(--text-muted)]">
                Anyone with this link can see your record.
              </p>
              <Link
                href={`/scholar/${user.id}`}
                className="mt-3 inline-flex items-center gap-2 break-all font-mono text-sm text-[var(--brand)] hover:underline"
              >
                /scholar/{user.id}
                <Icon name="arrowRight" className="h-3.5 w-3.5 shrink-0" />
              </Link>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
