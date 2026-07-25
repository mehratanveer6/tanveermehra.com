"use client";

import { motion, useReducedMotion } from "framer-motion";
import { useEffect } from "react";

type CardFlipRewardProps = {
  /** True only for the very first flip. Every flip after gets the quieter,
   *  glow-only version -- the payoff is for discovering the card is
   *  clickable at all, not a fresh fireworks show on every click. */
  first: boolean;
  onDone: () => void;
};

const PARTICLE_COUNT = 8;
const BIG_DURATION_MS = 950;
const SMALL_DURATION_MS = 600;

export default function CardFlipReward({ first, onDone }: CardFlipRewardProps) {
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      onDone();
      return;
    }
    const t = setTimeout(onDone, first ? BIG_DURATION_MS : SMALL_DURATION_MS);
    return () => clearTimeout(t);
  }, [first, onDone, reduceMotion]);

  if (reduceMotion) return null;

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-20" style={{ overflow: "visible" }}>
      {/* glow ring -- every flip */}
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{
          background: "radial-gradient(60% 60% at 50% 50%, var(--card-accent) 0%, transparent 72%)",
        }}
        initial={{ opacity: 0.5, scale: 1 }}
        animate={{ opacity: 0, scale: first ? 1.32 : 1.12 }}
        transition={{ duration: first ? 0.9 : 0.55, ease: [0.22, 1, 0.36, 1] }}
      />

      {/* spark particles -- first flip only */}
      {first &&
        Array.from({ length: PARTICLE_COUNT }, (_, i) => {
          const angle = (i / PARTICLE_COUNT) * Math.PI * 2;
          const dist = 64 + (i % 3) * 16;
          return (
            <motion.span
              key={i}
              className="absolute left-1/2 top-1/2 h-1.5 w-1.5 rounded-full"
              style={{ background: "var(--card-accent)", marginLeft: -3, marginTop: -3 }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
              animate={{
                x: Math.cos(angle) * dist,
                y: Math.sin(angle) * dist,
                opacity: 0,
                scale: 0.4,
              }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1], delay: i * 0.015 }}
            />
          );
        })}
    </div>
  );
}
