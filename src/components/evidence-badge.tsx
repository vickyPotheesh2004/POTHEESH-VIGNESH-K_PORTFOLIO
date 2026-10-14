import type { Evidence } from "@/data/projects";
import { Chip } from "@/components/ui/action";

const CONFIG: Record<
  Evidence,
  { label: string; tone: "positive" | "signal" | "violet"; title: string }
> = {
  verified: {
    label: "Verified",
    tone: "positive",
    title:
      "Checked first-hand while building this site — the link resolves, the package exists, or the file is present.",
  },
  reported: {
    label: "Self-reported",
    tone: "signal",
    title:
      "Stated by the project's own README, résumé or hackathon submission. It is a claim, not an independent measurement.",
  },
  proposed: {
    label: "Proposed",
    tone: "violet",
    title: "Not built yet. Listed under future work only.",
  },
};

/**
 * Labels where a number came from. Used everywhere a figure appears so a
 * self-reported résumé number can never be mistaken for a measured result.
 */
export function EvidenceBadge({ evidence }: { evidence: Evidence }) {
  const { label, tone, title } = CONFIG[evidence];
  return (
    <Chip tone={tone} className="cursor-help" >
      <span title={title} aria-label={`${label} — ${title}`}>
        {label}
      </span>
    </Chip>
  );
}

/** Legend explaining the three evidence levels, shown once above result tables. */
export function EvidenceLegend({ className }: { className?: string }) {
  return (
    <div className={className}>
      <p className="mono-label mb-3">Evidence key</p>
      <ul className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-muted">
        {(Object.keys(CONFIG) as Evidence[]).map((key) => (
          <li key={key} className="flex items-start gap-2">
            <EvidenceBadge evidence={key} />
            <span className="max-w-xs leading-snug">{CONFIG[key].title}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
