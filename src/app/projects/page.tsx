import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { EvidenceLegend } from "@/components/evidence-badge";
import { Action } from "@/components/ui/action";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { PROJECT_STATS, SORTED_PROJECTS, type ProjectStatus } from "@/data/projects";

export const metadata: Metadata = pageMetadata({
  title: "All Projects",
  description:
    "Every project Potheesh Vignesh K has built — hybrid retrieval systems, multi-agent pipelines, deterministic verification libraries and AI web applications. Each one is labelled with what was verified and what is self-reported.",
  path: "/projects",
  keywords: [
    "AI portfolio projects",
    "RAG system",
    "multi-agent pipeline",
    "LangGraph project",
    "LLM project",
    "Python AI projects",
  ],
});

const ORDER: ProjectStatus[] = [
  "shipped",
  "in-development",
  "prototype",
  "documented-design",
];

const LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-development": "In development",
  prototype: "Prototype",
  "documented-design": "Documented design",
};

const sorted = SORTED_PROJECTS;

const COUNTS = ORDER.map((status) => ({
  status,
  count: sorted.filter((project) => project.status === status).length,
})).filter((entry) => entry.count > 0);

export default function ProjectsPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ])}
      />

      <PageHero
        kicker="Catalogue"
        title="Every project, with the evidence attached"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
        ]}
        intro="Twelve systems in total. Each one opens a full breakdown — the problem, the architecture, how data moves, what was verified first-hand, what is self-reported, and where it falls short."
      >
        <dl className="mt-8 flex flex-wrap gap-x-8 gap-y-4">
          <div>
            <dt className="mono-label">Projects</dt>
            <dd className="tabular mt-1.5 font-display text-3xl leading-none">
              {PROJECT_STATS.total}
            </dd>
          </div>
          <div>
            <dt className="mono-label">Live deployments</dt>
            <dd className="tabular mt-1.5 font-display text-3xl leading-none">
              {PROJECT_STATS.withLiveDemo}
            </dd>
          </div>
          <div>
            <dt className="mono-label">PyPI packages</dt>
            <dd className="tabular mt-1.5 font-display text-3xl leading-none">
              {PROJECT_STATS.publishedPackages}
            </dd>
          </div>
          <div>
            <dt className="mono-label">Recordings</dt>
            <dd className="tabular mt-1.5 font-display text-3xl leading-none">
              {PROJECT_STATS.videos}
            </dd>
          </div>
        </dl>
      </PageHero>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        {/* Status legend */}
        <Reveal>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <span className="mono-label">Status</span>
            {COUNTS.map((entry) => (
              <span
                key={entry.status}
                className="flex items-center gap-2 text-xs text-muted"
              >
                <span className="tabular font-mono text-foreground-soft">
                  {entry.count}
                </span>
                {LABEL[entry.status]}
              </span>
            ))}
          </div>
        </Reveal>

        <ul className="mt-8 grid gap-5 lg:grid-cols-2">
          {sorted.map((project, index) => (
            <li key={project.slug}>
              <Reveal delay={(index % 2) * 60}>
                <ProjectCard project={project} index={index} />
              </Reveal>
            </li>
          ))}
        </ul>

        <EvidenceLegend className="mt-14 border-t border-rule pt-8" />

        <Reveal className="mt-12">
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6">
            <div className="max-w-xl">
              <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                Want one of these built for your team?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                The same architecture discipline is available as freelance
                work, or as an AI/ML engineering hire.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Action href="/contact">Discuss an AI project</Action>
              <Action href="/services" variant="outline">
                Freelance services
              </Action>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
