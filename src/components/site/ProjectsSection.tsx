"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/site/ui/Reveal";
import { TagChip } from "@/components/site/ui/TagChip";
import { projects } from "@/lib/content";
import { EASE_PREMIUM } from "@/lib/motion";

export function ProjectsSection() {
  return (
    <section id="projects" className="border-t border-hairline px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-label text-[11px] tracking-[0.2em] text-mist uppercase">
            02 — Projects
          </span>
        </Reveal>

        <div className="mt-14 divide-y divide-hairline border-t border-hairline">
          {projects.map((project, i) => (
            <Reveal key={project.slug} delay={i * 0.06}>
              <Link
                href={`/work/projects/${project.slug}`}
                className="group grid grid-cols-1 gap-4 py-10 transition-colors duration-500 md:grid-cols-[auto_1fr_auto] md:items-center md:gap-10"
              >
                <span className="font-label text-sm text-mist transition-colors duration-500 group-hover:text-paper/60">
                  {project.index}
                </span>

                <div>
                  <h3 className="text-3xl font-medium text-paper transition-transform duration-500 md:text-4xl md:group-hover:translate-x-2">
                    {project.title}
                  </h3>
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    whileInView={{ opacity: 1, height: "auto" }}
                    viewport={{ once: true }}
                    className="mt-3 max-w-xl text-sm leading-relaxed text-paper/50 md:opacity-0 md:transition-opacity md:duration-500 md:group-hover:opacity-100"
                  >
                    {project.summary}
                  </motion.p>
                  <div className="mt-4 flex flex-wrap gap-2 opacity-70 transition-opacity duration-500 group-hover:opacity-100">
                    {project.stack.slice(0, 4).map((tech) => (
                      <TagChip key={tech}>{tech}</TagChip>
                    ))}
                  </div>
                </div>

                <motion.span
                  className="flex items-center gap-2 font-label text-xs tracking-[0.1em] text-mist uppercase transition-colors duration-500 group-hover:text-paper"
                  whileHover={{ x: 2 }}
                  transition={{ duration: 0.4, ease: EASE_PREMIUM }}
                >
                  View
                  <ArrowUpRight size={14} strokeWidth={1.5} />
                </motion.span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
