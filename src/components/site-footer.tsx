import Link from "next/link";
import { Mail, MapPin, Phone } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "@/components/ui/brand-icons";
import { CONTACT, NAV, SECONDARY_NAV, SITE } from "@/data/site";
import { PROJECT_STATS } from "@/data/projects";

/** Internal cross-links so every project detail page is reachable from anywhere. */
const RELATED_INTERESTS = [
  { label: "Retrieval-augmented systems", href: "/services/rag-systems" },
  { label: "Agentic pipelines", href: "/services/agentic-pipelines" },
  { label: "Local & private AI", href: "/services/local-private-ai" },
  { label: "LLM evaluation", href: "/services/llm-evaluation" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-rule bg-[var(--background-deep)]">
      <div aria-hidden className="grain-overlay" />
      <div className="relative mx-auto w-full max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-display text-display-sm leading-tight tracking-[-0.02em]">
              {SITE.name}
            </p>
            <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted">
              {SITE.role}. {SITE.availability}.
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={`mailto:${CONTACT.email}`}
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                <Mail aria-hidden className="size-3.5" />
                Email
              </a>
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                <Phone aria-hidden className="size-3.5" />
                Call
              </a>
              <a
                href={CONTACT.github}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                <GithubIcon className="size-3.5" />
                GitHub
              </a>
              <a
                href={CONTACT.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 border border-border px-3 py-2 text-xs transition-colors hover:border-accent hover:text-accent"
              >
                <LinkedinIcon className="size-3.5" />
                LinkedIn
              </a>
            </div>
          </div>

          <nav aria-label="Footer — sections">
            <p className="mono-label mb-4">Sections</p>
            <ul className="grid gap-2.5 text-sm">
              {NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <nav aria-label="Footer — pages">
              <p className="mono-label mb-4">Pages</p>
              <ul className="grid gap-2.5 text-sm">
                {SECONDARY_NAV.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-muted transition-colors hover:text-accent"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>

            <p className="mono-label mb-3 mt-6">Work with me on</p>
            <ul className="grid gap-2 text-sm">
              {RELATED_INTERESTS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-muted transition-colors hover:text-accent"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-4 border-t border-rule pt-6 sm:flex-row sm:items-center sm:justify-between">
          <p className="flex items-center gap-2 text-xs text-muted-2">
            <MapPin aria-hidden className="size-3.5" />
            {SITE.location.display}
          </p>
          <p className="text-xs text-muted-2">
            © {year} {SITE.name}. Built with Next.js and Three.js.
          </p>
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-muted-2">
          Every project figure on this site is labelled as either verified
          first-hand or self-reported from its own documentation —{" "}
          {PROJECT_STATS.total} projects, {PROJECT_STATS.publishedPackages}{" "}
          published Python packages. Source is public on GitHub for every
          project except the one whose project page states otherwise.
        </p>
      </div>
    </footer>
  );
}
