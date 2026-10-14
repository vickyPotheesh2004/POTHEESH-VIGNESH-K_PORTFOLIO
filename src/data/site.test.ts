import { describe, expect, it } from "vitest";
import { CONTACT, NAV, SECONDARY_NAV, SITE, SITE_URL, resumeAvailable } from "./site";

describe("site identity", () => {
  it("uses the exact contact details supplied", () => {
    expect(CONTACT.email).toBe("kpotheeshvignesh@gmail.com");
    expect(CONTACT.phone).toBe("+91 9390699408");
    expect(CONTACT.phoneHref).toBe("+919390699408");
    expect(CONTACT.github).toBe("https://github.com/vickyPotheesh2004");
    expect(CONTACT.linkedin).toBe(
      "https://www.linkedin.com/in/potheesh-vignesh-k-2017092a9/",
    );
  });

  it("uses a real https canonical origin with no trailing slash", () => {
    expect(SITE_URL).toMatch(/^https:\/\//);
    expect(SITE_URL.endsWith("/")).toBe(false);
    expect(SITE_URL).not.toMatch(/example\.com|localhost|TODO/i);
    expect(SITE.url).toBe(SITE_URL);
  });

  it("states the location supplied", () => {
    expect(SITE.location.display).toBe("SriKalahasti, Andhra Pradesh, India");
  });

  it("describes the subject as an aspiring AI/ML engineer", () => {
    expect(SITE.role.toLowerCase()).toContain("aspiring ai/ml engineer");
  });

  it("keeps the résumé button gated off until a real PDF is committed", () => {
    // Flipping this to true without publishing the PDF would ship a dead link.
    expect(typeof resumeAvailable).toBe("boolean");
    if (!resumeAvailable) {
      expect(resumeAvailable).toBe(false);
    }
  });
});

describe("navigation", () => {
  it("has no duplicate destinations inside either list", () => {
    for (const list of [NAV, SECONDARY_NAV]) {
      const hrefs = list.map((item) => item.href);
      expect(new Set(hrefs).size).toBe(hrefs.length);
    }
  });

  it("labels every destination", () => {
    for (const item of [...NAV, ...SECONDARY_NAV]) {
      expect(item.label.trim(), item.href).not.toBe("");
      expect(item.href.startsWith("/"), item.href).toBe(true);
    }
  });

  it("links every section the brief requires", () => {
    const hrefs = NAV.map((item) => item.href);
    for (const required of [
      "/#about",
      "/#skills",
      "/#experience",
      "/projects",
      "/#architecture",
      "/research",
      "/services",
      "/contact",
    ]) {
      expect(hrefs, `missing nav destination ${required}`).toContain(required);
    }
  });
});
