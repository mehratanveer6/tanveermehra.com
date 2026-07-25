"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useLocalTime } from "@/hooks/useLocalTime";

const SECTIONS = [
  { id: "about", label: "About" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
] as const;

export function Nav() {
  const [active, setActive] = useState<string>("about");
  const time = useLocalTime();

  useEffect(() => {
    const elements = SECTIONS.map((s) => document.getElementById(s.id)).filter(
      (el): el is HTMLElement => el !== null
    );
    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-40% 0px -50% 0px", threshold: [0, 0.25, 0.5, 0.75, 1] }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <motion.header
      initial={{ y: -24, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      className="fixed inset-x-0 top-0 z-50 border-b border-hairline/60 bg-ink/80 backdrop-blur-md"
    >
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 md:px-10">
        <Link
          href="/"
          className="font-label text-xs tracking-[0.15em] text-paper/70 transition-colors duration-300 hover:text-paper"
          aria-label="Back to the intro"
        >
          TM.
        </Link>

        <nav aria-label="Section navigation" className="hidden gap-8 md:flex">
          {SECTIONS.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className="relative font-label text-[11px] tracking-[0.1em] uppercase transition-colors duration-300"
              style={{ color: active === id ? "var(--color-paper)" : "var(--color-mist)" }}
            >
              {label}
              {active === id && (
                <motion.span
                  layoutId="nav-active"
                  className="absolute -bottom-1 left-0 h-px w-full bg-paper"
                  transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                />
              )}
            </a>
          ))}
        </nav>

        <div className="font-label hidden text-[11px] tracking-[0.1em] text-mist sm:block" suppressHydrationWarning>
          {time ? `${time} IST` : "\u00A0"}
        </div>
      </div>
    </motion.header>
  );
}
