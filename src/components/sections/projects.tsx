import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SubHeading } from "@/components/ui/section";
import { Action, Chip } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { ProjectCard } from "@/components/project-card";
import {
  FEATURED_PROJECTS,
  PROJECTS,
  PROJECT_STATS,
  type ProjectStatus,
} from "@/data/projects";

const STATUS_LABEL: Record<ProjectStatus, string> = {
  shipped: "Shipped",
  "in-development": "In development",
  prototype: "Prototype",
  "documented-design": "Docs + demo",
};

const featured = FEATURED_PROJECTS;
const rest = PROJECTS.filter((project) => !project.featured);
/** Every project that has a recording, in catalogue order. */
const recorded = PROJECTS.filter((project) => project.video);

export function ProjectsSection() {
  return (
    <Section
      id="projects"
      index={4}
      kicker="Projects"
      title="Twelve systems, every claim traceable"
      intro={
        <>
          Each entry below opens a full breakdown: the problem, the
          architecture, the data flow, what was verified, what is
          self-reported, and where the thing actually falls short. Nothing on
          this site asks you to take a number on trust.
        </>
      }
    >
      <ul className="grid gap-5 lg:grid-cols-2">
        {featured.map((project, index) => (
          <li key={project.slug}>
            <Reveal delay={index * 60}>
              <ProjectCard project={project} index={index} featured />
            </Reveal>
          </li>
        ))}
      </ul>

      {/* Remaining catalogue, compact */}
      <div className="mt-12">
        <Reveal>
          <SubHeading hint={`${rest.length} further projects`}>
            Full catalogue
          </SubHeading>
        </Reveal>
        <ol className="mt-5 grid gap-px border border-border bg-[var(--rule)]">
          {rest.map((project, index) => (
            <li key={project.slug} className="bg-surface">
              <Link
                href={`/projects/${project.slug}`}
                className="flex flex-wrap items-baseline gap-x-4 gap-y-2 px-5 py-4 transition-colors hover:bg-surface-2"
              >
                <span className="mono-label tabular text-accent">
                  {String(featured.length + index + 1).padStart(2, "0")}
                </span>
                <span className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                  {project.title}
                </span>
                <span className="mono-label hidden sm:inline">
                  {project.category}
                </span>
                <span className="ml-auto flex items-center gap-2.5">
                  <Chip>{STATUS_LABEL[project.status]}</Chip>
                  <ArrowRight aria-hidden className="size-3.5 text-muted-2" />
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      {/* Recordings — the real footage, attached to the projects it belongs to. */}
      <div className="mt-14">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-4">
            <SubHeading hint={`${recorded.length} screen recordings`}>
              Project recordings
            </SubHeading>
            <p className="max-w-md text-xs leading-relaxed text-muted-2">
              Portrait captures of each system running.{" "}
              {PROJECT_STATS.inferredVideos > 0
                ? `${PROJECT_STATS.inferredVideos} recording is matched by filename and subject only and is flagged as such on its project page.`
                : "Every recording is confirmed against the project it appears on."}
            </p>
          </div>
        </Reveal>

        <Reveal delay={60}>
          <ul className="no-scrollbar -mx-5 mt-5 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:px-8">
            {recorded.map((project) => (
              <li
                key={project.slug}
                className="w-[8.5rem] shrink-0 snap-start sm:w-[9.5rem]"
              >
                <Link
                  href={`/projects/${project.slug}`}
                  className="group block"
                  aria-label={`${project.title} — open the full breakdown`}
                >
                  <span className="panel block overflow-hidden p-1">
                    <span className="relative block aspect-[9/16] overflow-hidden bg-[var(--background-deep)]">
                      <Image
                        src={project.video!.poster}
                        alt=""
                        fill
                        sizes="10rem"
                        className="object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                      />
                    </span>
                  </span>
                  <span className="mono-label mt-2 block truncate transition-colors group-hover:text-accent">
                    {project.title.split("—")[0]?.trim()}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>

      <Reveal className="mt-10">
        <Action href="/projects" size="lg" variant="outline">
          Browse all {PROJECT_STATS.total} projects
          <ArrowRight aria-hidden className="size-4" />
        </Action>
      </Reveal>
    </Section>
  );
}
