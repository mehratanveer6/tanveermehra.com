"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { Reveal } from "@/components/site/ui/Reveal";
import { TagChip } from "@/components/site/ui/TagChip";
import { projects, type Project } from "@/lib/content";

export function CaseStudy({ project }: { project: Project }) {
  const currentIndex = projects.findIndex((p) => p.slug === project.slug);
  const next = projects[(currentIndex + 1) % projects.length];

  return (
    <article className="px-6 py-28 md:px-10 md:py-36">
      <div className="mx-auto max-w-3xl">
        <Reveal>
          <Link
            href="/work#projects"
            className="inline-flex items-center gap-2 font-label text-xs tracking-[0.1em] text-mist uppercase transition-colors duration-300 hover:text-paper"
          >
            <ArrowLeft size={14} strokeWidth={1.5} />
            All projects
          </Link>
        </Reveal>

        <Reveal delay={0.08}>
          <p className="font-label mt-10 text-[11px] tracking-[0.2em] text-mist uppercase">
            {project.index} — {project.year}
          </p>
        </Reveal>

        <Reveal delay={0.14}>
          <h1 className="mt-4 text-5xl leading-[1.02] font-medium tracking-tight text-paper md:text-7xl">
            {project.title}
          </h1>
        </Reveal>

        <Reveal delay={0.2}>
          <div className="mt-8 flex flex-wrap gap-2">
            {project.stack.map((tech) => (
              <TagChip key={tech}>{tech}</TagChip>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.26}>
          <p className="mt-12 text-xl leading-relaxed text-paper/70 md:text-2xl">{project.summary}</p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-16 border-t border-hairline pt-10">
            <p className="font-label text-[10px] tracking-[0.15em] text-mist uppercase">The problem</p>
            <p className="mt-4 text-lg leading-relaxed text-paper/70">{project.problem}</p>
          </div>
        </Reveal>

        <div className="mt-16 border-t border-hairline pt-10">
          <p className="font-label text-[10px] tracking-[0.15em] text-mist uppercase">
            What it does
          </p>
          <div className="mt-6 space-y-8">
            {project.highlights.map((point, i) => (
              <Reveal key={point} delay={i * 0.08}>
                <p className="flex gap-5 text-lg leading-relaxed text-paper/80">
                  <span className="font-label mt-1 shrink-0 text-xs text-mist">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {point}
                </p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={0.1}>
          <Link
            href={`/work/projects/${next.slug}`}
            className="group mt-24 flex items-center justify-between border-t border-hairline pt-10"
          >
            <div>
              <p className="font-label text-[10px] tracking-[0.15em] text-mist uppercase">Next</p>
              <p className="mt-2 text-2xl font-medium text-paper transition-transform duration-500 group-hover:translate-x-2 md:text-3xl">
                {next.title}
              </p>
            </div>
            <ArrowRight
              size={28}
              strokeWidth={1.5}
              className="text-mist transition-all duration-500 group-hover:translate-x-2 group-hover:text-paper"
            />
          </Link>
        </Reveal>
      </div>
    </article>
  );
}
