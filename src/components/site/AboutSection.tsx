import { Reveal } from "@/components/site/ui/Reveal";
import { education } from "@/lib/content";

export function AboutSection() {
  return (
    <section id="about" className="border-t border-hairline px-6 py-32 md:px-10 md:py-40">
      <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.4fr] md:gap-20">
        <Reveal>
          <span className="font-label text-[11px] tracking-[0.2em] text-mist uppercase">
            01 — About
          </span>
        </Reveal>

        <div className="space-y-10">
          <Reveal>
            <p className="text-2xl leading-relaxed font-light text-paper md:text-4xl">
              I'm a computer science student at {education.school}, {education.graduation.toLowerCase()},
              specializing in AI &amp; ML. Most of what I build starts from the same question:
              what happens when a language model has to be right, not just plausible —
              structured code, a real database, an actual mix.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-hairline pt-8">
              <div>
                <p className="font-label text-[10px] tracking-[0.15em] text-mist uppercase">
                  Education
                </p>
                <p className="mt-2 text-sm text-paper/80">
                  {education.degree}
                  <br />
                  <span className="text-paper/50">{education.specialization}</span>
                </p>
              </div>
              <div>
                <p className="font-label text-[10px] tracking-[0.15em] text-mist uppercase">
                  Certification
                </p>
                <p className="mt-2 text-sm text-paper/80">
                  {education.certification.name}
                  <br />
                  <span className="text-paper/50">{education.certification.status}</span>
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
