"use client";

import { useState } from "react";
import AcademySeal from "./AcademySeal";
import QuillAnimation from "./QuillAnimation";
import { MagicButton } from "./MagicButton";

export default function EnrollmentModal({
  courseTitle,
  price,
  onClose,
  onConfirm,
}: {
  courseTitle: string;
  price: string;
  onClose: () => void;
  onConfirm: (name: string, email: string) => Promise<void>;
}) {
  const [step, setStep] = useState<"form" | "confirming" | "success">("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleEnroll = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) return;

    setError("");
    setStep("confirming");

    try {
      await onConfirm(name, email);
      setStep("success");
    } catch (err: any) {
      setError(err.message || "Enrollment could not be completed.");
      setStep("form");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm animate-fade-in">
      <div className="paper relative w-full max-w-lg overflow-hidden rounded-md border border-[var(--border)] shadow-[var(--shadow-panel)]">
        {/* Parchment border ornaments */}
        <div className="pointer-events-none absolute inset-2 border border-[var(--gold)] opacity-30" />

        <div className="relative p-8">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 text-[var(--text-faint)] hover:text-[var(--text)] transition"
          >
            ✕
          </button>

          <div className="mb-8 text-center">
            <h2 className="font-serif text-[28px] font-bold text-[var(--brand)]">
              Academy Admission
            </h2>
            <p className="mt-2 text-[var(--text-muted)] text-sm">
              Your place in{" "}
              <span className="font-semibold text-[var(--text)]">
                {courseTitle}
              </span>
            </p>
          </div>

          {step === "form" && (
            <form onSubmit={handleEnroll} className="space-y-5">
              <div>
                <label className="label">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input"
                  placeholder="e.g. David Moses"
                />
              </div>
              <div>
                <label className="label">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input"
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <div className="rounded border border-red-500/20 bg-red-500/10 p-3 text-sm text-red-600 dark:text-red-400">
                  {error}
                </div>
              )}

              <div className="pt-4 flex items-center justify-between border-t border-[var(--border)]">
                <span className="font-serif text-[22px] font-bold text-[var(--brand)]">
                  {price}
                </span>
                <MagicButton type="submit">Submit Record</MagicButton>
              </div>
            </form>
          )}

          {step === "confirming" && (
            <div className="flex flex-col items-center justify-center py-10 space-y-6 animate-fade-in">
              <p className="font-serif text-lg italic text-[var(--text-muted)]">
                Writing to the archives...
              </p>
              <div className="h-8">
                <QuillAnimation
                  text={name || "Student"}
                  className="font-serif text-2xl font-bold text-[var(--brand)]"
                />
              </div>
            </div>
          )}

          {step === "success" && (
            <div className="flex flex-col items-center justify-center py-6 space-y-6 text-center animate-fade-in">
              <AcademySeal size={80} />
              <div>
                <h3 className="font-serif text-[24px] font-bold text-[var(--brand)]">
                  ENROLLMENT CONFIRMED
                </h3>
                <p className="mt-2 text-[var(--text-muted)]">
                  Welcome, {name}. <br /> Your place has been recorded.
                </p>
              </div>
              <MagicButton onClick={onClose} fullWidth>
                Enter Course →
              </MagicButton>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
