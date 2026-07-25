"use client";

import { useEffect, useRef } from "react";
import { useMotionValue, useSpring, useTransform, MotionValue } from "framer-motion";

type TiltHandlers = {
  ref: React.RefObject<HTMLDivElement | null>;
  rotateX: MotionValue<number>;
  rotateY: MotionValue<number>;
  glareX: MotionValue<number>;
  glareY: MotionValue<number>;
};

const INFLUENCE_RADIUS_MULTIPLIER = 2.2; // how far from the card, in card-diagonals, cursor influence still reaches
const MAX_TILT_DEG = 7; // deliberately subtle -- this is "air moving", not a joystick

/**
 * Ambient, field-like cursor influence rather than direct 1:1 tilt control.
 *
 * Listens at the WINDOW level, not on the card itself, and falls off with
 * distance from the card's center — near the card, orientation drifts
 * slightly toward facing the cursor; far away, influence fades to zero. The
 * rotation spring is heavy and slow (high mass, low stiffness) so the card
 * reads as something with weight settling in response to a change in the
 * air around it, not something being grabbed and pointed.
 *
 * The specular highlight (glareX/Y) is a separate, faster-tracking value —
 * light in a room responds to a moving source quickly; a physical object's
 * orientation does not.
 */
export function useTilt(): TiltHandlers {
  const ref = useRef<HTMLDivElement>(null);

  const fieldX = useMotionValue(0); // -1..1, distance-attenuated
  const fieldY = useMotionValue(0);
  const rawX = useMotionValue(0.5); // 0..1 within card bounds, for the glare
  const rawY = useMotionValue(0.5);

  useEffect(() => {
    function onMove(e: MouseEvent) {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const diag = Math.hypot(rect.width, rect.height) || 1;
      const radius = diag * INFLUENCE_RADIUS_MULTIPLIER;

      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy);

      const falloff = Math.max(0, 1 - dist / radius);
      // Ease the falloff curve so it's gentle near the edge of influence,
      // not a hard cutoff.
      const eased = falloff * falloff;

      fieldX.set((dx / radius) * eased);
      fieldY.set((dy / radius) * eased);

      // Glare only engages when the cursor is actually over/near the card,
      // otherwise it just sits at rest in the card's center.
      if (dist < diag * 0.9) {
        rawX.set(Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width)));
        rawY.set(Math.min(1, Math.max(0, (e.clientY - rect.top) / rect.height)));
      } else {
        rawX.set(0.5);
        rawY.set(0.5);
      }
    }

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, [fieldX, fieldY, rawX, rawY]);

  const tiltSpring = { stiffness: 40, damping: 9, mass: 1.6 };
  const glareSpring = { stiffness: 260, damping: 24, mass: 0.3 };

  const rotateX = useSpring(useTransform(fieldY, (v) => v * -MAX_TILT_DEG), tiltSpring);
  const rotateY = useSpring(useTransform(fieldX, (v) => v * MAX_TILT_DEG), tiltSpring);
  const glareX = useSpring(useTransform(rawX, [0, 1], [0, 100]), glareSpring);
  const glareY = useSpring(useTransform(rawY, [0, 1], [0, 100]), glareSpring);

  return { ref, rotateX, rotateY, glareX, glareY };
}
