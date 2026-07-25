"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { EASE_TRANSITION, revealVariants } from "@/lib/motion";

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Element tag to render as — defaults to div. */
  as?: "div" | "li" | "span";
};

/**
 * Fires once, when ~15% of the element has entered the viewport, then
 * stays put — this is a reveal, not a repeating flourish.
 */
export function Reveal({ children, className, delay = 0, as = "div" }: RevealProps) {
  const prefersReducedMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (prefersReducedMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "0px 0px -80px 0px" }}
      variants={revealVariants}
      transition={{ ...EASE_TRANSITION, delay }}
    >
      {children}
    </MotionTag>
  );
}
