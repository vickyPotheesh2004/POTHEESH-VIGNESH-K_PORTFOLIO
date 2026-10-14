import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/reveal";
import { Action } from "@/components/ui/action";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/data/profile";
import { pad } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Freelance AI Services",
  description:
    "Freelance AI engineering by Potheesh Vignesh K — retrieval-augmented systems, agentic pipelines, local and private AI deployment, LLM evaluation harnesses, speech intelligence, AI web apps and Python packaging. Every service is backed by a published build.",
  path: "/services",
  keywords: [
    "freelance AI engineer",
    "hire AI developer",
    "RAG consultant",
    "LLM evaluation consultant",
    "local LLM deployment",
    "agentic AI development",
  ],
});

export default function ServicesPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ])}
      />

      <PageHero
        kicker="Freelance"
        title="Freelance AI engineering, backed by published work"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        intro="Seven ways I can help. Each one names the system I have already built and shipped, so you can judge the capability by opening the code rather than by reading a claim."
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Action href="/contact" size="lg">
            Discuss an AI project
          </Action>
          <Action href="/projects" size="lg" variant="outline">
            See the work
          </Action>
        </div>
      </PageHero>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <ol className="grid gap-5">
          {SERVICES.map((service, index) => (
            <li key={service.slug}>
              <Reveal delay={index * 40}>
                <article className="panel hover-lift grid gap-6 p-6 sm:p-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
                  <div>
                    <span className="mono-label tabular text-accent">
                      {pad(index + 1)}
                    </span>
                    <h2 className="mt-4 font-display text-display-sm leading-tight tracking-[-0.015em]">
                      <Link
                        href={`/services/${service.slug}`}
                        className="transition-colors hover:text-accent"
                      >
                        {service.title}
                      </Link>
                    </h2>
                    <p className="mt-4 max-w-2xl text-[0.975rem] leading-relaxed text-muted">
                      {service.summary}
                    </p>

                    <div className="mt-5 flex items-start gap-2.5 border-t border-rule pt-4">
                      <ShieldCheck
                        aria-hidden
                        className="mt-0.5 size-3.5 shrink-0 text-positive"
                      />
                      <p className="text-xs leading-relaxed text-muted-2">
                        <span className="mono-label mr-1.5 text-positive">
                          Proof
                        </span>
                        {service.evidence}
                      </p>
                    </div>
                  </div>

                  <div className="lg:border-l lg:border-rule lg:pl-8">
                    <p className="mono-label">You get</p>
                    <ul className="mt-4 grid gap-2.5">
                      {service.deliverables.map((deliverable) => (
                        <li
                          key={deliverable}
                          className="flex gap-3 text-sm leading-relaxed text-muted"
                        >
                          <span
                            aria-hidden
                            className="mt-1.5 size-1.5 shrink-0 rotate-45 border border-accent"
                          />
                          <span>{deliverable}</span>
                        </li>
                      ))}
                    </ul>

                    <Link
                      href={`/services/${service.slug}`}
                      className="mt-5 inline-flex items-center gap-1.5 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                    >
                      Full scope and requirements
                      <ArrowRight aria-hidden className="size-3.5" />
                    </Link>
                  </div>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-14">
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
            <div className="max-w-xl">
              <h2 className="font-display text-display-sm tracking-[-0.015em]">
                How a project starts
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Describe the problem in plain language. I will tell you whether
                it is something I can do well, what I would need from you, and
                what the deliverable would be — before any work begins. If it is
                outside what I can do properly, I will say so rather than take
                the work.
              </p>
            </div>
            <div className="flex flex-wrap gap-2.5">
              <Action href="/contact" size="lg">
                Discuss an AI project
              </Action>
              <Action href="/faq" size="lg" variant="outline">
                Read the FAQ
              </Action>
            </div>
          </div>
        </Reveal>
      </div>
    </>
  );
}
