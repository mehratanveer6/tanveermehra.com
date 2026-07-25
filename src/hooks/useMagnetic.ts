"use client";

import { useRef } from "react";
import { useMotionValue, useSpring } from "framer-motion";
import { SPRING_TIGHT_OPTIONS } from "@/lib/motion";

/**
 * Pulls an element gently toward the cursor while hovered, within a
 * restrained radius, then springs back to rest on leave. Used for the
 * contact CTA and footer links — restrained on purpose, this is a nudge,
 * not a snap-to-cursor gimmick.
 */
export function useMagnetic(strength = 0.35) {
  const ref = useRef<HTMLElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, SPRING_TIGHT_OPTIONS);
  const springY = useSpring(y, SPRING_TIGHT_OPTIONS);

  const onMouseMove = (event: React.MouseEvent<HTMLElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = event.clientX - (rect.left + rect.width / 2);
    const relY = event.clientY - (rect.top + rect.height / 2);
    x.set(relX * strength);
    y.set(relY * strength);
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return { ref, springX, springY, onMouseMove, onMouseLeave };
}
