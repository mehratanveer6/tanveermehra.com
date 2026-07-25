"use client";

import { useCallback, useRef, useState } from "react";
import Hero from "@/components/Hero";
import Intro from "@/components/Intro";

const TILT_DELAY_MS = 300; // after the intro dissolve completes
const CLICK_DELAY_MS = 200; // after tilt engages

export default function Home() {
  const [introActive, setIntroActive] = useState(true);
  const [tiltEnabled, setTiltEnabled] = useState(false);
  const [clickEnabled, setClickEnabled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const handleIntroDone = useCallback(() => {
    setIntroActive(false);
    timers.current.push(
      setTimeout(() => setTiltEnabled(true), TILT_DELAY_MS),
      setTimeout(() => setClickEnabled(true), TILT_DELAY_MS + CLICK_DELAY_MS)
    );
  }, []);

  return (
    <main>
      {/*
        Hero mounts first and never remounts or repositions — the intro is a
        separate opaque layer on top of it that dissolves away. Interactivity
        (tilt, then click) arrives in two short stages once the intro is gone,
        per spec, rather than all at once.
      */}
      <Hero tiltEnabled={tiltEnabled} clickEnabled={clickEnabled} ctaVisible={clickEnabled} />
      {introActive && <Intro onDone={handleIntroDone} />}

      {/*
        The rest of the site (about / projects / research / contact) still
        lives in the existing static HTML build. Porting those pages into
        this Next.js app is a separate phase — this page currently covers
        the intro + hero only, per the current brief.
      */}
    </main>
  );
}
