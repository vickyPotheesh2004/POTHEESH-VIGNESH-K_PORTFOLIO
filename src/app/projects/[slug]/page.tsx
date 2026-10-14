import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Package } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Block, BulletList } from "@/components/ui/block";
import { SubHeading } from "@/components/ui/section";
import { Action, Chip } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import { DataFlowTable } from "@/components/data-flow-table";
import { VideoFrame } from "@/components/video-frame";
import { EvidenceBadge, EvidenceLegend } from "@/components/evidence-badge";
import { ProjectCard } from "@/components/project-card";
import { StructuredData } from "@/components/structured-data";
import {
  breadcrumbJsonLd,
  pageMetadata,
  softwareSourceJsonLd,
} from "@/lib/seo";
import {
  PROJECTS,
  PROJECTS_BY_SLUG,
  getRelated,
  type ProjectStatus,
} from "@/data/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return PROJECTS.map((project) => ({ slug: project.slug }));
}

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-development": "In development",
  prototype: "Prototype",
  "documented-design": "Documented design",
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = PROJECTS_BY_SLUG.get(slug);

  if (!project) {
    return pageMetadata({
      title: "Project not found",
      description: "This project could not be found.",
      path: `/projects/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: project.title,
    description: project.tagline,
    path: `/projects/${project.slug}`,
    keywords: [project.category, ...project.stack.slice(0, 6)],
  });
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = PROJECTS_BY_SLUG.get(slug);
  if (!project) notFound();

  const related = getRelated(project.related);
  const repo = project.links.find((link) => link.kind === "repo");
  const live = project.links.find((link) => link.kind === "live");
  const packages = project.links.filter((link) => link.kind === "package");

  /* Block counter — keeps the numbering sequential no matter which optional
     blocks a given project actually has. */
  let step = 0;
  const next = () => ++step;

  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project.slug}` },
          ]),
          softwareSourceJsonLd({
            name: project.title,
            description: project.tagline,
            url: `/projects/${project.slug}`,
            codeRepository: repo?.href,
            programmingLanguage: project.stack.slice(0, 4),
          }),
        ]}
      />

      <PageHero
        kicker={`${project.category} · ${project.year}`}
        title={project.title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Projects", path: "/projects" },
          { name: project.title, path: `/projects/${project.slug}` },
        ]}
        intro={project.tagline}
      >
        <div className="mt-7 flex flex-wrap items-center gap-2.5">
          <Chip
            tone={project.status === "shipped" ? "positive" : "signal"}
          >
            {STATUS_LABEL[project.status]}
          </Chip>
          {live && (
            <Action href={live.href} size="sm" external>
              Open live app
            </Action>
          )}
          {repo && (
            <Action href={repo.href} size="sm" variant="outline" external>
              View source
            </Action>
          )}
          <Action href="/contact" size="sm" variant="outline">
            Discuss something like this
          </Action>
        </div>

        <p className="mt-5 max-w-3xl border-l-2 border-border-strong pl-4 text-sm leading-relaxed text-muted-2">
          <span className="mono-label mr-2 text-accent">Status note</span>
          {project.statusNote}
        </p>
      </PageHero>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,0.65fr)] lg:gap-16">
          {/* ---------------------------------------------------- narrative */}
          <div className="grid gap-10">
            <Block index={next()} title="Summary">
              <div className="grid gap-4">
                {project.summary.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-[0.975rem] leading-[1.75] text-foreground-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Block>

            <Block index={next()} title="The problem">
              <p className="text-[0.975rem] leading-[1.75] text-foreground-soft">
                {project.problem}
              </p>
            </Block>

            <Block index={next()} title="Who it is for">
              <p className="text-[0.975rem] leading-[1.75] text-foreground-soft">
                {project.audience}
              </p>
            </Block>

            <Block
              index={next()}
              title="Constraints"
              hint={`${project.constraints.length} binding`}
            >
              <BulletList items={project.constraints} />
            </Block>

            <Block index={next()} title="Approach">
              <ol className="grid gap-5">
                {project.approach.map((item, index) => (
                  <li key={item.slice(0, 32)} className="flex gap-4">
                    <span className="mono-label tabular shrink-0 pt-0.5 text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {item}
                    </span>
                  </li>
                ))}
              </ol>
            </Block>

            <Block
              index={next()}
              title="Architecture"
              hint={`${project.pipeline.length} stages`}
            >
              <PipelineDiagram stages={project.pipeline} />
            </Block>

            <Block
              index={next()}
              title="Data flow"
              hint={`${project.dataFlow.length} hand-offs`}
            >
              <DataFlowTable steps={project.dataFlow} />
            </Block>

            <Block index={next()} title="Techniques">
              <ul className="flex flex-wrap gap-1.5">
                {project.techniques.map((technique) => (
                  <li key={technique}>
                    <Chip>{technique}</Chip>
                  </li>
                ))}
              </ul>
            </Block>

            <Block index={next()} title="Implementation notes">
              <dl className="grid gap-px border border-border bg-[var(--rule)]">
                {project.implementation.map((item) => (
                  <div key={item.title} className="bg-surface p-5">
                    <dt className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                      {item.title}
                    </dt>
                    <dd className="mt-2 text-sm leading-relaxed text-muted">
                      {item.detail}
                    </dd>
                  </div>
                ))}
              </dl>
            </Block>

            <Block
              index={next()}
              title="What was actually verified"
              hint={`${project.verification.length} checks`}
            >
              <ul className="grid gap-px border border-border bg-[var(--rule)]">
                {project.verification.map((item) => (
                  <li key={item.title} className="bg-surface p-5">
                    <div className="flex items-start gap-3">
                      <span
                        aria-hidden
                        className="mt-1.5 size-2 shrink-0 rotate-45 border border-positive bg-[color-mix(in_oklab,var(--positive)_28%,transparent)]"
                      />
                      <div>
                        <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                          {item.title}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-muted">
                          {item.detail}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </Block>

            {project.results.length > 0 && (
              <Block
                index={next()}
                title="Results"
                hint={`${project.results.length} figures`}
              >
                <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">
                  Every figure below carries its own provenance. A self-reported
                  number from a résumé or hackathon submission is never
                  presented as an independent measurement.
                </p>
                <ul className="grid gap-px border border-border bg-[var(--rule)]">
                  {project.results.map((row) => (
                    <li
                      key={`${row.label}-${row.value}`}
                      className="grid gap-3 bg-surface p-5 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-start"
                    >
                      <div>
                        <p className="text-[0.9375rem] leading-snug text-foreground-soft">
                          <span className="tabular mr-2 font-mono text-foreground">
                            {row.value}
                          </span>
                          {row.label}
                        </p>
                        <p className="mt-1.5 text-xs leading-relaxed text-muted-2">
                          Source: {row.source}
                        </p>
                      </div>
                      <EvidenceBadge evidence={row.evidence} />
                    </li>
                  ))}
                </ul>
                <EvidenceLegend className="mt-6" />
              </Block>
            )}

            <Block
              index={next()}
              title="Limitations"
              hint="Stated plainly"
            >
              <BulletList items={project.limitations} />
            </Block>

            <Block
              index={next()}
              title="Future work"
              hint="Not built yet"
            >
              <p className="mb-5 max-w-2xl text-sm leading-relaxed text-muted">
                Nothing in this list exists yet. It is recorded here as
                direction, not as delivered functionality.
              </p>
              <BulletList items={project.futureWork} />
            </Block>

            {project.caveat && (
              <Block index={next()} title="Scope caveat">
                <p className="border border-signal/45 bg-signal-soft p-5 text-sm leading-relaxed text-foreground-soft">
                  {project.caveat}
                </p>
              </Block>
            )}
          </div>

          {/* ---------------------------------------------------- datasheet */}
          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="grid gap-6">
              {project.video && (
                <VideoFrame
                  src={project.video.src}
                  poster={project.video.poster}
                  caption={project.video.caption}
                  alt={`${project.title} — screen recording`}
                  confidence={project.video.confidence}
                />
              )}

              <div className="panel p-5">
                <SubHeading>Datasheet</SubHeading>
                <dl className="mt-4 grid gap-3">
                  {[
                    { label: "Category", value: project.category },
                    { label: "Year", value: project.year },
                    { label: "Status", value: STATUS_LABEL[project.status] },
                    { label: "Role", value: project.role },
                  ].map((row) => (
                    <div
                      key={row.label}
                      className="grid gap-0.5 border-b border-rule pb-3 last:border-0 last:pb-0"
                    >
                      <dt className="mono-label">{row.label}</dt>
                      <dd className="text-sm leading-snug text-foreground-soft">
                        {row.value}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>

              <div className="panel p-5">
                <SubHeading hint={`${project.stack.length} items`}>
                  Stack
                </SubHeading>
                <ul className="mt-4 flex flex-wrap gap-1.5">
                  {project.stack.map((item) => (
                    <li key={item}>
                      <Chip>{item}</Chip>
                    </li>
                  ))}
                </ul>
              </div>

              {(repo || live || packages.length > 0) && (
                <div className="panel p-5">
                  <SubHeading>Links</SubHeading>
                  <ul className="mt-4 grid gap-2">
                    {repo && (
                      <li>
                        <a
                          href={repo.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                        >
                          {repo.label}
                          <ArrowUpRight aria-hidden className="size-3.5" />
                        </a>
                      </li>
                    )}
                    {live && (
                      <li>
                        <a
                          href={live.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                        >
                          {live.label}
                          <ArrowUpRight aria-hidden className="size-3.5" />
                        </a>
                      </li>
                    )}
                    {packages.map((entry) => (
                      <li key={entry.href}>
                        <a
                          href={entry.href}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2 text-sm text-muted transition-colors hover:text-accent"
                        >
                          <Package aria-hidden className="size-3.5 shrink-0" />
                          {entry.label}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </div>

        {/* ------------------------------------------------------- related */}
        {related.length > 0 && (
          <section className="mt-16 border-t border-rule pt-10">
            <h2 className="font-display text-display-sm tracking-[-0.015em]">
              Related projects
            </h2>
            <ul className="mt-6 grid gap-5 lg:grid-cols-2">
              {related.map((entry, index) => (
                <li key={entry.slug}>
                  <ProjectCard project={entry} index={index} />
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* ----------------------------------------------------------- CTA */}
        <Reveal className="mt-12">
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6">
            <div className="max-w-xl">
              <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                Building something in this space?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                I take on a small number of freelance AI projects and am open to
                AI/ML engineering roles.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Action href="/contact">Discuss an AI project</Action>
              <Link
                href="/projects"
                className="inline-flex items-center gap-1.5 border border-border-strong px-5 py-2.5 text-sm transition-colors hover:border-accent hover:text-accent"
              >
                All projects
              </Link>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
