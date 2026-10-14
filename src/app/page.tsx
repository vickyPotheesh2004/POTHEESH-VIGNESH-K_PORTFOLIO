import type { Metadata } from "next";
import { Hero } from "@/components/hero";
import { AboutSection } from "@/components/sections/about";
import { SkillsSection } from "@/components/sections/skills";
import { ExperienceSection } from "@/components/sections/experience";
import { ProjectsSection } from "@/components/sections/projects";
import { ArchitectureSection } from "@/components/sections/architecture";
import { ResearchSection } from "@/components/sections/research";
import { ServicesSection } from "@/components/sections/services";
import { ContactSection } from "@/components/sections/contact";
import { StructuredData } from "@/components/structured-data";
import { pageMetadata, personJsonLd } from "@/lib/seo";
import { SITE } from "@/data/site";

export const metadata: Metadata = pageMetadata({
  title: `${SITE.name} — Aspiring AI/ML Engineer & Solo AI Researcher`,
  description:
    "Potheesh Vignesh K — aspiring AI/ML engineer building local-first retrieval, multi-agent and verification systems where every answer traces back to its source. Open to AI/ML roles and freelance AI projects.",
  path: "/",
  keywords: [
    "AI/ML engineer",
    "freelance AI engineer",
    "retrieval-augmented generation",
    "agentic AI",
    "LLM evaluation",
    "local LLM inference",
    "Python AI developer",
    "Potheesh Vignesh K",
  ],
});

export default function HomePage() {
  return (
    <>
      <StructuredData data={personJsonLd()} />
      <Hero />
      <AboutSection />
      <SkillsSection />
      <ExperienceSection />
      <ProjectsSection />
      <ArchitectureSection />
      <ResearchSection />
      <ServicesSection />
      <ContactSection />
    </>
  );
}
