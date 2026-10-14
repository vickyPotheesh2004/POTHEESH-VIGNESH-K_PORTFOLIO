import type { PipelineStage } from "@/data/projects";
import { cn } from "@/lib/utils";

/**
 * Semantic colour role per stage. Violet is reserved exclusively for model
 * reasoning so that one accent carries one meaning across the whole site.
 */
const ROLE: Record<
  PipelineStage["role"],
  { label: string; color: string }
> = {
  input: { label: "Input", color: "var(--accent)" },
  process: { label: "Process", color: "var(--muted)" },
  reasoning: { label: "Model", color: "var(--violet)" },
  validation: { label: "Check", color: "var(--signal)" },
  output: { label: "Output", color: "var(--positive)" },
};

const ORDER: PipelineStage["role"][] = [
  "input",
  "process",
  "reasoning",
  "validation",
  "output",
];

interface PipelineDiagramProps {
  stages: PipelineStage[];
  className?: string;
  caption?: string;
}

/**
 * The architecture diagram.
 *
 * Rendered as an ordered list rather than an SVG so the whole pipeline is
 * readable by a screen reader, reflows properly on a phone, and needs no
 * horizontal scrolling. The nodes and rail carry the visual structure; the
 * text carries the meaning.
 */
export function PipelineDiagram({
  stages,
  className,
  caption,
}: PipelineDiagramProps) {
  return (
    <div className={className}>
      {/* Legend */}
      <ul className="mb-7 flex flex-wrap items-center gap-x-5 gap-y-2">
        {ORDER.map((role) => (
          <li key={role} className="flex items-center gap-2">
            <span
              aria-hidden
              className="size-2.5 border"
              style={{
                borderColor: ROLE[role].color,
                backgroundColor: `color-mix(in oklab, ${ROLE[role].color} 30%, transparent)`,
              }}
            />
            <span className="mono-label" style={{ color: ROLE[role].color }}>
              {ROLE[role].label}
            </span>
          </li>
        ))}
      </ul>

      <ol className="grid">
        {stages.map((stage, index) => {
          const role = ROLE[stage.role];
          const isLast = index === stages.length - 1;

          return (
            <li
              key={stage.id}
              className="grid grid-cols-[2.5rem_1fr] gap-x-3 sm:grid-cols-[3rem_1fr] sm:gap-x-4"
            >
              {/* Rail column */}
              <div className="flex flex-col items-center">
                <span
                  className="grid size-9 shrink-0 place-items-center border bg-surface-2 font-mono text-[0.6875rem] tabular sm:size-10"
                  style={{ borderColor: role.color, color: role.color }}
                >
                  {stage.id}
                </span>
                {!isLast && (
                  <span
                    aria-hidden
                    className="flow-rail my-1.5 w-px flex-1"
                  />
                )}
              </div>

              {/* Content column */}
              <div className={cn("pt-1.5", !isLast && "pb-6")}>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h4 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                    {stage.name}
                  </h4>
                  <span
                    className="font-mono text-[0.625rem] uppercase tracking-[0.14em]"
                    style={{ color: role.color }}
                  >
                    {role.label}
                  </span>
                </div>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-muted">
                  {stage.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>

      {caption && (
        <p className="mt-6 border-t border-rule pt-4 text-xs leading-relaxed text-muted-2">
          {caption}
        </p>
      )}
    </div>
  );
}
