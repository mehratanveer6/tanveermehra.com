import { Reveal } from "@/components/site/ui/Reveal";
import { experience } from "@/lib/content";

export function ExperienceSection() {
  return (
    <section id="experience" className="border-t border-hairline px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto max-w-6xl">
        <Reveal>
          <span className="font-label text-[11px] tracking-[0.2em] text-mist uppercase">
            03 — Experience
          </span>
        </Reveal>

        <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1.6fr] md:gap-20">
          <Reveal>
            <div>
              <h3 className="text-3xl font-medium text-paper md:text-4xl">{experience.company}</h3>
              <p className="mt-2 text-paper/60">{experience.role}</p>
              <p className="font-label mt-4 text-[11px] tracking-[0.1em] text-mist uppercase">
                {experience.period}
              </p>
            </div>
          </Reveal>

          <div className="space-y-5 border-t border-hairline pt-8 md:border-t-0 md:pt-0">
            {experience.highlights.map((point, i) => (
              <Reveal key={point} delay={i * 0.08}>
                <p className="flex gap-4 text-base leading-relaxed text-paper/70 md:text-lg">
                  <span className="font-label mt-1 text-xs text-mist">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {point}
                </p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
