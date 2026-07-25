import type { SpringOptions, Transition, Variants } from "framer-motion";

/**
 * Same premium cubic-bezier already used by the intro/card system
 * (see globals.css --ease-premium). Reusing it here keeps the motion
 * language continuous across the handoff from "/" into "/work", even
 * though the two experiences use different color systems.
 */
export const EASE_PREMIUM: [number, number, number, number] = [0.22, 1, 0.36, 1];

/** Low-bounce, high-damping spring — weight without elasticity. For use in `transition` props. */
export const SPRING_WEIGHTED: Transition = {
  type: "spring",
  stiffness: 120,
  damping: 20,
  mass: 1,
};

/** A touch snappier, for small hover-scale interactions. For use in `transition` props. */
export const SPRING_TIGHT: Transition = {
  type: "spring",
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

/** Same curve as SPRING_TIGHT, shaped for useSpring()/useMotionValue() which take SpringOptions rather than Transition. */
export const SPRING_TIGHT_OPTIONS: SpringOptions = {
  stiffness: 260,
  damping: 26,
  mass: 0.8,
};

export const EASE_TRANSITION: Transition = {
  duration: 0.8,
  ease: EASE_PREMIUM,
};

/** Standard scroll-reveal: rise + fade, used by <Reveal>. Transition is composed at the call site so per-instance delay is possible. */
export const revealVariants: Variants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0 },
};

/** Stagger wrapper for lists of reveals (project rows, skill groups). */
export const staggerContainer = (staggerMs = 0.08): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: staggerMs },
  },
});
