import { describe, expect, it } from "vitest";
import { SERVICES } from "./profile";

describe("freelance services", () => {
  it("exposes the seven service areas the brief requires", () => {
    expect(SERVICES).toHaveLength(7);
  });

  it("uses unique slugs", () => {
    const slugs = SERVICES.map((service) => service.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it("uses url-safe slugs", () => {
    for (const service of SERVICES) {
      expect(service.slug, service.title).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/);
    }
  });

  it("gives every service deliverables, requirements and proof", () => {
    for (const service of SERVICES) {
      expect(service.title.trim(), service.slug).not.toBe("");
      expect(service.summary.trim(), service.slug).not.toBe("");
      expect(service.deliverables.length, `${service.slug} deliverables`).toBeGreaterThan(0);
      expect(service.needs.length, `${service.slug} needs`).toBeGreaterThan(0);
      expect(service.evidence.trim(), `${service.slug} evidence`).not.toBe("");
    }
  });

  it("backs every service with a named system rather than a vague claim", () => {
    for (const service of SERVICES) {
      // The proof line must name something concrete.
      expect(
        service.evidence.length,
        `${service.slug} evidence is too short to name a system`,
      ).toBeGreaterThan(30);
    }
  });
});
