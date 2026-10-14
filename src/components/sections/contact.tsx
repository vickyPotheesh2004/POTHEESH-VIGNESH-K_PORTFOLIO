import { Section } from "@/components/ui/section";
import { ContactBlock } from "@/components/blocks/contact-block";
import { EvidenceLegend } from "@/components/evidence-badge";

export function ContactSection() {
  return (
    <Section
      id="contact"
      index={8}
      kicker="Contact"
      title="Let's talk about what you're building"
      intro={
        <>
          Freelance AI work, or an AI/ML engineering role — either is welcome.
          Tell me the problem in your own words and what a good outcome looks
          like. If it is not something I can do well, I would rather say so
          than take the work.
        </>
      }
    >
      <ContactBlock />
      <EvidenceLegend className="mt-14 border-t border-rule pt-8" />
    </Section>
  );
}
