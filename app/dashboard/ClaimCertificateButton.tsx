"use client";

import { useState } from "react";
import { claimCertificate } from "./actions"; // We will create this action

export default function ClaimCertificateButton({
  enrollmentId,
  type,
  title,
  courseId,
  internshipId
}: {
  enrollmentId: string;
  type: "COURSE" | "INTERNSHIP";
  title: string;
  courseId?: string;
  internshipId?: string;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [date, setDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    if (!date) {
      setError("Please select a date.");
      return;
    }
    const selectedDate = new Date(date);
    const today = new Date();
    
    // Must be strictly within 1 month (past or future from today)
    const diffTime = Math.abs(selectedDate.getTime() - today.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    if (diffDays > 30) {
      setError("Date must be strictly within 1 month of today.");
      return;
    }

    setLoading(true);
    try {
      await claimCertificate({
        type,
        courseId,
        internshipId,
        issuedAt: selectedDate.toISOString(),
      });
      setIsOpen(false);
    } catch (err: any) {
      setError(err.message || "Failed to claim certificate.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="mt-4 bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded transition"
      >
        Claim Certificate
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 p-6 rounded-lg w-full max-w-md border border-gray-700 shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-2">Claim Certificate</h3>
            <p className="text-gray-400 text-sm mb-4">
              Enter the desired date and month of completion for <strong>{title}</strong>. (Must be within 1 month from today).
            </p>
            
            <input 
              type="date" 
              className="w-full bg-gray-900 border border-gray-600 rounded p-2 text-white mb-2"
              value={date}
              onChange={(e) => {
                setDate(e.target.value);
                setError("");
              }}
            />
            {error && <p className="text-red-400 text-xs mb-4">{error}</p>}

            <div className="flex justify-end gap-2 mt-6">
              <button 
                onClick={() => setIsOpen(false)}
                className="bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded text-sm transition"
              >
                Cancel
              </button>
              <button 
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
