"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Icon from "@/components/Icon";

export default function EnrollButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleEnroll() {
    setLoading(true);
    try {
      const res = await fetch("/api/enroll", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId }),
      });
      if (res.ok) {
        router.refresh();
      }
    } catch (e) {
      console.error("Enrollment failed", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleEnroll}
      disabled={loading}
      className="flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-black font-bold py-3 px-8 rounded-full transition-all duration-300 shadow-[0_0_15px_rgba(201,162,39,0.3)] disabled:opacity-50"
    >
      <Icon name="book" className="h-5 w-5" />
      {loading ? "Enrolling..." : "Enroll Now"}
    </button>
  );
}
