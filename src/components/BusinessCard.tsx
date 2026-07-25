"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
import { useTilt } from "@/hooks/useTilt";
import { CARD_ASPECT_RATIO } from "@/lib/cardGeometry";
import CardFlipReward from "./CardFlipReward";

type BusinessCardProps = {
  staticMode?: boolean;
  clickDisabled?: boolean;
  width?: number;
  height?: number;
  className?: string;
  /** Called with the new flip count each time the card is actually flipped
   *  (never fires while inert/static -- this is a real-click signal). */
  onFlip?: (count: number) => void;
};

const FLIP_DURATION = 0.85;
const FLIP_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FRONT_SRC = "/card/front.png";
const BACK_SRC = "/card/back.png";

/**
 * The card. Two images, flipped. That's it.
 *
 * front.png and back.png ARE the business card — the finished, exported
 * artwork. This file does not draw a card. It places the two images
 * face-to-face in 3D space and rotates them when clicked. No recreated
 * typography, no synthetic glass, no generated lighting layers on top of
 * the artwork — what's in the PNG is exactly what's on screen.
 *
 * A real click (never while staticMode/clickDisabled) also plays a short,
 * self-clearing CardFlipReward overlay and reports the flip upward via
 * onFlip, so a parent (Hero) can react -- e.g. retiring a "click the card"
 * hint once it's done its job.
 */
export default function BusinessCard({
  staticMode = false,
  clickDisabled = false,
  width: widthProp,
  height: heightProp,
  className,
  onFlip,
}: BusinessCardProps) {
  const wrapperRef = useRef<HTMLDivElement>(null);

  const { ref: tiltRef, rotateX, rotateY: tiltRotateY } = useTilt();

  const [flipCount, setFlipCount] = useState(0);
  const [reward, setReward] = useState<number | null>(null);
  const flipAngle = useMotionValue(0);

  const flipInert = staticMode || clickDisabled;

  const handleFlip = useCallback(() => {
    if (flipInert) return;
    const next = flipCount + 1;
    const target = next * 180;
    animate(flipAngle, target, { duration: FLIP_DURATION, ease: FLIP_EASE });
    setFlipCount(next);
    setReward(next);
    onFlip?.(next);
  }, [flipCount, flipAngle, flipInert, onFlip]);

  const clearReward = useCallback(() => setReward(null), []);

  const showBack = flipCount % 2 === 1;

  return (
    <div
      ref={wrapperRef}
      className={className}
      style={{
        position: "relative",
        perspective: "1600px",
        width: widthProp ? `${widthProp}px` : "min(88vw, 24rem)",
        aspectRatio: widthProp && heightProp ? undefined : CARD_ASPECT_RATIO,
        height: heightProp ? `${heightProp}px` : undefined,
      }}
    >
      {reward !== null && <CardFlipReward first={reward === 1} onDone={clearReward} />}

      <motion.div
        ref={tiltRef}
        role="button"
        tabIndex={0}
        aria-label={showBack ? "Show card front" : "Show card back"}
        onClick={handleFlip}
        onKeyDown={(e) => {
          if (!flipInert && (e.key === "Enter" || e.key === " ")) {
            e.preventDefault();
            handleFlip();
          }
        }}
        style={{
          width: "100%",
          height: "100%",
          position: "relative",
          transformStyle: "preserve-3d",
          rotateX: staticMode ? 0 : rotateX,
          rotateY: staticMode ? 0 : tiltRotateY,
          cursor: flipInert ? "default" : "pointer",
        }}
      >
        <motion.div
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
            transformStyle: "preserve-3d",
            rotateY: flipAngle,
            boxShadow: "0 20px 50px -18px rgba(0,0,0,0.6)",
            borderRadius: "12px",
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={FRONT_SRC}
            alt="Tanveer Mehra — business card, front"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none rounded-xl object-cover"
            style={{ backfaceVisibility: "hidden" }}
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={BACK_SRC}
            alt="Tanveer Mehra — business card, back"
            draggable={false}
            className="absolute inset-0 h-full w-full select-none rounded-xl object-cover"
            style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
