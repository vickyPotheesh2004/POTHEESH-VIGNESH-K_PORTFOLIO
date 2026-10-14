import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

/**
 * Contact form endpoint.
 *
 * Honesty rules this route enforces:
 *  - If no mail provider key is configured it returns 503 with
 *    `configured: false`. It never pretends to have sent anything.
 *  - If delivery fails it returns 502 and says so. No silent success.
 *
 * Spam defence is layered: a hidden honeypot field, a best-effort in-memory
 * rate limit, and Cloudflare Turnstile verification whenever the secret is
 * present. The rate limit is per serverless instance — Turnstile is the real
 * defence, which is why it is verified server-side rather than trusted from
 * the client.
 */

const LIMIT_WINDOW_MS = 10 * 60 * 1000;
const LIMIT_MAX = 5;

/** Per-instance sliding window. Resets when the isolate recycles. */
const attempts = new Map<string, number[]>();

function rateLimited(key: string): boolean {
  const now = Date.now();
  const recent = (attempts.get(key) ?? []).filter(
    (time) => now - time < LIMIT_WINDOW_MS,
  );
  recent.push(now);
  attempts.set(key, recent);

  // Opportunistic cleanup so the map cannot grow without bound.
  if (attempts.size > 500) {
    for (const [mapKey, times] of attempts) {
      if (times.every((time) => now - time >= LIMIT_WINDOW_MS)) {
        attempts.delete(mapKey);
      }
    }
  }

  return recent.length > LIMIT_MAX;
}

const payload = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email().max(160),
  organisation: z.string().trim().max(120).optional().default(""),
  service: z.string().trim().max(120).optional().default(""),
  timeline: z.string().trim().max(80).optional().default(""),
  message: z.string().trim().min(20).max(4000),
  /**
   * Honeypot. Real visitors never see it; naive bots fill it in.
   * The name is deliberately not a plausible autofill target.
   */
  hp_field_2: z.string().max(0).optional().default(""),
  turnstileToken: z.string().max(4096).optional().default(""),
});

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function verifyTurnstile(
  token: string,
  secret: string,
  remoteIp: string | null,
): Promise<boolean> {
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret, response: token });
    if (remoteIp) body.set("remoteip", remoteIp);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      { method: "POST", body },
    );
    const result = (await response.json()) as { success?: boolean };
    return result.success === true;
  } catch {
    // Fail closed: if the check cannot be performed, do not accept the message.
    return false;
  }
}

export async function POST(request: Request) {
  const ip =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ??
    request.headers.get("x-real-ip") ??
    "unknown";

  if (rateLimited(ip)) {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error:
          "Too many messages from this connection. Please wait a few minutes, or email directly.",
      },
      { status: 429 },
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return NextResponse.json(
      { ok: false, configured: true, error: "Malformed request body." },
      { status: 400 },
    );
  }

  const parsed = payload.safeParse(raw);
  if (!parsed.success) {
    const first = parsed.error.issues[0];
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error: first
          ? `Please check the ${String(first.path[0] ?? "form")} field: ${first.message}`
          : "Please check the form and try again.",
      },
      { status: 422 },
    );
  }

  const data = parsed.data;

  // Silently drop honeypot hits. A human never fills this field.
  if (data.hp_field_2.length > 0) {
    return NextResponse.json({ ok: true, delivered: false });
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  if (turnstileSecret) {
    const passed = await verifyTurnstile(data.turnstileToken, turnstileSecret, ip);
    if (!passed) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error:
            "The spam-protection check did not pass. Please reload the page and try again.",
        },
        { status: 400 },
      );
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // The honest state: the form works, delivery is simply not switched on yet.
    return NextResponse.json(
      {
        ok: false,
        configured: false,
        error:
          "Message delivery is not configured on this deployment yet. Nothing was sent.",
      },
      { status: 503 },
    );
  }

  const to = process.env.CONTACT_TO_EMAIL ?? "kpotheeshvignesh@gmail.com";
  const from =
    process.env.CONTACT_FROM_EMAIL ?? "Portfolio Contact <onboarding@resend.dev>";

  const lines = [
    `Name: ${data.name}`,
    `Email: ${data.email}`,
    data.organisation ? `Organisation: ${data.organisation}` : null,
    data.service ? `Service: ${data.service}` : null,
    data.timeline ? `Timeline: ${data.timeline}` : null,
    "",
    data.message,
  ].filter(Boolean) as string[];

  try {
    const { Resend } = await import("resend");
    const resend = new Resend(apiKey);

    const { error } = await resend.emails.send({
      from,
      to: [to],
      replyTo: data.email,
      subject: `Portfolio enquiry — ${data.name}`,
      text: lines.join("\n"),
      html: `<div style="font-family:ui-sans-serif,system-ui,sans-serif;line-height:1.6;color:#12161c">
  <h2 style="margin:0 0 12px;font-size:18px">Portfolio enquiry</h2>
  <p style="margin:0 0 4px"><strong>Name:</strong> ${escapeHtml(data.name)}</p>
  <p style="margin:0 0 4px"><strong>Email:</strong> ${escapeHtml(data.email)}</p>
  ${data.organisation ? `<p style="margin:0 0 4px"><strong>Organisation:</strong> ${escapeHtml(data.organisation)}</p>` : ""}
  ${data.service ? `<p style="margin:0 0 4px"><strong>Service:</strong> ${escapeHtml(data.service)}</p>` : ""}
  ${data.timeline ? `<p style="margin:0 0 4px"><strong>Timeline:</strong> ${escapeHtml(data.timeline)}</p>` : ""}
  <hr style="border:none;border-top:1px solid #ded7c6;margin:16px 0" />
  <p style="white-space:pre-wrap;margin:0">${escapeHtml(data.message)}</p>
</div>`,
    });

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          configured: true,
          error:
            "The message could not be delivered. Please email directly instead.",
        },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json(
      {
        ok: false,
        configured: true,
        error:
          "The message could not be delivered. Please email directly instead.",
      },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true, delivered: true });
}

export async function GET() {
  return NextResponse.json(
    { ok: false, error: "Use POST to submit the contact form." },
    { status: 405, headers: { Allow: "POST" } },
  );
}
