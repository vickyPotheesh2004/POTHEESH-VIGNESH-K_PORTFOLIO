import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { ContactBlock } from "@/components/blocks/contact-block";
import { EvidenceLegend } from "@/components/evidence-badge";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbJsonLd, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact",
  description:
    "Start a conversation with Potheesh Vignesh K — freelance AI engineering projects or AI/ML engineering roles. Email, phone, LinkedIn and GitHub, plus a contact form.",
  path: "/contact",
  keywords: [
    "contact AI engineer",
    "hire freelance AI developer",
    "AI engineer India",
  ],
});

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={breadcrumbJsonLd([
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ])}
      />

      <PageHero
        kicker="Contact"
        title="Start a conversation"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
        ]}
        intro="Freelance AI work or an AI/ML engineering role — both are welcome. Describe the problem in your own words and what a good outcome looks like. Every channel below is real and reaches me directly."
      />

      <div className="mx-auto w-full max-w-6xl px-5 py-12 sm:px-8 sm:py-16">
        <ContactBlock />
        <EvidenceLegend className="mt-16 border-t border-rule pt-8" />
      </div>
    </>
  );
}
