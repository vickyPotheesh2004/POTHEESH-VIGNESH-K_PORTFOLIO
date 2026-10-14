import type { Metadata } from "next";
import { SITE } from "@/data/site";

/** Absolute URL for a site-relative path. Used for canonical + OG tags. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//.test(path)) return path;
  return `${SITE.url}${path.startsWith("/") ? path : `/${path}`}`;
}

interface PageMetaInput {
  title: string;
  description: string;
  /** Site-relative path, e.g. "/projects/finbench". */
  path: string;
  /** Set true on pages that must never be indexed. */
  noIndex?: boolean;
  keywords?: string[];
}

/**
 * Per-page metadata. Every page gets a unique title and description — no
 * duplicated metadata across the site, and no placeholder domain anywhere.
 */
export function pageMetadata({
  title,
  description,
  path,
  noIndex = false,
  keywords,
}: PageMetaInput): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = path === "/" ? title : `${title} | ${SITE.name}`;

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: url,
    },
    openGraph: {
      type: "website",
      url,
      title: fullTitle,
      description,
      siteName: SITE.name,
      locale: "en_IN",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
    } as const,
    ...(noIndex
      ? { robots: { index: false, follow: false } }
      : { robots: { index: true, follow: true } }),
  };
}

/** Person + profile JSON-LD. Emitted once, on the home page. */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: SITE.name,
    jobTitle: SITE.role,
    description: SITE.discipline,
    url: SITE.url,
    email: "mailto:kpotheeshvignesh@gmail.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: SITE.location.city,
      addressRegion: SITE.location.region,
      addressCountry: "IN",
    },
    sameAs: [
      "https://github.com/vickyPotheesh2004",
      "https://www.linkedin.com/in/potheesh-vignesh-k-2017092a9/",
    ],
    knowsAbout: [
      "Retrieval-augmented generation",
      "Agentic AI",
      "Large language model evaluation",
      "Multi-agent systems",
      "Natural language processing",
      "Local LLM inference",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: "R.M.K. Engineering College",
    },
  };
}

interface SoftwareSourceInput {
  name: string;
  description: string;
  url: string;
  codeRepository?: string;
  programmingLanguage?: string[];
}

export function softwareSourceJsonLd({
  name,
  description,
  url,
  codeRepository,
  programmingLanguage,
}: SoftwareSourceInput) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareSourceCode",
    name,
    description,
    url,
    ...(codeRepository ? { codeRepository } : {}),
    ...(programmingLanguage ? { programmingLanguage } : {}),
    author: {
      "@type": "Person",
      name: SITE.name,
      url: SITE.url,
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}
