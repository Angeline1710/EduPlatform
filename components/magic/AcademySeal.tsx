"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Icon from "../Icon";

export default function AcademySeal({
  size = 120,
  className = "",
  show = true,
}: {
  size?: number;
  className?: string;
  show?: boolean;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (show) {
      setMounted(true);
    }
  }, [show]);

  if (!mounted) return null;

  return (
    <motion.div
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      animate={{
        y: [0, -4, 0],
        rotate: [0, 2, 0, -2, 0],
      }}
      transition={{
        duration: 8,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    >
      <div
        className="absolute inset-0 rounded-full border-[2px] border-[var(--gold)] opacity-0 animate-seal-ring"
        style={{ animationDelay: "0.2s" }}
      />
      <div className="animate-seal-press relative flex items-center justify-center rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--gold-dim)] p-1 shadow-[0_0_24px_var(--academy-glow)]">
        <div className="flex h-full w-full items-center justify-center rounded-full border-[2px] border-dashed border-[#241026]/30 bg-[var(--gold)]">
          {/* Icon takes no style prop; the wrapper carries the size instead. */}
          <span
            className="block text-[#241026]"
            style={{ width: size * 0.4, height: size * 0.4 }}
          >
            <Icon name="crown" className="h-full w-full" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}
