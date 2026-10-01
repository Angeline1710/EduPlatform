"use client";

import { useState, useEffect } from "react";
import AcademySeal from "./AcademySeal";
import QuillAnimation from "./QuillAnimation";
import { MagicButton } from "./MagicButton";
import { useRouter } from "next/navigation";

export default function SuccessFlow({ studentName }: { studentName: string }) {
  const [step, setStep] = useState<"writing" | "stamping" | "complete">(
    "writing",
  );
  const router = useRouter();

  useEffect(() => {
    // Sequence: writing -> stamping -> complete
    const t1 = setTimeout(() => setStep("stamping"), 2500);
    const t2 = setTimeout(() => setStep("complete"), 4500);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, []);

  const handleDismiss = () => {
    // Remove query param to prevent showing again on refresh
    router.replace("/dashboard");
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#1B1019]/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="paper relative w-full max-w-lg overflow-hidden rounded-md border border-[var(--border)] shadow-[0_0_40px_var(--academy-glow)]">
        <div className="pointer-events-none absolute inset-2 border border-[var(--gold)] opacity-30" />

        <div className="relative p-12 text-center min-h-[300px] flex flex-col items-center justify-center">
          {step === "writing" && (
            <div className="animate-fade-in flex flex-col items-center">
              <p className="font-serif text-lg italic text-[var(--text-muted)] mb-4">
                Inscribing the archives...
              </p>
              <QuillAnimation
                text={studentName}
                className="font-serif text-3xl font-bold text-[var(--brand)]"
              />
            </div>
          )}

          {step === "stamping" && (
            <div className="animate-fade-in">
              <AcademySeal size={100} show={true} />
            </div>
          )}

          {step === "complete" && (
            <div className="animate-fade-in space-y-6 flex flex-col items-center">
              <AcademySeal size={80} show={true} />
              <div>
                <h3 className="font-serif text-[28px] font-bold text-[var(--gold)]">
                  Enrollment Confirmed
                </h3>
                <p className="mt-2 text-[var(--text-muted)] text-[16px]">
                  Welcome to the study chamber, {studentName}.
                </p>
              </div>
              <MagicButton onClick={handleDismiss}>Open Manuscript</MagicButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
