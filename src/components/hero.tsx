import { Download } from "lucide-react";
import { HeroStage } from "@/components/hero/hero-stage";
import { Action } from "@/components/ui/action";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { Reveal } from "@/components/reveal";
import { CONTACT, RESUME, SITE, resumeAvailable } from "@/data/site";
import { PROJECT_STATS } from "@/data/projects";
import { PUBLICATIONS, SKILLS } from "@/data/profile";

/** Technology ribbon, drawn from the real skill lists rather than invented. */
const RIBBON = Array.from(
  new Set([
    ...SKILLS[0]!.items,
    ...SKILLS[1]!.items,
    ...SKILLS[2]!.items,
    ...SKILLS[4]!.items,
    ...SKILLS[5]!.items,
  ]),
);

const STATS = [
  { value: String(PROJECT_STATS.total), label: "projects" },
  { value: String(PROJECT_STATS.withLiveDemo), label: "live deployments" },
  { value: String(PROJECT_STATS.publishedPackages), label: "PyPI packages" },
  { value: String(PUBLICATIONS.length), label: "IEEE papers" },
  { value: String(PROJECT_STATS.videos), label: "recordings" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden" aria-labelledby="hero-heading">
      {/* Blueprint floor + a single hairline horizon. */}
      <div aria-hidden className="blueprint pointer-events-none absolute inset-0 opacity-70" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-[var(--rule)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 pb-14 pt-12 sm:px-8 sm:pb-20 sm:pt-16 lg:pb-24 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:gap-8">
          <div>
            <Reveal>
              <p className="mono-label flex flex-wrap items-center gap-x-3 gap-y-2">
                <span className="text-accent">{SITE.role}</span>
                <span aria-hidden className="hidden h-px w-8 bg-[var(--rule)] sm:block" />
                <span>{SITE.location.display}</span>
              </p>
            </Reveal>

            <Reveal delay={60}>
              <h1
                id="hero-heading"
                className="mt-6 font-display text-display-xl leading-[0.98] tracking-[-0.03em]"
              >
                AI systems that{" "}
                <em className="italic text-accent">show their work</em>.
              </h1>
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-6 max-w-xl text-[1.0625rem] leading-relaxed text-muted sm:text-lg">
                I am {SITE.name} — an aspiring AI/ML engineer and solo AI
                researcher. I build retrieval-augmented, multi-agent and
                verification systems where the model orchestrates rather than
                guesses, and where a number that cannot be traced back to its
                source is never presented as an answer.
              </p>
            </Reveal>

            <Reveal delay={180}>
              <div className="mt-8 flex flex-wrap items-center gap-2.5">
                <Action href="/contact" size="lg">
                  Discuss an AI project
                </Action>
                <Action href="/projects" size="lg" variant="outline">
                  View my projects
                </Action>
                {/* Only rendered once a real PDF is committed — never a dead link. */}
                {resumeAvailable && (
                  <Action
                    href={RESUME.href}
                    size="lg"
                    variant="outline"
                    external
                    trailing={<Download aria-hidden className="size-3.5" />}
                  >
                    Download résumé
                  </Action>
                )}
              </div>
            </Reveal>

            <Reveal delay={240}>
              <div className="mt-6 flex flex-wrap items-center gap-2.5">
                <Action
                  href={CONTACT.linkedin}
                  size="sm"
                  variant="outline"
                  external
                  trailing={null}
                >
                  <LinkedinIcon className="size-3.5 text-accent" />
                  Connect on LinkedIn
                </Action>
                <Action
                  href={CONTACT.github}
                  size="sm"
                  variant="outline"
                  external
                  trailing={null}
                >
                  <GithubIcon className="size-3.5 text-accent" />
                  Explore GitHub
                </Action>
              </div>
            </Reveal>

            <Reveal delay={300}>
              <p className="mt-7 flex items-center gap-2.5 text-sm text-muted">
                <span
                  aria-hidden
                  className="live-dot size-1.5 shrink-0 rounded-full bg-positive"
                />
                {SITE.availability}
              </p>
            </Reveal>
          </div>

          <Reveal delay={140} className="justify-self-center lg:justify-self-end">
            <HeroStage />
          </Reveal>
        </div>

        {/* Verified counters. Every figure is checkable on this site. */}
        <Reveal delay={140}>
          <dl className="mt-14 grid grid-cols-2 gap-px border border-border bg-[var(--rule)] sm:grid-cols-3 lg:mt-20 lg:grid-cols-5">
            {STATS.map((stat) => (
              <div key={stat.label} className="bg-surface px-4 py-4 sm:px-5 sm:py-5">
                <dt className="mono-label">{stat.label}</dt>
                <dd className="tabular mt-2 font-display text-3xl leading-none tracking-[-0.02em]">
                  {stat.value}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>
      </div>

      {/* Technology ribbon. Decorative, so it is hidden from assistive tech. */}
      <div
        aria-hidden
        className="marquee-viewport relative overflow-hidden border-y border-rule py-4"
      >
        <div className="marquee-track flex w-max gap-8">
          {[...RIBBON, ...RIBBON].map((item, index) => (
            <span
              key={`${item}-${index}`}
              className="flex items-center gap-8 whitespace-nowrap font-mono text-xs uppercase tracking-[0.16em] text-muted-2"
            >
              {item}
              <span className="size-1 rounded-full bg-[var(--rule)]" />
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
