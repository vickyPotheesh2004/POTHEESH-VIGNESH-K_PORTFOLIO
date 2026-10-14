import Image from "next/image";
import { Section, SubHeading } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { ABOUT } from "@/data/profile";
import { pad } from "@/lib/utils";

export function AboutSection() {
  return (
    <Section
      id="about"
      index={1}
      kicker="About"
      title={ABOUT.lead}
      intro={ABOUT.subhead}
    >
      <div className="grid gap-10 lg:grid-cols-[minmax(0,0.82fr)_minmax(0,1.18fr)] lg:gap-14">
        {/* Portrait + quick-fact datasheet */}
        <div className="space-y-6">
          <Reveal>
            <figure>
              <div className="panel overflow-hidden p-1.5">
                <Image
                  src="/images/profile-portrait.png"
                  alt="Potheesh Vignesh K"
                  width={1086}
                  height={1448}
                  sizes="(max-width: 1024px) 80vw, 20rem"
                  className="h-auto w-full"
                  priority
                />
              </div>
              <figcaption className="mono-label mt-3 flex items-center justify-between">
                <span>Fig. 1 — subject</span>
                <span className="tabular">1086 × 1448</span>
              </figcaption>
            </figure>
          </Reveal>

          <Reveal delay={80}>
            <div className="panel-quiet p-5">
              <SubHeading>Datasheet</SubHeading>
              <dl className="mt-4 grid gap-3">
                {ABOUT.facts.map((fact) => (
                  <div
                    key={fact.label}
                    className="grid gap-0.5 border-b border-rule pb-3 last:border-0 last:pb-0"
                  >
                    <dt className="mono-label">{fact.label}</dt>
                    <dd className="text-sm leading-snug text-foreground-soft">
                      {fact.value}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>
          </Reveal>
        </div>

        {/* Narrative */}
        <div className="space-y-5">
          {ABOUT.paragraphs.map((paragraph, index) => (
            <Reveal key={paragraph.slice(0, 32)} delay={index * 40}>
              <p className="text-[0.975rem] leading-[1.75] text-foreground-soft sm:text-base">
                {paragraph}
              </p>
            </Reveal>
          ))}
        </div>
      </div>

      {/* Principles */}
      <div className="mt-16">
        <Reveal>
          <SubHeading hint="Six rules the systems on this site are built against">
            Operating principles
          </SubHeading>
        </Reveal>
        <ul className="mt-6 grid gap-px border border-border bg-[var(--rule)] sm:grid-cols-2 lg:grid-cols-3">
          {ABOUT.principles.map((principle, index) => (
            <li key={principle.title} className="bg-surface p-5 sm:p-6">
              <span className="mono-label tabular text-accent">
                {pad(index + 1)}
              </span>
              <h3 className="mt-3 text-[0.9375rem] font-medium tracking-[-0.01em]">
                {principle.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">
                {principle.body}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {/* Workspace */}
      <Reveal className="mt-16">
        <figure className="grid items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="panel overflow-hidden p-1.5">
            <Image
              src="/images/workspace.png"
              alt="The desk and dual-display setup the projects on this site were built at"
              width={1254}
              height={1254}
              sizes="(max-width: 1024px) 90vw, 30rem"
              className="h-auto w-full"
            />
          </div>
          <figcaption className="max-w-md">
            <p className="mono-label">Fig. 2 — workspace</p>
            <p className="mt-4 font-display text-display-sm leading-snug tracking-[-0.015em]">
              {ABOUT.workspaceCaption}
            </p>
          </figcaption>
        </figure>
      </Reveal>
    </Section>
  );
}
