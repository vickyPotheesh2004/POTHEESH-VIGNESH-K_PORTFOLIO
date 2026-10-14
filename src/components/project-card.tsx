import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, CornerDownRight, Play } from "lucide-react";
import type { Project, ProjectStatus } from "@/data/projects";
import { Chip } from "@/components/ui/action";
import { pad } from "@/lib/utils";

const STATUS: Record<
  ProjectStatus,
  { label: string; tone: "positive" | "accent" | "signal" | "violet" }
> = {
  shipped: { label: "Shipped", tone: "positive" },
  "in-development": { label: "In development", tone: "accent" },
  prototype: { label: "Prototype", tone: "signal" },
  "documented-design": { label: "Docs + demo only", tone: "violet" },
};

interface ProjectCardProps {
  project: Project;
  /** Position on the index, used for the mono numbering. */
  index: number;
  /** Featured cards get a poster banner and more room. */
  featured?: boolean;
}

export function ProjectCard({ project, index, featured }: ProjectCardProps) {
  const status = STATUS[project.status];
  const headline = project.results[0];
  const repo = project.links.find((l) => l.kind === "repo");
  const live = project.links.find((l) => l.kind === "live");
  const stack = project.stack.slice(0, featured ? 6 : 4);
  const overflow = project.stack.length - stack.length;

  return (
    <article className="panel hover-lift flex h-full flex-col overflow-hidden">
      {/* Poster banner on featured cards only — hierarchy without noise. */}
      {featured && project.video && (
        <Link
          href={`/projects/${project.slug}`}
          className="group relative block aspect-[16/7] overflow-hidden border-b border-border bg-[var(--background-deep)]"
          tabIndex={-1}
        >
          <Image
            src={project.video.poster}
            alt=""
            fill
            sizes="(max-width: 1024px) 100vw, 34rem"
            className="object-cover object-top opacity-85 transition-transform duration-500 group-hover:scale-[1.03]"
          />
          <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-[var(--surface)] via-transparent to-transparent" />
          <span className="absolute bottom-3 left-4 flex items-center gap-2 font-mono text-[0.625rem] uppercase tracking-[0.14em] text-foreground">
            <Play className="size-3 fill-accent text-accent" />
            Recording
          </span>
        </Link>
      )}

      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
          <span className="mono-label tabular text-accent">{pad(index + 1)}</span>
          <span className="mono-label">{project.category}</span>
          <Chip tone={status.tone} className="ml-auto">
            {status.label}
          </Chip>
        </div>

        <h3 className="mt-4 font-display text-display-sm leading-[1.15] tracking-[-0.015em]">
          <Link
            href={`/projects/${project.slug}`}
            className="transition-colors hover:text-accent"
          >
            {project.title}
          </Link>
        </h3>

        <p className="mt-3 text-sm leading-relaxed text-muted">
          {project.tagline}
        </p>

        <ul className="mt-5 flex flex-wrap gap-1.5">
          {stack.map((item) => (
            <li key={item}>
              <Chip>{item}</Chip>
            </li>
          ))}
          {overflow > 0 && (
            <li>
              <Chip tone="accent">+{overflow}</Chip>
            </li>
          )}
        </ul>

        {/* Headline result, with its provenance attached, never bare. */}
        {headline && (
          <p className="mt-5 flex flex-wrap items-baseline gap-x-2 gap-y-1 border-t border-rule pt-4 text-xs text-muted">
            <span className="tabular font-mono text-foreground-soft">
              {headline.value}
            </span>
            <span>{headline.label}</span>
            <span
              className="font-mono text-[0.625rem] uppercase tracking-[0.12em]"
              style={{
                color:
                  headline.evidence === "verified"
                    ? "var(--positive)"
                    : "var(--signal)",
              }}
            >
              {headline.evidence}
            </span>
          </p>
        )}

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 pt-6">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
          >
            Full breakdown
            <CornerDownRight
              aria-hidden
              className="size-3.5 transition-transform duration-200"
            />
          </Link>

          {live && (
            <a
              href={live.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
            >
              Live
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          )}

          {repo && (
            <a
              href={repo.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-foreground"
            >
              Source
              <ArrowUpRight aria-hidden className="size-3.5" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
