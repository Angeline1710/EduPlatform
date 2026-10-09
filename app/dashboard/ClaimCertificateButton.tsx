"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { claimCertificate } from "./actions";

export default function ClaimCertificateButton({
  type,
  title,
  courseId,
  internshipId,
  onClaimed,
}: {
  type: "COURSE" | "INTERNSHIP";
  title: string;
  courseId?: string;
  internshipId?: string;
  onClaimed?: (credentialId: string) => void;
}) {
  const router = useRouter();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleClaim = async () => {
    setLoading(true);
    setError("");
    try {
      const credentialId = await claimCertificate({
        type,
        courseId,
        internshipId,
      });
      onClaimed?.(credentialId);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : `Failed to claim the certificate for ${title}.`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4">
      <button
        type="button"
        onClick={handleClaim}
        disabled={loading}
        className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs px-3 py-1.5 rounded transition disabled:opacity-50"
      >
        {loading ? "Claiming..." : `Claim ${type === "COURSE" ? "Course" : "Internship"} Certificate`}
      </button>
      {error && (
        <p role="alert" className="mt-2 text-xs text-red-400">
          {error}
        </p>
      )}
    </div>
  );
}
