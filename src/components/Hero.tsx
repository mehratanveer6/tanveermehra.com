"use client";

import { useCallback, useState } from "react";
import BusinessCard from "./BusinessCard";
import Atmosphere from "./Atmosphere";

type HeroProps = {
  /** Card responds to hover/cursor light -- stage 1 of the post-intro reveal. */
  tiltEnabled: boolean;
  /** Card responds to clicks (flip) -- stage 2, arrives slightly after tiltEnabled. */
  clickEnabled: boolean;
  /** CTA line beneath the card -- fades in once the card itself has settled. */
  ctaVisible: boolean;
};

/**
 * The real, permanent hero. This mounts on first paint and never moves,
 * resizes, or remounts for the rest of the page's life — the intro is a
 * separate opaque layer sitting on top of it that dissolves away, not
 * something that hands off to a second, different card instance.
 */
export default function Hero({ tiltEnabled, clickEnabled, ctaVisible }: HeroProps) {
  // Once true, stays true -- the hint has done its job after the first real
  // flip and shouldn't reappear (there's nothing left for it to teach).
  const [hasFlipped, setHasFlipped] = useState(false);
  const handleFlip = useCallback(() => setHasFlipped(true), []);
  const hintVisible = clickEnabled && !hasFlipped;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black px-6">
      <Atmosphere />

      <div className="relative z-10 flex flex-col items-center">
        <div
          aria-hidden={!hintVisible}
          className="mb-4 flex flex-col items-center gap-1.5 transition-all duration-700 ease-out"
          style={{
            opacity: hintVisible ? 1 : 0,
            transform: hintVisible ? "translateY(0px)" : "translateY(6px)",
          }}
        >
          <span className="text-[11px] font-medium tracking-[0.25em] text-[var(--card-fg-dim)] uppercase">
            click the card
          </span>
          <svg width="10" height="6" viewBox="0 0 10 6" fill="none" className="animate-hint-bob">
            <path d="M1 1l4 4 4-4" stroke="var(--card-fg-dim)" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        <BusinessCard staticMode={!tiltEnabled} clickDisabled={!clickEnabled} onFlip={handleFlip} />

        <a
          href="/work"
          className="mt-10 text-sm tracking-wide text-[var(--card-fg-dim)] transition-all duration-700 ease-out hover:text-[var(--card-fg)]"
          style={{
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? "translateY(0px)" : "translateY(6px)",
          }}
        >
          <span className="border-b border-transparent pb-0.5 transition-colors duration-300 hover:border-current">
            Take me to Bateman →
          </span>
        </a>
      </div>
    </section>
  );
}
