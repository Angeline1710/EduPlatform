"use client";

import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import Icon from "@/components/Icon";

export default function DownloadCertificate({
  children,
  filename,
}: {
  children: React.ReactNode;
  filename: string;
}) {
  const certRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    if (!certRef.current) return;
    try {
      setIsDownloading(true);

      // Target the #certificate element directly so we capture exactly that box
      const certEl =
        certRef.current.querySelector<HTMLElement>("#certificate") ??
        certRef.current;

      const dataUrl = await toPng(certEl, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: "#F7F1E5",
        cacheBust: true,
        style: {
          transform: "none",
          transformOrigin: "top left",
          overflow: "hidden",
          margin: "0",
        },
      });

      const link = document.createElement("a");
      link.download = `${filename}.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error("Failed to generate certificate image", err);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col items-center">
      {/* Keep the export clone at the rendered certificate dimensions. */}
      <div className="w-full overflow-x-auto pb-6 custom-scrollbar">
        <div ref={certRef} className="mx-auto w-fit">
          {children}
        </div>
      </div>

      <button
        onClick={handleDownload}
        disabled={isDownloading}
        className="mt-6 flex items-center gap-2 bg-[var(--gold)] hover:bg-[var(--gold-bright)] text-black font-bold py-3 px-8 rounded-full transition-all shadow-[0_0_15px_rgba(212,162,76,0.4)] disabled:opacity-50"
      >
        <Icon name="download" className="h-5 w-5" />
        {isDownloading ? "Generating..." : "Download Certificate (A4)"}
      </button>
    </div>
  );
}
