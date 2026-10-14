import type { Metadata } from "next";
import { FileText } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { SubHeading } from "@/components/ui/section";
import { Chip, Action } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { COMMUNITY, PUBLICATIONS } from "@/data/profile";

export const metadata: Metadata = pageMetadata({
  title: "Research & Publications",
  description:
    "IEEE conference publications by Potheesh Vignesh K on AGI-assisted portable drone systems and MEC/MFA wearable health monitoring, plus his current research interests in retrieval, evaluation and local inference.",
  path: "/research",
  keywords: [
    "IEEE conference paper",
    "AGI drone systems",
    "wearable health monitoring MEC MFA",
    "AI research undergraduate",
    "LLM evaluation research",
  ],
});

const INTERESTS = [
  {
    title: "Retrieval that does not miss the number",
    body: "Dense embeddings lose exact figures, tickers and identifiers. A large part of my work is hybrid retrieval — pairing vector search with lexical matching and reranking so the passage containing the right value is actually the passage that reaches the model.",
  },
  {
    title: "Evaluation and honest abstention",
    body: "Most AI projects skip the part that proves they work. I build test suites over real question/answer pairs and verification layers that re-check extracted figures against the source, so a system can report uncertainty instead of producing a confident wrong answer.",
  },
  {
    title: "The model as orchestrator, not oracle",
    body: "Arithmetic, extraction and validation belong in deterministic, tested code. The language model coordinates those tools and explains the result. This is the single design decision that most improves the trustworthiness of an LLM application.",
  },
  {
    title: "Local and on-device inference",
    body: "Running models on your own hardware removes the per-query bill and keeps confidential documents inside the network. I am interested in where local models are already the right answer, and where they are not yet.",
  },
  {
    title: "Speech and multilingual NLP",
    body: "Transcription is solved; making a two-hour recording navigable in four languages is not. My interest is in topic segmentation and cross-language handling that makes long audio actually usable.",
  },
  {
    title: "Evidence-grounded decision support",
    body: "Systems that help a person decide — financial exception investigation, safety advisories — while keeping the decision with the human and showing the evidence behind every recommendation.",
  },
];

export default function ResearchPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Research", path: "/research" },
        ])}
      />

      <PageHero
        kicker="Research"
        title="Publications and current research"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Research", path: "/research" },
        ]}
        intro="Two IEEE conference papers published as an undergraduate, and the problems I keep returning to while building the systems elsewhere on this site."
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <section>
          <SubHeading hint={`${PUBLICATIONS.length} publications`}>
            IEEE conference publications
          </SubHeading>

          <ul className="mt-5 grid gap-px border border-border bg-[var(--rule)]">
            {PUBLICATIONS.map((publication, index) => (
              <li key={publication.title} className="bg-surface p-6 sm:p-8">
                <Reveal delay={index * 60}>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
                    <FileText aria-hidden className="size-4 text-accent" />
                    <Chip tone="accent">{publication.venue}</Chip>
                    <Chip tone="positive">{publication.year}</Chip>
                    <span className="mono-label ml-auto">
                      {publication.kind}
                    </span>
                  </div>

                  <h2 className="mt-4 max-w-3xl font-display text-display-md leading-[1.12] tracking-[-0.02em]">
                    {publication.title}
                  </h2>

                  <dl className="mt-5 grid gap-3 sm:grid-cols-2">
                    <div className="grid gap-0.5">
                      <dt className="mono-label">Author</dt>
                      <dd className="text-sm text-foreground-soft">
                        {publication.authors}
                      </dd>
                    </div>
                    <div className="grid gap-0.5">
                      <dt className="mono-label">Venue</dt>
                      <dd className="text-sm text-foreground-soft">
                        {publication.venue}, {publication.year}
                      </dd>
                    </div>
                  </dl>

                  {publication.note && (
                    <p className="mt-4 text-sm leading-relaxed text-muted">
                      {publication.note}
                    </p>
                  )}
                </Reveal>
              </li>
            ))}
          </ul>

          <p className="mt-4 border border-border bg-surface-2 p-4 text-xs leading-relaxed text-muted-2">
            DOIs, citation counts and indexing status are not listed on this
            site because they have not been independently verified here.
            Presenting an unverified identifier would be worse than presenting
            none. Each entry lists exactly what can be confirmed.
          </p>
        </section>

        <section className="mt-16 border-t border-rule pt-10">
          <SubHeading hint="What I keep working on">
            Research interests
          </SubHeading>
          <ul className="mt-6 grid gap-px border border-border bg-[var(--rule)] sm:grid-cols-2">
            {INTERESTS.map((interest, index) => (
              <li key={interest.title} className="bg-surface p-6">
                <span className="mono-label tabular text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-3 text-[0.9375rem] font-medium tracking-[-0.01em]">
                  {interest.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {interest.body}
                </p>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-16 border-t border-rule pt-10">
          <SubHeading hint={`${COMMUNITY.length} communities`}>
            Where I take part
          </SubHeading>
          <ul className="mt-5 grid gap-3 sm:grid-cols-3">
            {COMMUNITY.map((entry) => (
              <li key={entry.name} className="panel-quiet p-5">
                <p className="text-[0.9375rem] font-medium">{entry.name}</p>
                <p className="mt-1.5 text-sm text-muted">{entry.role}</p>
              </li>
            ))}
          </ul>
        </section>

        <Reveal className="mt-14">
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
            <div className="max-w-xl">
              <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                Research collaboration or a build?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                If your problem overlaps with any of the above, I am interested
                in hearing about it — whether that is a paper, a product or a
                grant-funded prototype.
              </p>
            </div>
            <Action href="/contact" size="lg">
              Get in touch
            </Action>
          </div>
        </Reveal>
      </div>
    </>
  );
}
