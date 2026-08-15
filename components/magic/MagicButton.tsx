"use client";

import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { motion, HTMLMotionProps } from "framer-motion";
import Icon from "../Icon";

type MagicButtonState = "idle" | "loading" | "success" | "error";

interface MagicButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  status?: MagicButtonState;
  fullWidth?: boolean;
}

export const MagicButton = forwardRef<HTMLButtonElement, MagicButtonProps>(
  ({ children, status = "idle", fullWidth = false, className = "", disabled, ...props }, ref) => {
    const isWorking = status === "loading" || status === "success";
    const isDisabled = disabled || isWorking;

    let bgClass =
      "border-[var(--gold-bright)] bg-gradient-to-b from-[var(--gold)] to-[var(--gold-dim)] text-[#241026]";
    let shadowClass = "shadow-[0_0_18px_rgb(212_162_76/0.35)]";

    if (status === "error") {
      bgClass = "border-[#6B3547] bg-gradient-to-b from-[#542638] to-[#3A1825] text-[var(--text)]";
      shadowClass = "shadow-[0_0_18px_rgba(84,38,56,0.5)]";
    }

    return (
      <motion.button
        ref={ref}
        disabled={isDisabled}
        whileHover={isDisabled ? {} : { scale: 1.02, filter: "brightness(1.1)" }}
        whileTap={isDisabled ? {} : { scale: 0.96 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
        className={`
          rune-edge group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-md border
          px-5 py-2.5 text-[15px] font-semibold transition-colors duration-300
          focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--glow)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]
          ${isDisabled ? "opacity-70 cursor-not-allowed" : ""}
          ${fullWidth ? "w-full" : ""}
          ${bgClass}
          ${shadowClass}
          ${className}
        `}
        {...props}
      >
        {status === "loading" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            {/* We use a custom spinner or icon */}
            <Icon name="grid" className="h-5 w-5 animate-spin text-current opacity-80" />
          </span>
        )}

        {status === "success" && (
          <span className="absolute inset-0 flex items-center justify-center bg-black/10 backdrop-blur-[2px]">
            <Icon name="check" className="h-5 w-5 text-current" />
            <span
              aria-hidden="true"
              className="absolute h-1 w-1 rounded-full bg-white shadow-[0_0_8px_4px_white] animate-sparkle"
            />
          </span>
        )}

        {/* Content wrapper to slightly push/hide during loading */}
        <span
          className={`flex items-center gap-2 transition-opacity duration-300 ${
            isWorking ? "opacity-0" : "opacity-100"
          }`}
        >
          {children}
        </span>
      </motion.button>
    );
  }
);
MagicButton.displayName = "MagicButton";
