import type { Metadata } from "next";
import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { PageHero } from "@/components/ui/page-hero";
import { Action } from "@/components/ui/action";
import { pageMetadata } from "@/lib/seo";
import { CONTACT } from "@/data/site";

/**
 * Post-submission confirmation.
 *
 * Reachable two ways, and it must never lie about which one:
 *  - the contact form redirects here with `?sent=1` only after the API
 *    confirmed a real delivery, so the confirmation is warranted
 *  - anyone landing here directly gets a neutral page instead, because
 *    asserting "your message was sent" to someone who sent nothing would be a
 *    fabricated success state
 *
 * That is why this route reads searchParams and is rendered on demand.
 */
export const metadata: Metadata = pageMetadata({
  title: "Message sent",
  description:
    "Confirmation that your message reached Potheesh Vignesh K, and what happens next.",
  path: "/thank-you",
  // A post-submission confirmation page has no search value.
  noIndex: true,
});

interface PageProps {
  searchParams: Promise<{ sent?: string }>;
}

export default async function ThankYouPage({ searchParams }: PageProps) {
  const { sent } = await searchParams;
  const confirmed = sent === "1";

  if (!confirmed) {
    return (
      <>
        <PageHero
          kicker="Nothing to confirm"
          title="No message has been sent yet"
          crumbs={[
            { name: "Home", path: "/" },
            { name: "Confirmation", path: "/thank-you" },
          ]}
          intro="This page confirms a contact form submission, and no submission has been received in this session. Nothing has been sent on your behalf."
        />

        <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
          <div className="panel flex items-start gap-4 p-6 sm:p-8">
            <AlertTriangle
              aria-hidden
              className="mt-0.5 size-5 shrink-0 text-signal"
            />
            <div>
              <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
                If you meant to send a message
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-muted">
                Open the contact form and send it from there. You will see this
                page again with a real confirmation once it has actually gone
                through.
              </p>
              <p className="mt-4 border-t border-rule pt-4 text-sm leading-relaxed text-muted">
                Or write directly to{" "}
                <a
                  href={`mailto:${CONTACT.email}`}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {CONTACT.email}
                </a>
                , or call{" "}
                <a
                  href={`tel:${CONTACT.phoneHref}`}
                  className="text-accent underline-offset-2 hover:underline"
                >
                  {CONTACT.phone}
                </a>
                .
              </p>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap gap-2.5">
            <Action href="/contact" size="lg">
              Open the contact form
            </Action>
            <Action href="/" variant="outline">
              Back to the home page
            </Action>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageHero
        kicker="Confirmation"
        title="Your message has been sent"
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Contact", path: "/contact" },
          { name: "Sent", path: "/thank-you" },
        ]}
        intro="It reached the inbox. Nothing is stored on this site."
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-12 sm:px-8 sm:py-16">
        <div className="panel flex items-start gap-4 p-6 sm:p-8">
          <CheckCircle2
            aria-hidden
            className="mt-0.5 size-5 shrink-0 text-positive"
          />
          <div>
            <h2 className="text-[0.9375rem] font-medium tracking-[-0.01em]">
              What happens next
            </h2>
            <ul className="mt-4 grid gap-3">
              {[
                "I read the message and reply to the address you gave.",
                "If the problem is outside what I can do well, I will say so directly rather than take the work.",
                "If it is a fit, the next step is a short conversation about scope, deliverable and timeline — agreed in writing before any work starts.",
              ].map((line) => (
                <li
                  key={line}
                  className="flex gap-3 text-sm leading-relaxed text-muted"
                >
                  <span
                    aria-hidden
                    className="mt-1.5 size-1.5 shrink-0 rotate-45 border border-accent"
                  />
                  <span>{line}</span>
                </li>
              ))}
            </ul>

            <p className="mt-6 border-t border-rule pt-5 text-sm leading-relaxed text-muted">
              Nothing arrived, or you would rather write directly? Email{" "}
              <a
                href={`mailto:${CONTACT.email}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                {CONTACT.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${CONTACT.phoneHref}`}
                className="text-accent underline-offset-2 hover:underline"
              >
                {CONTACT.phone}
              </a>
              .
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-2.5">
          <Action href="/projects" variant="outline">
            Browse the projects
          </Action>
          <Action href="/" variant="outline">
            Back to the home page
          </Action>
        </div>
      </div>
    </>
  );
}
