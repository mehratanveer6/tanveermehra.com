"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { motion } from "framer-motion";
import ChromaKeyCanvas from "./ChromaKeyCanvas";
import BusinessCard from "./BusinessCard";
import MuteToggle from "./MuteToggle";
import { getObjectCoverRect, mediaPointToContainerPixels } from "@/lib/mediaCover";
import { CARD_ASPECT_RATIO } from "@/lib/cardGeometry";

type IntroProps = {
  videoSrc?: string;
  onDone: () => void;
};

// The green rectangle in the supplied clip, measured directly from the
// footage (frame-sampled, not eyeballed): x 600-1319, y 220-659 in its
// native 1920x1080 frame. Normalized so this keeps working if the source
// video's resolution ever changes.
const GREEN_BOX = {
  x: 600 / 1920,
  y: 220 / 1080,
  width: (1319 - 600) / 1920,
  height: (659 - 220) / 1080,
};

// The card must fully cover the green box -- any gap here is not "background
// showing through," it's the page's own opaque black showing through, since
// the box sits on top of a solid bg-black layer. A small overscan (rather
// than an inset) makes sure the card also covers the shader's edge-erosion
// ring at the key boundary, so no black rim is ever exposed. Any tiny bit of
// the card artwork this crops is blank margin (see front.png/back.png), so
// nothing meaningful is lost.
const CARD_COVERAGE = 1.06;

const HOLD_MS = 100;
const FADE_S = 0.7;
const FADE_EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

// Smallest rect at `aspect` that still fully covers boundsWidth x boundsHeight
// (mirrors CSS object-fit: cover, as opposed to fitContain's object-fit: contain).
function fitCover(boundsWidth: number, boundsHeight: number, aspect: number) {
  let width = boundsWidth;
  let height = width / aspect;
  if (height < boundsHeight) {
    height = boundsHeight;
    width = height * aspect;
  }
  return { width, height };
}

export default function Intro({ videoSrc = "/intro.mp4", onDone }: IntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const [fading, setFading] = useState(false);
  const [containerSize, setContainerSize] = useState({ width: 0, height: 0 });
  const [mediaSize, setMediaSize] = useState({ width: 1920, height: 1080 });
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) {
      onDone();
      return;
    }
  }, [onDone]);

  useEffect(() => {
    document.body.classList.add("intro-lock");
    return () => document.body.classList.remove("intro-lock");
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      setContainerSize({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("intro-muted");
      if (stored !== null) setMuted(stored === "true");
    } catch {}
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = muted;
  }, [muted]);

  const handleLoadedMetadata = useCallback(() => {
    const video = videoRef.current;
    if (!video) return;
    if (video.videoWidth && video.videoHeight) {
      setMediaSize({ width: video.videoWidth, height: video.videoHeight });
    }
  }, []);

  const handleEnded = useCallback(() => {
    setTimeout(() => setFading(true), HOLD_MS);
  }, []);

  function toggleMute() {
    setMuted((m) => {
      const next = !m;
      try {
        sessionStorage.setItem("intro-muted", String(next));
      } catch {}
      return next;
    });
  }

  let coverRect = { x: 0, y: 0, width: 0, height: 0 };
  let cardBox: { x: number; y: number; width: number; height: number } | null = null;

  if (containerSize.width > 0 && containerSize.height > 0) {
    coverRect = getObjectCoverRect(containerSize.width, containerSize.height, mediaSize.width, mediaSize.height);

    const boxTL = mediaPointToContainerPixels(GREEN_BOX.x, GREEN_BOX.y, coverRect);
    const boxBR = mediaPointToContainerPixels(GREEN_BOX.x + GREEN_BOX.width, GREEN_BOX.y + GREEN_BOX.height, coverRect);
    const boxWidth = boxBR.x - boxTL.x;
    const boxHeight = boxBR.y - boxTL.y;

    const fitted = fitCover(boxWidth * CARD_COVERAGE, boxHeight * CARD_COVERAGE, CARD_ASPECT_RATIO);
    cardBox = {
      x: boxTL.x + boxWidth / 2 - fitted.width / 2,
      y: boxTL.y + boxHeight / 2 - fitted.height / 2,
      width: fitted.width,
      height: fitted.height,
    };
  }

  return (
    <motion.div
      ref={containerRef}
      className="fixed inset-0 z-50 overflow-hidden bg-black"
      initial={{ opacity: 1 }}
      animate={{ opacity: fading ? 0 : 1 }}
      transition={{ duration: FADE_S, ease: FADE_EASE }}
      onAnimationComplete={() => {
        if (fading) onDone();
      }}
      style={{ pointerEvents: fading ? "none" : "auto" }}
    >
      <video
        ref={videoRef}
        src={videoSrc}
        playsInline
        autoPlay
        muted={muted}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={handleEnded}
        style={{ opacity: 0, position: "absolute" }}
      />

      {/* The card sits BEHIND the chroma canvas, sized/positioned to exactly
          fill the measured green rectangle. It is only ever visible through
          the transparent pixels the shader punches out where the green was —
          it is not composited or layered on top of the footage. */}
      {cardBox && (
        <div className="absolute" style={{ left: cardBox.x, top: cardBox.y, width: cardBox.width, height: cardBox.height }}>
          <BusinessCard staticMode width={cardBox.width} height={cardBox.height} />
        </div>
      )}

      {coverRect.width > 0 && (
        <ChromaKeyCanvas
          videoRef={videoRef}
          style={{
            position: "absolute",
            left: coverRect.x,
            top: coverRect.y,
            width: coverRect.width,
            height: coverRect.height,
          }}
        />
      )}

      <MuteToggle muted={muted} onToggle={toggleMute} fading={fading} />
    </motion.div>
  );
}
