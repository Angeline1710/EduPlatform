"use client";

import { useState } from "react";

export default function BuyButton({ courseId }: { courseId: string }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleBuy() {
    setLoading(true);
    setError("");

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ courseId }),
    });

    const data = await res.json().catch(() => ({}));

    if (!res.ok || !data.url) {
      setError(data.error ?? "Could not start checkout.");
      setLoading(false);
      return;
    }

    window.location.href = data.url;
  }

  return (
    <div>
      <button
        onClick={handleBuy}
        disabled={loading}
        className="btn btn-primary w-full"
      >
        {loading ? "Redirecting..." : "Buy this course"}
      </button>
      {error && (
        <p className="mt-2 rounded-lg bg-red-500/10 px-3 py-2 text-sm font-medium text-red-500">
          {error}
        </p>
      )}
    </div>
  );
}
