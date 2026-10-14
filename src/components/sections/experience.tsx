import { GraduationCap } from "lucide-react";
import { Section, SubHeading } from "@/components/ui/section";
import { Chip } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import {
  CERTIFICATIONS,
  COMMUNITY,
  EDUCATION,
  EXPERIENCE,
  SPOKEN_LANGUAGES,
} from "@/data/profile";

export function ExperienceSection() {
  return (
    <Section
      id="experience"
      index={3}
      kicker="Experience"
      title="Where I have worked"
      intro={
        <>
          Two internships so far. The responsibilities are described as they
          were given to me; the two percentage figures that came from the
          résumé are printed with their provenance attached, because a
          self-reported number is not a benchmark.
        </>
      }
    >
      <ol className="grid gap-px border border-border bg-[var(--rule)]">
        {EXPERIENCE.map((entry, index) => (
          <li key={`${entry.org}-${entry.period}`} className="bg-surface p-6 sm:p-8">
            <Reveal delay={index * 60}>
              <div className="flex flex-wrap items-baseline gap-x-4 gap-y-2">
                <span className="mono-label tabular text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-display-sm leading-tight tracking-[-0.015em]">
                  {entry.role}
                </h3>
                <span className="text-sm text-muted">{entry.org}</span>
                <span className="mono-label ml-auto tabular">{entry.period}</span>
              </div>

              <p className="mt-4 max-w-3xl text-[0.975rem] leading-relaxed text-foreground-soft">
                {entry.summary}
              </p>

              <ul className="mt-5 grid gap-2.5">
                {entry.highlights.map((highlight) => (
                  <li
                    key={highlight}
                    className="flex gap-3 text-sm leading-relaxed text-muted"
                  >
                    <span
                      aria-hidden
                      className="mt-1.5 size-1.5 shrink-0 rotate-45 border border-accent"
                    />
                    <span>{highlight}</span>
                  </li>
                ))}
              </ul>

              {entry.reportedFigures && entry.reportedFigures.length > 0 && (
                <div className="mt-5 border border-signal/40 bg-signal-soft p-4">
                  <p className="mono-label text-signal">Reported figures</p>
                  <ul className="mt-2.5 grid gap-2">
                    {entry.reportedFigures.map((figure) => (
                      <li
                        key={figure}
                        className="text-sm leading-relaxed text-foreground-soft"
                      >
                        {figure}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Reveal>
          </li>
        ))}
      </ol>

      {/* Education + supporting record */}
      <div className="mt-10 grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Reveal>
          <div className="panel flex h-full flex-col p-6">
            <div className="flex items-center gap-3">
              <GraduationCap aria-hidden className="size-4 text-accent" />
              <SubHeading>Education</SubHeading>
            </div>
            <h3 className="mt-4 text-[0.975rem] font-medium">
              {EDUCATION.degree}
            </h3>
            <p className="mt-1 text-sm text-muted">{EDUCATION.institution}</p>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Chip tone="accent">{EDUCATION.period}</Chip>
              <Chip>{EDUCATION.detail}</Chip>
            </div>
            <ul className="mt-5 grid gap-2 border-t border-rule pt-4">
              {EDUCATION.earlier.map((line) => (
                <li key={line} className="text-xs leading-relaxed text-muted-2">
                  {line}
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="panel flex h-full flex-col p-6">
            <SubHeading hint={`${CERTIFICATIONS.length} completed`}>
              Certifications
            </SubHeading>
            <ul className="mt-4 grid gap-0">
              {CERTIFICATIONS.map((certification) => (
                <li
                  key={certification.name}
                  className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5 border-b border-rule py-2.5 last:border-0 last:pb-0"
                >
                  <span className="text-sm leading-snug text-foreground-soft">
                    {certification.name}
                  </span>
                  <span className="mono-label tabular">
                    {certification.issuer} · {certification.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <Reveal>
          <div className="panel-quiet h-full p-6">
            <SubHeading>Community</SubHeading>
            <ul className="mt-4 grid gap-3">
              {COMMUNITY.map((entry) => (
                <li key={entry.name} className="grid gap-0.5">
                  <span className="text-sm font-medium">{entry.name}</span>
                  <span className="text-xs text-muted">{entry.role}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <div className="panel-quiet h-full p-6">
            <SubHeading>Working languages</SubHeading>
            <ul className="mt-4 grid gap-2.5">
              {SPOKEN_LANGUAGES.map((language) => (
                <li
                  key={language.name}
                  className="flex items-baseline justify-between gap-4 border-b border-rule pb-2.5 text-sm last:border-0 last:pb-0"
                >
                  <span>{language.name}</span>
                  <span className="mono-label">{language.level}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
