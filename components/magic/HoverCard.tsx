"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

type HoverCardProps = {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
};

export default function HoverCard({
  children,
  className = "",
  style,
}: HoverCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -12,
        scale: 1.02,
        filter: "brightness(1.1)",
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
      }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
}
