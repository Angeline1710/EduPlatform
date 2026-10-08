"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addOneCalendarMonth } from "@/lib/certificate-dates";
import { claimCertificate } from "./actions";

export default function ClaimCertificateButton({
  type,
  title,
  courseId,
  internshipId,
  autoOpen = false,
  showTrigger = true,
  onClaimed,
}: {
  enrollmentId?: string;
  type: "COURSE" | "INTERNSHIP";
  title: string;
  courseId?: string;
  internshipId?: string;
  autoOpen?: boolean;
  showTrigger?: boolean;
  onClaimed?: (credentialId: string) => void;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(autoOpen);
  const [date, setDate] = useState("");
  const [periodStartDate, setPeriodStartDate] = useState("");
  const [periodEndDate, setPeriodEndDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const today = new Date();
  const todayUtc = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));
  const minDate = [
    todayUtc.getUTCFullYear(),
    String(todayUtc.getUTCMonth() + 1).padStart(2, "0"),
    String(todayUtc.getUTCDate()).padStart(2, "0"),
  ].join("-");
  const nextMonth = new Date(
    todayUtc.getUTCFullYear(),
    todayUtc.getUTCMonth() + 1,
    Math.min(
      todayUtc.getUTCDate(),
      new Date(Date.UTC(todayUtc.getUTCFullYear(), todayUtc.getUTCMonth() + 2, 0)).getUTCDate(),
    ),
  );
  nextMonth.setUTCDate(nextMonth.getUTCDate() - 1);
  const maxDate = [
    nextMonth.getUTCFullYear(),
    String(nextMonth.getUTCMonth() + 1).padStart(2, "0"),
    String(nextMonth.getUTCDate()).padStart(2, "0"),
  ].join("-");
  const expectedEndDate = periodStartDate ? addOneCalendarMonth(periodStartDate) : "";

  const handleClaim = async () => {
    if (type === "COURSE") {
      if (!periodStartDate || !periodEndDate) {
        setError("Choose both the course start date and completion date.");
        return;
      }
      if (periodEndDate !== expectedEndDate) {
        setError("The course completion period must be exactly one calendar month.");
        return;
      }
    } else if (!date) {
      setError("Please select a completion date.");
      return;
    }

    setLoading(true);
    try {
      const credentialId = await claimCertificate({
        type,
        courseId,
        internshipId,
        issuedAt: type === "INTERNSHIP" ? date : undefined,
        periodStartDate: type === "COURSE" ? periodStartDate : undefined,
        periodEndDate: type === "COURSE" ? periodEndDate : undefined,
      });
      setIsOpen(false);
      onClaimed?.(credentialId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to claim certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {showTrigger && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded transition"
        >
          Claim Certificate
        </button>
      )}

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" role="presentation">
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="claim-certificate-title"
            className="w-full max-w-md rounded-2xl border border-[var(--border)] bg-[var(--surface-2)] p-6 shadow-2xl"
          >
            <h3 id="claim-certificate-title" className="mb-2 text-xl font-bold text-white">
              {type === "COURSE" ? "Choose your course dates" : "Choose your completion date"}
            </h3>
            <p className="mb-4 text-sm text-gray-300">
              {type === "COURSE"
                ? <>Select the start and completion dates for <strong>{title}</strong>. The period must be exactly one calendar month.</>
                : <>Select a desired completion date for <strong>{title}</strong>.</>}
            </p>

            {type === "COURSE" ? (
              <div className="space-y-4">
                <div>
                  <label htmlFor="certificate-period-start" className="mb-2 block text-sm font-medium text-white">
                    From date
                  </label>
                  <input
                    id="certificate-period-start"
                    type="date"
                    required
                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white"
                    value={periodStartDate}
                    onChange={(event) => {
                      setPeriodStartDate(event.target.value);
                      setPeriodEndDate("");
                      setError("");
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="certificate-period-end" className="mb-2 block text-sm font-medium text-white">
                    To date
                  </label>
                  <input
                    id="certificate-period-end"
                    type="date"
                    min={expectedEndDate || undefined}
                    max={expectedEndDate || undefined}
                    required
                    disabled={!periodStartDate}
                    className="w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white disabled:cursor-not-allowed disabled:opacity-50"
                    value={periodEndDate}
                    onChange={(event) => {
                      setPeriodEndDate(event.target.value);
                      setError("");
                    }}
                  />
                  {periodStartDate && (
                    <p className="mt-1 text-xs text-gray-400">
                      For a one-month period, choose {expectedEndDate}.
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <>
                <label htmlFor="certificate-completion-date" className="mb-2 block text-sm font-medium text-white">
                  Completion date
                </label>
                <input
                  id="certificate-completion-date"
                  type="date"
                  min={minDate}
                  max={maxDate}
                  className="mb-2 w-full rounded-lg border border-gray-600 bg-gray-900 p-2 text-white"
                  value={date}
                  onChange={(event) => {
                    setDate(event.target.value);
                    setError("");
                  }}
                />
              </>
            )}
            {error && <p role="alert" className="mb-4 text-xs text-red-400">{error}</p>}

            <div className="flex justify-end gap-2 mt-6">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClaim}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded text-sm transition disabled:opacity-50"
              >
                {loading ? "Claiming..." : "Confirm & Claim"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
