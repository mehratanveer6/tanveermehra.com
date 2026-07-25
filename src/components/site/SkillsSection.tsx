"use client";

import { useRef } from "react";
import { Reveal } from "@/components/site/ui/Reveal";
import { skillGroups } from "@/lib/content";

function SkillGroupCard({ label, items, delay }: { label: string; items: string[]; delay: number }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    el.style.setProperty("--x", `${event.clientX - rect.left}px`);
    el.style.setProperty("--y", `${event.clientY - rect.top}px`);
  };

  return (
    <Reveal delay={delay}>
      <div
        ref={ref}
        onMouseMove={handleMove}
        className="group relative overflow-hidden rounded-sm border border-hairline p-7"
        style={{
          backgroundImage:
            "radial-gradient(220px circle at var(--x, 50%) var(--y, 50%), rgba(242,241,238,0.06), transparent 70%)",
        }}
      >
        <p className="font-label text-[11px] tracking-[0.15em] text-mist uppercase">{label}</p>
        <ul className="mt-5 flex flex-wrap gap-x-4 gap-y-2">
          {items.map((item) => (
            <li key={item} className="text-sm text-paper/75">
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

export function SkillsSection() {
  return (
    <section id="skills" className="border-t border-hairline px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-label text-[11px] tracking-[0.2em] text-mist uppercase">
            04 — Skills
          </span>
        </Reveal>

        <div className="mt-14 grid gap-4 md:grid-cols-2">
          {skillGroups.map((group, i) => (
            <SkillGroupCard key={group.label} label={group.label} items={group.items} delay={i * 0.06} />
          ))}
        </div>
      </div>
    </section>
  );
}
