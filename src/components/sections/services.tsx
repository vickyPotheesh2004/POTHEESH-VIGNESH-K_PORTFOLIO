import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { Section } from "@/components/ui/section";
import { Action } from "@/components/ui/action";
import { Reveal } from "@/components/reveal";
import { SERVICES } from "@/data/profile";
import { pad } from "@/lib/utils";

export function ServicesSection() {
  return (
    <Section
      id="services"
      index={7}
      kicker="Freelance"
      title="Freelance AI engineering"
      intro={
        <>
          I take on a small number of AI projects alongside my final year of
          study. Every service below is backed by something I have already
          built and published — the proof line under each one names the actual
          system, not a hypothetical capability.
        </>
      }
    >
      <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {SERVICES.map((service, index) => (
          <li key={service.slug}>
            <Reveal delay={index * 40} className="h-full">
              <article className="panel hover-lift flex h-full flex-col p-5 sm:p-6">
                <span className="mono-label tabular text-accent">
                  {pad(index + 1)}
                </span>

                <h3 className="mt-4 font-display text-display-sm leading-tight tracking-[-0.015em]">
                  <Link
                    href={`/services/${service.slug}`}
                    className="transition-colors hover:text-accent"
                  >
                    {service.title}
                  </Link>
                </h3>

                <p className="mt-3 text-sm leading-relaxed text-muted">
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

                <Link
                  href={`/services/${service.slug}`}
                  className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-medium text-accent transition-colors hover:text-accent-strong"
                >
                  What this includes
                  <ArrowRight aria-hidden className="size-3.5" />
                </Link>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>

      <Reveal className="mt-10">
        <div className="panel-quiet flex flex-wrap items-center justify-between gap-5 p-6">
          <div className="max-w-xl">
            <h3 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
              Not sure which of these you need?
            </h3>
            <p className="mt-1.5 text-sm leading-relaxed text-muted">
              Describe the problem in plain language. If it is not something I
              can do well, I will say so rather than take the work.
            </p>
          </div>
          <div className="flex flex-wrap gap-2.5">
            <Action href="/contact">Discuss an AI project</Action>
            <Action href="/services" variant="outline">
              All services
            </Action>
          </div>
        </div>
      </Reveal>
    </Section>
  );
}
