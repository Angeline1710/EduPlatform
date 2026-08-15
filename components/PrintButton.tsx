"use client";

import Icon from "@/components/Icon";

/** Opens the browser's print dialog — the user chooses "Save as PDF" there. */
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="btn btn-primary press">
      <Icon name="award" className="h-4 w-4" />
      Print / Save PDF
    </button>
  );
}
