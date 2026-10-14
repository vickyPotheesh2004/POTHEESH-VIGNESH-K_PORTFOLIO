import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Check, ShieldCheck } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Reveal } from "@/components/reveal";
import { Action } from "@/components/ui/action";
import { SubHeading } from "@/components/ui/section";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";
import { SERVICES } from "@/data/profile";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return SERVICES.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);

  if (!service) {
    return pageMetadata({
      title: "Service not found",
      description: "This service could not be found.",
      path: `/services/${slug}`,
      noIndex: true,
    });
  }

  return pageMetadata({
    title: service.title,
    description: service.summary,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps) {
  const { slug } = await params;
  const service = SERVICES.find((entry) => entry.slug === slug);
  if (!service) notFound();

  const others = SERVICES.filter((entry) => entry.slug !== service.slug);

  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ])}
      />

      <PageHero
        kicker="Freelance service"
        title={service.title}
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name: service.title, path: `/services/${service.slug}` },
        ]}
        intro={service.summary}
      >
        <div className="mt-8 flex flex-wrap gap-2.5">
          <Action href="/contact" size="lg">
            Discuss an AI project
          </Action>
          <Action href="/projects" size="lg" variant="outline">
            See related work
          </Action>
        </div>
      </PageHero>

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-16">
          <div className="grid gap-10">
            <section>
              <SubHeading hint={`${service.deliverables.length} items`}>
                What you get
              </SubHeading>
              <ul className="mt-5 grid gap-3">
                {service.deliverables.map((deliverable) => (
                  <li key={deliverable} className="flex gap-3.5">
                    <Check
                      aria-hidden
                      className="mt-0.5 size-4 shrink-0 text-positive"
                    />
                    <span className="text-[0.975rem] leading-relaxed text-foreground-soft">
                      {deliverable}
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-rule pt-8">
              <SubHeading hint="What this needs from you">
                Requirements
              </SubHeading>
              <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
                These are the honest prerequisites. Without them the work either
                cannot be done well or cannot be verified — and a system that
                cannot be verified is not worth building.
              </p>
              <ul className="mt-5 grid gap-px border border-border bg-[var(--rule)]">
                {service.needs.map((need) => (
                  <li
                    key={need}
                    className="bg-surface p-4 text-sm leading-relaxed text-muted"
                  >
                    {need}
                  </li>
                ))}
              </ul>
            </section>

            <section className="border-t border-rule pt-8">
              <SubHeading>How this is scoped</SubHeading>
              <ol className="mt-5 grid gap-5">
                {[
                  "You describe the problem and what a good outcome looks like.",
                  "I confirm whether it is something I can do well, and say so directly if it is not.",
                  "Scope, deliverable and timeline are agreed in writing before any work starts.",
                  "Work proceeds in reviewable increments — you see the system as it is built, not only at the end.",
                  "You receive the source and a written account of what was verified and what remains uncertain.",
                ].map((step, index) => (
                  <li key={step} className="flex gap-4">
                    <span className="mono-label tabular shrink-0 pt-0.5 text-accent">
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span className="text-sm leading-relaxed text-muted">
                      {step}
                    </span>
                  </li>
                ))}
              </ol>
            </section>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="panel p-5">
              <div className="flex items-start gap-2.5">
                <ShieldCheck
                  aria-hidden
                  className="mt-0.5 size-4 shrink-0 text-positive"
                />
                <SubHeading>Proof from my own work</SubHeading>
              </div>
              <p className="mt-4 text-sm leading-relaxed text-muted">
                {service.evidence}
              </p>
              <div className="mt-5 border-t border-rule pt-4">
                <Action href="/projects" size="sm" variant="outline">
                  Open the projects
                  <ArrowRight aria-hidden className="size-3.5" />
                </Action>
              </div>
            </div>

            <div className="panel mt-6 p-5">
              <SubHeading>Other services</SubHeading>
              <ul className="mt-4 grid gap-0">
                {others.map((entry) => (
                  <li key={entry.slug} className="border-b border-rule last:border-0">
                    <Link
                      href={`/services/${entry.slug}`}
                      className="flex items-baseline justify-between gap-3 py-3 text-sm transition-colors hover:text-accent"
                    >
                      <span>{entry.title}</span>
                      <ArrowRight
                        aria-hidden
                        className="size-3.5 shrink-0 text-muted-2"
                      />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>

        <Reveal className="mt-14">
          <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6 sm:p-8">
            <div className="max-w-xl">
              <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                Ready to talk through it?
              </h2>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">
                Send the problem in your own words. You will get a straight
                answer on whether I am the right person for it.
              </p>
            </div>
            <Action href="/contact" size="lg">
              Discuss an AI project
            </Action>
          </div>
        </Reveal>
      </div>
    </>
  );
}
