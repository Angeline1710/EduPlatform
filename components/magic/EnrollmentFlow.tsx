"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Icon from "@/components/Icon";
import { AcademyCrest } from "@/components/Crests";

type Phase =
  | "idle"
  | "checking"
  | "redirecting"
  | "confirming"
  | "inscribing"
  | "sealed"
  | "owned"
  | "error";

/**
 * Enrollment, front to back.
 *
 * The rule this component exists to enforce: the admission sequence is only
 * ever played after `/api/enrollment/status` reports `enrolled`. Nothing here
 * assumes a purchase succeeded — a failed or abandoned payment falls through
 * to an error state and no access is implied.
 *
 * Free courses come back `{ enrolled: true }` from checkout and go straight
 * to confirmation; paid ones leave for Stripe and are confirmed on return.
 */
export default function EnrollmentFlow({
  courseId,
  courseTitle,
  priceLabel,
  isFree,
  initiallyEnrolled,
  signedIn,
  /** Set when Stripe has just sent the student back. */
  returningFromCheckout = false,
}: {
  courseId: string;
  courseTitle: string;
  priceLabel: string;
  isFree: boolean;
  initiallyEnrolled: boolean;
  signedIn: boolean;
  returningFromCheckout?: boolean;
}) {
  const router = useRouter();
  const [phase, setPhase] = useState<Phase>(
    initiallyEnrolled ? "owned" : "idle",
  );
  const [error, setError] = useState("");
  const [holder, setHolder] = useState<string | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(
    () => () => {
      if (pollRef.current) window.clearInterval(pollRef.current);
    },
    [],
  );

  /**
   * Waits for the webhook to land. Stripe redirects the student back before
   * it has necessarily delivered the event, so the confirmed state is polled
   * rather than assumed from the redirect alone.
   */
  function confirmEnrollment() {
    setPhase("confirming");
    let attempts = 0;

    const check = async () => {
      attempts++;
      try {
        const res = await fetch(`/api/enrollment/status?courseId=${courseId}`, {
          cache: "no-store",
        });
        const data = await res.json();

        if (data.state === "enrolled") {
          window.clearInterval(pollRef.current!);
          setHolder(data.holderName);
          setPhase("inscribing");
          // Let the quill finish before the seal drops.
          window.setTimeout(() => setPhase("sealed"), 1900);
          router.refresh();
          return;
        }

        if (data.state === "payment-failed") {
          window.clearInterval(pollRef.current!);
          setError(
            "Your payment was not confirmed. No course access has been granted.",
          );
          setPhase("error");
          return;
        }

        // Give the webhook ~20s, then stop claiming anything either way.
        if (attempts > 10) {
          window.clearInterval(pollRef.current!);
          setError(
            "Payment is still being confirmed. Refresh in a moment — access appears as soon as it settles.",
          );
          setPhase("error");
        }
      } catch {
        // Network blips are expected; keep polling until the attempt cap.
      }
    };

    check();
    pollRef.current = window.setInterval(check, 2000);
  }

  // Coming back from Stripe: confirm before showing anything celebratory.
  useEffect(() => {
    if (returningFromCheckout && !initiallyEnrolled) confirmEnrollment();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [returningFromCheckout, initiallyEnrolled]);

  async function begin() {
    if (!signedIn) {
      router.push(`/login?next=/courses/${courseId}`);
      return;
    }

    setPhase("checking");
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Enrollment could not be started.");
        setPhase("error");
        return;
      }

      if (data.enrolled) {
        // Free course — already recorded server-side.
        confirmEnrollment();
        return;
      }

      setPhase("redirecting");
      window.location.href = data.url;
    } catch {
      setError(
        "Could not reach the academy. Check your connection and try again.",
      );
      setPhase("error");
    }
  }

  if (phase === "owned") {
    return (
      <Link
        href={`/learn/${courseId}`}
        className="rune-edge flex w-full items-center justify-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-6 py-3.5 font-semibold text-[var(--on-gold)] shadow-[0_0_18px_var(--academy-glow)] transition hover:brightness-110"
      >
        Enter the course
        <Icon name="arrowRight" className="h-4 w-4" />
      </Link>
    );
  }

  const busy = phase === "checking" || phase === "redirecting";

  return (
    <>
      <button
        onClick={begin}
        disabled={busy}
        className="rune-edge flex w-full items-center justify-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-6 py-3.5 font-semibold text-[var(--on-gold)] shadow-[0_0_18px_var(--academy-glow)] transition hover:brightness-110 disabled:opacity-60"
      >
        {busy ? (
          <>
            <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--on-gold)] border-t-transparent" />
            {phase === "redirecting" ? "Opening checkout..." : "Preparing..."}
          </>
        ) : (
          <>
            {isFree ? "Enroll free" : `Enroll — ${priceLabel}`}
            <Icon name="arrowRight" className="h-4 w-4" />
          </>
        )}
      </button>

      {phase === "error" && (
        <div className="mt-3 rounded-sm border border-red-500/40 bg-red-500/10 px-4 py-3">
          <p className="text-sm font-semibold text-red-500">
            Enrollment could not be completed.
          </p>
          <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
            {error}
          </p>
        </div>
      )}

      {(phase === "confirming" ||
        phase === "inscribing" ||
        phase === "sealed") && (
        <AdmissionOverlay
          phase={phase}
          courseTitle={courseTitle}
          holder={holder}
          courseId={courseId}
        />
      )}
    </>
  );
}

/** The admission parchment. Only ever mounted on confirmed server state. */
function AdmissionOverlay({
  phase,
  courseTitle,
  holder,
  courseId,
}: {
  phase: Phase;
  courseTitle: string;
  holder: string | null;
  courseId: string;
}) {
  const [written, setWritten] = useState("");

  // The quill writes the account's real name, character by character.
  useEffect(() => {
    if (phase !== "inscribing" && phase !== "sealed") return;
    const name = holder ?? "";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setWritten(name);
      return;
    }
    let i = 0;
    const t = window.setInterval(() => {
      i++;
      setWritten(name.slice(0, i));
      if (i >= name.length) window.clearInterval(t);
    }, 70);
    return () => window.clearInterval(t);
  }, [phase, holder]);

  return (
    <div className="fixed inset-0 z-[90] grid place-items-center bg-black/70 px-6 backdrop-blur-sm">
      <div className="paper animate-fade-up relative w-full max-w-lg rounded-sm border-[6px] border-[var(--surface-2)] p-10 text-center shadow-[0_0_60px_rgba(0,0,0,0.6)]">
        <div className="pointer-events-none absolute inset-2 border border-[var(--gold)] opacity-40" />

        {phase === "confirming" ? (
          <>
            <span className="mx-auto mb-5 block h-10 w-10 animate-spin rounded-full border-2 border-[var(--gold)] border-t-transparent" />
            <p className="font-serif text-2xl font-bold text-[var(--brand)]">
              Confirming your payment
            </p>
            <p className="mt-2 text-sm text-[var(--text-muted)]">
              Your place is recorded only once the payment settles.
            </p>
          </>
        ) : (
          <>
            <span className="mx-auto mb-4 flex justify-center text-[var(--gold)]">
              <AcademyCrest size={54} />
            </span>

            <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[var(--text-faint)]">
              Enrollment Confirmed
            </p>

            <p className="mt-5 font-serif text-lg italic text-[var(--text-muted)]">
              Be it known that
            </p>

            {/* Name inscribed by the quill */}
            <p className="mt-2 min-h-[3rem] font-serif text-4xl font-bold text-[var(--brand)]">
              {written}
              {phase === "inscribing" && (
                <span className="ml-0.5 inline-block h-8 w-[2px] animate-pulse bg-[var(--gold)] align-middle" />
              )}
            </p>

            <p className="mt-4 font-serif text-lg italic text-[var(--text-muted)]">
              has been admitted to
            </p>
            <p className="mt-1 font-serif text-2xl font-bold text-[var(--text)]">
              {courseTitle}
            </p>

            {phase === "sealed" && (
              <>
                {/* The seal presses down once the name is written */}
                <span className="animate-seal-press relative mx-auto mt-7 grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] text-[var(--on-gold)] shadow-[0_0_28px_var(--academy-glow)]">
                  <span className="absolute inset-0 animate-[seal-ring_1.1s_ease-out_forwards] rounded-full border-2 border-[var(--gold)]" />
                  <Icon name="award" className="h-9 w-9" />
                </span>

                <Link
                  href={`/learn/${courseId}`}
                  className="rune-edge mt-8 inline-flex items-center gap-2 rounded-md border border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] px-7 py-3 font-semibold text-[var(--on-gold)] transition hover:brightness-110"
                >
                  Begin the course
                  <Icon name="arrowRight" className="h-4 w-4" />
                </Link>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
