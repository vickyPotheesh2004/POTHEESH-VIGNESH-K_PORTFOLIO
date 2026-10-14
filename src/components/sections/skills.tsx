import { Section, SubHeading } from "@/components/ui/section";
import { Chip } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { SKILLS, type Provenance } from "@/data/profile";
import { cn } from "@/lib/utils";

const PROVENANCE: Record<
  Provenance,
  { label: string; tone: "signal" | "positive" | "accent" }
> = {
  resume: { label: "From résumé", tone: "signal" },
  repo: { label: "In public repos", tone: "positive" },
  verified: { label: "Verified", tone: "accent" },
};

export function SkillsSection() {
  const repoGroup = SKILLS.find((group) => group.provenance === "repo");

  return (
    <Section
      id="skills"
      index={2}
      kicker="Capabilities"
      title="What I actually work with"
      intro={
        <>
          Split honestly in two. The first lists are what my résumé states. The
          last is what you can confirm by opening a public repository — a wider
          stack than the résumé line, because shipped source does not need
          anyone&rsquo;s permission to be counted.
        </>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SKILLS.map((group, index) => {
          const provenance = PROVENANCE[group.provenance];
          const wide = group.provenance === "repo";

          return (
            <li
              key={group.title}
              className={cn(
                "panel flex flex-col p-5 sm:p-6",
                wide && "sm:col-span-2 lg:col-span-3",
              )}
            >
              <Reveal delay={index * 40} className="flex flex-1 flex-col">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <SubHeading>{group.title}</SubHeading>
                  <Chip tone={provenance.tone}>{provenance.label}</Chip>
                </div>

                {group.note && (
                  <p className="mt-3 text-xs leading-relaxed text-muted-2">
                    {group.note}
                  </p>
                )}

                <ul
                  className={cn(
                    "mt-4 flex flex-wrap gap-1.5",
                    wide && "sm:gap-2",
                  )}
                >
                  {group.items.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </Reveal>
            </li>
          );
        })}
      </ul>

      {repoGroup && (
        <Reveal className="mt-6">
          <p className="text-sm leading-relaxed text-muted-2">
            The repository-evidenced stack is the honest over-delivery: it is
            work that exists and can be opened, whether or not a résumé line
            mentions it.
          </p>
        </Reveal>
      )}
    </Section>
  );
}
