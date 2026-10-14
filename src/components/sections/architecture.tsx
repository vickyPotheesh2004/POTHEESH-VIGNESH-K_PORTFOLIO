import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Section, SubHeading } from "@/components/ui/section";
import { Reveal } from "@/components/reveal";
import { PipelineDiagram } from "@/components/pipeline-diagram";
import type { PipelineStage } from "@/data/projects";

/**
 * The reference architecture, reconstructed from the shared shape of the
 * systems on this site. It is presented explicitly as a reference pattern
 * rather than as a diagram of any single project — each project page carries
 * its own, project-specific diagram.
 */
const REFERENCE: PipelineStage[] = [
  {
    id: "01",
    name: "Ingest",
    detail:
      "Files, recordings or filings arrive in whatever format the source uses — PDF, DOCX, spreadsheet, audio, image or live API. Parsing happens before anything clever touches the data.",
    role: "input",
  },
  {
    id: "02",
    name: "Normalise",
    detail:
      "Text is extracted, laid out, chunked and tagged with provenance metadata — page, sheet, timestamp — so a fragment can always be traced back to where it came from.",
    role: "process",
  },
  {
    id: "03",
    name: "Index",
    detail:
      "Two indexes are built rather than one: dense embeddings for paraphrase and BM25 keyword postings for exact figures, tickers and identifiers. Dense search alone quietly loses the numbers that matter.",
    role: "process",
  },
  {
    id: "04",
    name: "Route",
    detail:
      "A cheap intent classifier decides which workflow a question belongs to — document Q&A, insight generation, verification, comparison — instead of sending everything down one prompt.",
    role: "reasoning",
  },
  {
    id: "05",
    name: "Retrieve and rank",
    detail:
      "Hybrid results are fused and reranked by a cross-encoder, so the passages that reach the model are the ones that actually bear on the question.",
    role: "process",
  },
  {
    id: "06",
    name: "Reason",
    detail:
      "The language model plans and coordinates. Arithmetic, lookups and formatting are delegated to deterministic code the model calls, so it composes verified values rather than recalling them.",
    role: "reasoning",
  },
  {
    id: "07",
    name: "Verify",
    detail:
      "Extracted figures are re-checked against the source, units are reconciled and conflicting values are surfaced. A value that cannot be grounded fails here rather than reaching the output.",
    role: "validation",
  },
  {
    id: "08",
    name: "Answer or abstain",
    detail:
      "The response ships with a confidence value, the source reference and an explanation. If verification failed, the system reports the gap instead of producing a confident number.",
    role: "output",
  },
];

/** The architectural decision that actually distinguishes each project. */
const DISTINCTIONS = [
  {
    project: "FinBench",
    slug: "finbench",
    trait:
      "Model as orchestrator only. Eight deterministic Python libraries do the extraction, maths and verification across a 19-node graph.",
  },
  {
    project: "Causa",
    slug: "causa",
    trait:
      "Evidence-before-verdict investigation. Exceptions are grouped by root cause and every resolution path carries its supporting evidence.",
  },
  {
    project: "ResearchHelp",
    slug: "researchhelp",
    trait:
      "Three local models routed by task, run through Ollama at zero API cost, over a hybrid ChromaDB plus BM25 index.",
  },
  {
    project: "VarshaAI",
    slug: "varsha",
    trait:
      "Geospatial risk fusion — rainfall, elevation and drainage signals combined into a monsoon zone classification.",
  },
  {
    project: "FinBench libraries",
    slug: "fina-suite",
    trait:
      "Seven packages published to PyPI so the deterministic layer is installable and independently reusable.",
  },
  {
    project: "AntiGravity",
    slug: "antigravity",
    trait:
      "Agent-based simulation treated as a design instrument — crowd flow and evacuation behaviour modelled before the building exists.",
  },
];

export function ArchitectureSection() {
  return (
    <Section
      id="architecture"
      index={5}
      kicker="Architecture"
      title="The pattern behind all of it"
      intro={
        <>
          These are not twelve unrelated builds. The same spine runs through
          them: two indexes rather than one, the model coordinating instead of
          computing, and a verification gate standing between the model and
          the answer. Each project page carries its own diagram; this is the
          shape they share.
        </>
      }
    >
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:gap-16">
        <Reveal>
          <PipelineDiagram
            stages={REFERENCE}
            caption="Reference pattern, reconstructed from the shared structure of the projects on this site. It is not a diagram of any single system — the project pages carry those."
          />
        </Reveal>

        <div>
          <Reveal>
            <SubHeading hint="Where each system diverges">
              Distinctive decisions
            </SubHeading>
          </Reveal>

          <ul className="mt-5 grid gap-px border border-border bg-[var(--rule)]">
            {DISTINCTIONS.map((item) => (
              <li key={item.slug} className="bg-surface">
                <Link
                  href={`/projects/${item.slug}`}
                  className="group block p-5 transition-colors hover:bg-surface-2"
                >
                  <span className="flex items-baseline justify-between gap-3">
                    <span className="text-[0.9375rem] font-medium tracking-[-0.01em] transition-colors group-hover:text-accent">
                      {item.project}
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="size-3.5 shrink-0 text-muted-2 transition-transform duration-200 group-hover:translate-x-0.5"
                    />
                  </span>
                  <span className="mt-2 block text-sm leading-relaxed text-muted">
                    {item.trait}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
