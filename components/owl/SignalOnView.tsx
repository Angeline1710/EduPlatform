"use client";

import { useEffect, useRef } from "react";
import { recordSignal, type SignalKind } from "@/lib/signals";

/**
 * Records a view once the page it sits on has actually been rendered.
 *
 * Mounted from server components, which cannot call browser APIs themselves.
 * Guarded against React's double-invoke in development so a single visit is
 * never counted twice and skewed into a false preference.
 */
export default function SignalOnView({
  kind,
  value,
  courseId,
  category,
}: {
  kind: SignalKind;
  value: string;
  courseId?: string;
  category?: string;
}) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;
    recordSignal(kind, value, { courseId, category });
  }, [kind, value, courseId, category]);

  return null;
}
