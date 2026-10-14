"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import { AlertTriangle, CheckCircle2, Loader2, Send } from "lucide-react";
import { CONTACT } from "@/data/site";

interface ContactFormProps {
  /**
   * Freelance service titles, computed by the server component that renders
   * this form so the whole profile dataset never enters the client bundle.
   */
  services: string[];
}

const TIMELINES = [
  "Just exploring",
  "Within the next month",
  "In one to three months",
  "Flexible",
];

type Status =
  | { kind: "idle" }
  | { kind: "sending" }
  | { kind: "error"; message: string }
  | { kind: "unconfigured"; message: string };

const fieldClass =
  "w-full border border-border bg-surface-2 px-3.5 py-2.5 text-sm text-foreground placeholder:text-muted-2 transition-colors focus:border-accent focus:outline-none";

/**
 * Contact form.
 *
 * Three honest outcomes, all surfaced to the visitor:
 *   1. delivered        → redirected to the thank-you page
 *   2. not configured   → direct-email fallback, and it says nothing was sent
 *   3. delivery failed  → the same fallback, with the real reason
 *
 * There is no optimistic success state anywhere in this component.
 */
export function ContactForm({ services }: ContactFormProps) {
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  const busy = status.kind === "sending";

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);

    const turnstileToken =
      form.querySelector<HTMLInputElement>('input[name="cf-turnstile-response"]')
        ?.value ?? "";

    setStatus({ kind: "sending" });

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(formData.get("name") ?? ""),
          email: String(formData.get("email") ?? ""),
          organisation: String(formData.get("organisation") ?? ""),
          service: String(formData.get("service") ?? ""),
          timeline: String(formData.get("timeline") ?? ""),
          message: String(formData.get("message") ?? ""),
          hp_field_2: String(formData.get("hp_field_2") ?? ""),
          turnstileToken,
        }),
      });

      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        configured?: boolean;
        error?: string;
      };

      if (response.ok && result.ok) {
        form.reset();
        /**
         * `?sent=1` is set here and only here, after the API has confirmed a
         * real delivery. The confirmation page refuses to assert success
         * without it.
         */
        router.push("/thank-you?sent=1");
        return;
      }

      if (result.configured === false) {
        setStatus({
          kind: "unconfigured",
          message:
            result.error ??
            "Message delivery is not configured on this deployment yet. Nothing was sent.",
        });
        return;
      }

      setStatus({
        kind: "error",
        message:
          result.error ??
          "Something went wrong sending the message. Please email directly.",
      });
    } catch {
      setStatus({
        kind: "error",
        message:
          "The message could not reach the server. Check your connection, or email directly.",
      });
    }
  }

  return (
    <form ref={formRef} onSubmit={onSubmit} noValidate className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="mono-label">Name *</span>
          <input
            name="name"
            type="text"
            required
            minLength={2}
            maxLength={80}
            autoComplete="name"
            placeholder="Your name"
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label">Email *</span>
          <input
            name="email"
            type="email"
            required
            maxLength={160}
            autoComplete="email"
            placeholder="you@company.com"
            className={fieldClass}
          />
        </label>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="mono-label">Organisation</span>
          <input
            name="organisation"
            type="text"
            maxLength={120}
            autoComplete="organization"
            placeholder="Optional"
            className={fieldClass}
          />
        </label>

        <label className="grid gap-1.5">
          <span className="mono-label">Timeline</span>
          <select name="timeline" defaultValue="" className={fieldClass}>
            <option value="">Not specified</option>
            {TIMELINES.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="grid gap-1.5">
        <span className="mono-label">What do you need?</span>
        <select name="service" defaultValue="" className={fieldClass}>
          <option value="">Not sure yet</option>
          {services.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
          <option value="Something else">Something else</option>
        </select>
      </label>

      <label className="grid gap-1.5">
        <span className="mono-label">Message *</span>
        <textarea
          name="message"
          required
          minLength={20}
          maxLength={4000}
          rows={6}
          placeholder="What are you trying to build, and what does a good outcome look like?"
          className={`${fieldClass} resize-y`}
        />
      </label>

      {/* Honeypot: hidden from people, tempting to bots. */}
      <div aria-hidden className="absolute h-0 w-0 overflow-hidden opacity-0">
        <label>
          Do not fill this in
          <input
            name="hp_field_2"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </label>
      </div>

      {siteKey && (
        <>
          <Script
            src="https://challenges.cloudflare.com/turnstile/v0/api.js"
            strategy="afterInteractive"
          />
          <div className="cf-turnstile" data-sitekey={siteKey} data-theme="auto" />
        </>
      )}

      <div className="flex flex-wrap items-center gap-4 pt-1">
        <button
          type="submit"
          disabled={busy}
          className="inline-flex items-center gap-2 border border-transparent bg-accent px-5 py-2.5 text-sm font-medium text-[color:var(--background)] transition-colors hover:bg-accent-strong disabled:cursor-not-allowed disabled:opacity-60"
        >
          {busy ? (
            <Loader2 aria-hidden className="size-4 animate-spin" />
          ) : (
            <Send aria-hidden className="size-4" />
          )}
          {busy ? "Sending" : "Send message"}
        </button>

        <p className="max-w-xs text-xs leading-relaxed text-muted-2">
          Sent through Resend and not stored on this site. See the{" "}
          <a href="/privacy" className="text-accent underline-offset-2 hover:underline">
            privacy policy
          </a>
          .
        </p>
      </div>

      {status.kind === "error" && (
        <p
          role="alert"
          className="flex items-start gap-2.5 border border-danger/45 bg-danger/10 px-3.5 py-3 text-sm text-danger"
        >
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {status.message}{" "}
            <a
              href={`mailto:${CONTACT.email}?subject=Portfolio%20enquiry`}
              className="underline underline-offset-2"
            >
              Email {CONTACT.email}
            </a>
          </span>
        </p>
      )}

      {status.kind === "unconfigured" && (
        <div
          role="status"
          className="flex items-start gap-2.5 border border-signal/45 bg-signal-soft px-3.5 py-3 text-sm text-signal"
        >
          <AlertTriangle aria-hidden className="mt-0.5 size-4 shrink-0" />
          <span>
            {status.message} Please send it straight to{" "}
            <a
              href={`mailto:${CONTACT.email}?subject=Portfolio%20enquiry`}
              className="font-medium underline underline-offset-2"
            >
              {CONTACT.email}
            </a>{" "}
            or call {CONTACT.phone}.
          </span>
        </div>
      )}

      {status.kind === "idle" && (
        <p className="flex items-center gap-2 text-xs text-muted-2">
          <CheckCircle2 aria-hidden className="size-3.5 text-positive" />
          Fields marked * are required. You will get a copy of nothing — no
          newsletter, no marketing list.
        </p>
      )}
    </form>
  );
}
