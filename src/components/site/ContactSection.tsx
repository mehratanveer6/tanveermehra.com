import { ArrowUpRight, Github, Linkedin } from "lucide-react";
import { Reveal } from "@/components/site/ui/Reveal";
import { MagneticLink } from "@/components/site/ui/MagneticLink";
import { profile } from "@/lib/content";

export function ContactSection() {
  return (
    <section id="contact" className="border-t border-hairline px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-label text-[11px] tracking-[0.2em] text-mist uppercase">
            05 — Contact
          </span>
        </Reveal>

        <Reveal delay={0.1}>
          <MagneticLink
            href={`mailto:${profile.email}`}
            strength={0.25}
            className="group mt-10 inline-flex items-center gap-4 text-[10vw] leading-none font-medium tracking-tight text-paper transition-colors duration-500 hover:text-paper/80 md:text-8xl"
          >
            Let's talk
            <ArrowUpRight
              size={48}
              strokeWidth={1}
              className="transition-transform duration-500 group-hover:translate-x-2 group-hover:-translate-y-2"
            />
          </MagneticLink>
        </Reveal>

        <Reveal delay={0.2}>
          <p className="mt-8 max-w-md text-paper/50">
            {profile.email}
          </p>
        </Reveal>

        <Reveal delay={0.28}>
          <div className="mt-16 flex gap-8 border-t border-hairline pt-8">
            <a
              href={profile.github}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 text-sm text-mist transition-colors duration-300 hover:text-paper"
            >
              <Github size={16} strokeWidth={1.5} /> GitHub
            </a>
            <a
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
              className="flex items-center gap-2 text-sm text-mist transition-colors duration-300 hover:text-paper"
            >
              <Linkedin size={16} strokeWidth={1.5} /> LinkedIn
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
