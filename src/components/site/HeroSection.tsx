"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { profile } from "@/lib/content";
import { EASE_PREMIUM } from "@/lib/motion";

export function HeroSection() {
  return (
    <section className="relative flex min-h-screen flex-col justify-center px-6 md:px-10">
      <div className="mx-auto w-full max-w-6xl">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: EASE_PREMIUM, delay: 0.15 }}
          className="font-label mb-6 text-[11px] tracking-[0.2em] text-mist uppercase"
        >
          {profile.role} — {profile.location}
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: EASE_PREMIUM, delay: 0.3 }}
          className="text-[13vw] leading-[0.95] font-medium tracking-tight text-paper md:text-[7.5rem]"
        >
          {profile.firstName}
          <br />
          {profile.lastName}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 0.55 }}
          className="mt-8 max-w-xl text-lg leading-relaxed text-paper/70 md:text-xl"
        >
          I build AI-native tools — from code-generation to natural-language
          interfaces — and spend as much care on the seams as the features.
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.1 }}
        className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-mist"
      >
        <span className="font-label text-[10px] tracking-[0.2em] uppercase">Scroll</span>
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        >
          <ArrowDown size={14} strokeWidth={1.5} />
        </motion.span>
      </motion.div>
    </section>
  );
}
