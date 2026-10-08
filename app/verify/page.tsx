import Icon from "@/components/Icon";
import VerifyForm from "@/components/VerifyForm";

export const metadata = {
  title: "Verify a credential · EduPlatform",
  description: "Check whether an EduPlatform certificate is genuine.",
};

export default function VerifyLandingPage() {
  return (
    <div className="relative">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10"
      >
        <div
          className="absolute left-1/2 top-0 h-96 w-96 -translate-x-1/2 rounded-full opacity-60 blur-3xl"
          style={{ background: "var(--blob-a)" }}
        />
      </div>

      <div className="mx-auto max-w-xl px-6 py-20 text-center">
        <span className="animate-pop-in mx-auto mb-6 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] text-[var(--on-gold)] shadow-[0_0_24px_var(--academy-glow)]">
          <Icon name="award" className="h-10 w-10" />
        </span>

        <h1 className="animate-fade-up text-4xl font-serif font-bold tracking-tight sm:text-5xl text-[var(--brand)]">
          Verify a{" "}
          <span className="bg-gradient-to-r from-[var(--gold-bright)] to-[var(--gold)] bg-clip-text text-transparent animate-glow-pulse">
            Credential
          </span>
        </h1>
        <p
          className="animate-fade-up mt-4 text-[var(--text-muted)] text-lg"
          style={{ animationDelay: "0.08s" }}
        >
          Enter the credential ID printed on the certificate.
        </p>

        <div
          className="animate-fade-up mt-10"
          style={{ animationDelay: "0.16s" }}
        >
          <VerifyForm />
        </div>

        <p className="mt-6 text-xs text-[var(--text-faint)]">
          Credential IDs start with{" "}
          <span className="font-mono">EDU-</span> followed by the ID printed on
          the certificate.
        </p>
      </div>
    </div>
  );
}
