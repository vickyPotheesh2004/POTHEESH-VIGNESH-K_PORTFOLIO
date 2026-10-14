import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { Action } from "@/components/ui/action";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, faqJsonLd, pageMetadata } from "@/lib/seo";

/**
 * FAQ content. Every answer states only what can be supported: what he has
 * built, what he is honestly early in, and what he will not do (quote figures
 * he cannot verify, or take work he cannot do well).
 */
const FAQS = [
  {
    question: "Are you available for freelance AI projects?",
    answer:
      "Yes. He takes on a small number of freelance AI projects alongside his final year of study. The seven service areas listed on the services page are the ones backed by systems he has already built and published.",
  },
  {
    question: "Are you open to full-time AI/ML engineering roles?",
    answer:
      "Yes. He is graduating in June 2026 with a B.E. in Electronics & Communication Engineering and is open to AI/ML engineering roles. He is currently an AI intern at Tata Consultancy Services.",
  },
  {
    question: "How early in your career are you, honestly?",
    answer:
      "Early. The strongest evidence for his work is the repositories, tests and documentation on this site rather than years on a payroll. Where a number on this site is self-reported from his résumé or a hackathon submission rather than independently measured, it is labelled as such on the same line as the figure.",
  },
  {
    question: "What does the 'verified' label mean on this site?",
    answer:
      "It means the claim was checked first-hand while building this site — the URL resolves, the package exists on PyPI, or the file is present in the repository tree. Claims stated by a project's own README, résumé or hackathon submission are labelled 'self-reported' and are never presented as independent measurements.",
  },
  {
    question: "Can you run AI models locally instead of using a cloud API?",
    answer:
      "Yes, and several of his own projects do. The AI Document Q&A System routes work across three local models through Ollama at zero API cost, so confidential documents never leave the machine. Whether local inference is the right choice depends on the hardware available and the accuracy bar that has to be met.",
  },
  {
    question: "What is your approach to retrieval-augmented generation?",
    answer:
      "Hybrid retrieval by default. He builds both a dense vector index and a BM25 keyword index and fuses the results, because dense search alone quietly loses exact figures, tickers and identifiers. A cross-encoder reranks the fused results and answers are returned with their source reference attached.",
  },
  {
    question: "Will the system make up an answer if it doesn't know?",
    answer:
      "It is designed not to. Several of his systems include a verification layer that re-checks extracted figures against the source document and an abstention rule that reports a gap rather than producing a confident wrong number. That is a deliberate design decision, not a limitation to be worked around.",
  },
  {
    question: "Do you publish the source code?",
    answer:
      "For most projects, yes — each project page links to its public repository where one exists. Two exceptions are stated openly on their project pages: the Smart Kitchen Companion is published as a documented design with a demonstration recording because the application source is not public, and the FinBench Deterministic Library Suite ships as packages on PyPI rather than as a single application repository.",
  },
  {
    question: "Why is there no pricing on this site?",
    answer:
      "Because a price quoted before the problem is understood would be a guess, and he would rather not put a number on the page that he cannot stand behind. Scope, deliverable and timeline are agreed in writing before any work starts, and the cost follows from that scope.",
  },
  {
    question: "Is there anything you will not do?",
    answer:
      "Yes. He will not take on work he cannot do well, and he will say so directly rather than accept it. He also will not fabricate results — if a figure cannot be verified, it is reported as self-reported or left out entirely.",
  },
  {
    question: "How do I start a project?",
    answer:
      "Use the contact page. Describe the problem in plain language and what a good outcome looks like. You will get a straight answer on whether it is a fit, what he would need from you, and what the deliverable would be.",
  },
];

export const metadata: Metadata = pageMetadata({
  title: "FAQ",
  description:
    "Straight answers about Potheesh Vignesh K's availability, experience level, evidence labelling, RAG approach, local AI deployment, published source and how freelance projects start.",
  path: "/faq",
  keywords: [
    "freelance AI engineer FAQ",
    "hire AI engineer questions",
    "RAG approach",
    "local LLM deployment questions",
  ],
});

export default function FaqPage() {
  return (
    <>
      <StructuredData
        data={[
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "FAQ", path: "/faq" },
          ]),
          faqJsonLd(FAQS),
        ]}
      />

      <PageHero
        kicker="FAQ"
        title="Questions, answered plainly"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "FAQ", path: "/faq" },
        ]}
        intro="Including the uncomfortable ones. If an answer here says something unflattering, that is deliberate — you can verify the rest of the site against it."
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-px border border-border bg-[var(--rule)]">
          {FAQS.map((faq, index) => (
            <details
              key={faq.question}
              className="group bg-surface"
              open={index === 0}
            >
              <summary className="flex cursor-pointer list-none items-start gap-4 p-5 transition-colors hover:bg-surface-2 sm:p-6">
                <span className="mono-label tabular shrink-0 pt-1 text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="flex-1 text-[0.975rem] font-medium leading-snug tracking-[-0.01em]">
                  {faq.question}
                </h2>
                <span
                  aria-hidden
                  className="mt-1 grid size-5 shrink-0 place-items-center border border-border-strong text-muted transition-transform duration-200 group-open:rotate-45"
                >
                  <span className="relative block h-2 w-2">
                    <span className="absolute left-1/2 top-0 h-2 w-px -translate-x-1/2 bg-current" />
                    <span className="absolute left-0 top-1/2 h-px w-2 -translate-y-1/2 bg-current" />
                  </span>
                </span>
              </summary>
              <p className="px-5 pb-6 pl-[3.25rem] text-sm leading-relaxed text-muted sm:px-6 sm:pl-[3.75rem]">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>

        <div className="mt-10 panel-quiet flex flex-wrap items-center justify-between gap-5 p-6">
          <div className="max-w-lg">
            <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
              Still have a question?
            </h2>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Ask it directly. You will get a real answer, including &ldquo;that
              is not something I can do&rdquo; if that is the truth.
            </p>
          </div>
          <Action href="/contact" size="lg">
            Ask a question
          </Action>
        </div>
      </div>
    </>
  );
}
