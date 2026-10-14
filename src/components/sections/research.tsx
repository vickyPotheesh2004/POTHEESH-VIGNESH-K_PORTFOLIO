import { ArrowUpRight, FileText } from "lucide-react";
import { Section, SubHeading } from "@/components/ui/section";
import { Action, Chip } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { PUBLICATIONS } from "@/data/profile";

const INTERESTS = [
  "Retrieval-augmented generation",
  "LLM evaluation and abstention",
  "Multi-agent orchestration",
  "Local and on-device inference",
  "Evidence-grounded decision support",
  "Speech and multilingual NLP",
];

export function ResearchSection() {
  return (
    <Section
      id="research"
      index={6}
      kicker="Research"
      title="Two IEEE conference papers"
      intro={
        <>
          Published while still an undergraduate, on the two engineering
          problems I kept circling: autonomous drone systems, and wearable
          health monitoring over mobile edge computing. In parallel I write
          about how AI systems fail — retrieval that misses the exact figure,
          models that compute arithmetic they should delegate.
        </>
      }
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <ul className="grid gap-px self-start border border-border bg-[var(--rule)]">
          {PUBLICATIONS.map((publication, index) => (
            <li key={publication.title} className="bg-surface p-6 sm:p-7">
              <Reveal delay={index * 60}>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                  <FileText aria-hidden className="size-4 text-accent" />
                  <Chip tone="accent">{publication.venue}</Chip>
                  <Chip tone="positive">{publication.year}</Chip>
                  <span className="mono-label ml-auto">
                    {publication.kind}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-display-sm leading-[1.2] tracking-[-0.015em]">
                  {publication.title}
                </h3>

                <p className="mono-label mt-3">{publication.authors}</p>
              </Reveal>
            </li>
          ))}
        </ul>

        <div>
          <Reveal>
            <SubHeading hint="What I keep working on">
              Research interests
            </SubHeading>
            <ul className="mt-5 flex flex-wrap gap-1.5">
              {INTERESTS.map((interest) => (
                <li key={interest}>
                  <Chip>{interest}</Chip>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={60}>
            <p className="mt-6 border border-border bg-surface-2 p-4 text-xs leading-relaxed text-muted-2">
              Bibliographic identifiers, DOIs and citation counts are
              deliberately not listed here: they have not been independently
              verified for this site, and an unverified identifier is worse
              than none.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-6">
            <Action href="/research" size="md" variant="outline">
              Publications and writing
              <ArrowUpRight aria-hidden className="size-3.5" />
            </Action>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
