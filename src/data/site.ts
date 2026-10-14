/**
 * Single source of truth for site-wide identity, contact details and navigation.
 *
 * Everything here is either supplied by Potheesh Vignesh K directly or read from
 * his own published repositories / résumé. Nothing is invented.
 */

/**
 * Canonical production origin. Overridable by env so there is exactly one place
 * to change if the Vercel domain check (`TASKS.md` S2.1a) resolves differently.
 */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://potheesh-vignesh-portfolio.vercel.app"
).replace(/\/$/, "");

export const SITE = {
  url: SITE_URL,
  name: "Potheesh Vignesh K",
  shortName: "Potheesh Vignesh",
  /** The positioning line used in <title>, OG tags and the hero. */
  role: "Aspiring AI/ML Engineer & Solo AI Researcher",
  /** Longer descriptor for the résumé-style summary. */
  discipline: "Generative AI Engineer · Agentic AI Developer · LLM Application Developer",
  availability: "Open to AI/ML engineering roles and freelance AI projects",
  location: {
    city: "SriKalahasti",
    region: "Andhra Pradesh",
    country: "India",
    display: "SriKalahasti, Andhra Pradesh, India",
  },
} as const;

export const CONTACT = {
  email: "kpotheeshvignesh@gmail.com",
  phone: "+91 9390699408",
  /** E.164, for the tel: link. */
  phoneHref: "+919390699408",
  linkedin: "https://www.linkedin.com/in/potheesh-vignesh-k-2017092a9/",
  github: "https://github.com/vickyPotheesh2004",
} as const;

export const RESUME = {
  /**
   * Download Résumé is only rendered when this file actually exists in
   * `public/resume/`. See `resumeAvailable` below — never ship a 404 button.
   */
  href: "/resume/potheesh-vignesh-k-resume.pdf",
  filename: "Potheesh-Vignesh-K-Resume.pdf",
} as const;

/**
 * Set to true once the real PDF is committed to `public/resume/`.
 * Flipped by hand on purpose: a build-time file check would break on some hosts.
 */
export const resumeAvailable = false;

export interface NavItem {
  label: string;
  href: string;
  /** Shown in the mobile menu as a one-line description. */
  hint?: string;
}

export const NAV: NavItem[] = [
  { label: "About", href: "/#about", hint: "Who I am and how I work" },
  { label: "Skills", href: "/#skills", hint: "Languages, frameworks, methods" },
  { label: "Experience", href: "/#experience", hint: "TCS and Infosys internships" },
  { label: "Projects", href: "/projects", hint: "Every build, with source" },
  { label: "Architecture", href: "/#architecture", hint: "How the systems fit together" },
  { label: "Research", href: "/research", hint: "IEEE publications and community work" },
  { label: "Services", href: "/services", hint: "Freelance AI engineering" },
  { label: "Contact", href: "/contact", hint: "Start a conversation" },
];

/** Pages that get their own entry in the footer and sitemap. */
export const SECONDARY_NAV: NavItem[] = [
  { label: "All projects", href: "/projects" },
  { label: "Freelance services", href: "/services" },
  { label: "Research", href: "/research" },
  { label: "FAQ", href: "/faq" },
  { label: "Contact", href: "/contact" },
  { label: "Privacy", href: "/privacy" },
];
