"use client";

import { motion } from "framer-motion";

type RevealProps = {
  children: React.ReactNode;
  /** Seconds of delay before the element animates in. */
  delay?: number;
  className?: string;
};

/**
 * Fades and floats content up as it scrolls into view using Framer Motion.
 */
export default function Reveal({ children, delay = 0, className = "" }: RevealProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30, filter: "blur(10px)" }}
      whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
      viewport={{ once: true, margin: "0px 0px -50px 0px" }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.22, 1, 0.36, 1], // Magical ease-out cubic
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
