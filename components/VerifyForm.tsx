"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import Icon from "@/components/Icon";

export default function VerifyForm({ initialCode = "" }: { initialCode?: string }) {
  const router = useRouter();
  const [code, setCode] = useState(initialCode);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const trimmed = code.trim().toUpperCase();
    if (!trimmed) return;
    router.push(`/verify/${encodeURIComponent(trimmed)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row">
      <label className="relative flex-1">
        <span className="sr-only">Credential ID</span>
        <Icon
          name="search"
          className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--text-faint)]"
        />
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="EDU-XXXX-XXXX-XXXX"
          autoComplete="off"
          spellCheck={false}
          className="input pl-11 font-mono uppercase tracking-wider"
        />
      </label>
      <button type="submit" className="btn btn-primary press">
        Verify
        <Icon name="arrowRight" className="h-4 w-4" />
      </button>
    </form>
  );
}
