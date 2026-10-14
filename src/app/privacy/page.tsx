import type { Metadata } from "next";
import { PageHero } from "@/components/ui/page-hero";
import { CONTACT, SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "What this site collects, what it does not, and how the contact form handles your message. No tracking cookies, no analytics profiles, no data resale.",
  path: "/privacy",
});

const SECTIONS = [
  {
    title: "Who runs this site",
    body: [
      `This is the personal portfolio of ${SITE.name}, based in ${SITE.location.display}. It exists to describe his work and to let people get in touch about AI engineering projects and roles.`,
    ],
  },
  {
    title: "What the contact form sends",
    body: [
      "If you submit the contact form, the name, email address, organisation, selected service, timeline and message you provide are sent to a transactional email provider and delivered to the site owner's inbox so he can reply.",
      "That message is not stored in a database on this site. It exists in the email provider's delivery records and in the recipient's mailbox — the same way any email does.",
      "The form is protected against automated spam by a hidden field and by Cloudflare Turnstile where it is enabled. Turnstile may set a short-lived cookie and process technical signals such as your IP address to determine whether you are a human. It is not used for advertising or profiling.",
    ],
  },
  {
    title: "What is collected automatically",
    body: [
      "The site is served by a hosting provider that, like nearly all web hosts, records standard technical request logs — IP address, user agent, timestamp and requested path — for security and operational purposes.",
      "If Google Analytics is enabled on this deployment, it collects aggregate usage data such as pages viewed, approximate region and device type. It is configured without advertising features. When no analytics ID is configured, no analytics script is loaded at all.",
      "This site does not use advertising cookies, does not build a profile of you, and does not sell or share data with anyone for marketing.",
    ],
  },
  {
    title: "Your theme preference",
    body: [
      "The light or dark theme you choose is stored in your browser's local storage under a single key. It never leaves your device and is used for nothing except rendering the site in the theme you picked.",
    ],
  },
  {
    title: "Who your data is shared with",
    body: [
      "Only the service providers needed to run these functions: the hosting platform that serves the site, the transactional email provider that delivers contact form messages, and Cloudflare where the spam check is active. None of them receive your data for their own marketing purposes.",
    ],
  },
  {
    title: "How long it is kept",
    body: [
      "Contact form messages are kept in the recipient's mailbox for as long as needed to handle the enquiry and any resulting work. Technical request logs are retained according to the hosting provider's own default retention period.",
    ],
  },
  {
    title: "Your rights",
    body: [
      "You can ask what personal data from your enquiry is held, ask for it to be corrected, or ask for it to be deleted. Write to the address below and it will be actioned.",
    ],
  },
  {
    title: "Links to other sites",
    body: [
      "This site links to GitHub, LinkedIn, Vercel-hosted project demos and PyPI. Those sites have their own privacy policies, and what they collect is outside the control of this site.",
    ],
  },
  {
    title: "Changes to this policy",
    body: [
      "If what the site collects changes — for example if analytics or a new provider is added — this page is updated to match, rather than left describing an older version.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Privacy"
        title="Privacy policy"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Privacy", path: "/privacy" },
        ]}
        intro="Short version: this site collects as little as possible, uses no advertising or profiling cookies, and never sells your data. The detail is below."
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <ol className="grid gap-10">
          {SECTIONS.map((section, index) => (
            <li key={section.title} className="border-t border-rule pt-8 first:border-0 first:pt-0">
              <div className="flex items-baseline gap-3">
                <span className="mono-label tabular text-accent">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <h2 className="font-display text-display-sm leading-tight tracking-[-0.015em]">
                  {section.title}
                </h2>
              </div>
              <div className="mt-4 grid gap-3">
                {section.body.map((paragraph) => (
                  <p
                    key={paragraph.slice(0, 32)}
                    className="text-[0.975rem] leading-[1.75] text-foreground-soft"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 border border-border bg-surface-2 p-6">
          <p className="mono-label">Contact for privacy requests</p>
          <p className="mt-3 text-sm leading-relaxed text-foreground-soft">
            <a
              href={`mailto:${CONTACT.email}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              {CONTACT.email}
            </a>
            <br />
            <a
              href={`tel:${CONTACT.phoneHref}`}
              className="text-accent underline-offset-2 hover:underline"
            >
              {CONTACT.phone}
            </a>
          </p>
          <p className="mt-3 text-xs leading-relaxed text-muted-2">
            {SITE.name} · {SITE.location.display}
          </p>
        </div>
      </div>
    </>
  );
}
