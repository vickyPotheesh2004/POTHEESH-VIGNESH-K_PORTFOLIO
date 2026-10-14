import { describe, expect, it } from "vitest";
import {
  absoluteUrl,
  breadcrumbJsonLd,
  faqJsonLd,
  pageMetadata,
  personJsonLd,
  softwareSourceJsonLd,
} from "./seo";
import { SITE } from "@/data/site";

describe("absoluteUrl", () => {
  it("prefixes site-relative paths", () => {
    expect(absoluteUrl("/projects")).toBe(`${SITE.url}/projects`);
    expect(absoluteUrl("projects")).toBe(`${SITE.url}/projects`);
  });

  it("leaves absolute URLs untouched", () => {
    expect(absoluteUrl("https://example.org/x")).toBe("https://example.org/x");
  });

  it("produces the bare origin for the root path", () => {
    expect(absoluteUrl("/")).toBe(`${SITE.url}/`);
  });
});

describe("pageMetadata", () => {
  it("gives the home page an unwrapped title and others a suffixed one", () => {
    const home = pageMetadata({ title: "Home", description: "d", path: "/" });
    expect(home.title).toBe("Home");

    const inner = pageMetadata({
      title: "Projects",
      description: "d",
      path: "/projects",
    });
    expect(inner.title).toBe(`Projects | ${SITE.name}`);
  });

  it("emits a canonical URL built from the configured origin", () => {
    const meta = pageMetadata({ title: "t", description: "d", path: "/faq" });
    expect(meta.alternates?.canonical).toBe(`${SITE.url}/faq`);
  });

  it("fills both Open Graph and Twitter cards", () => {
    const meta = pageMetadata({ title: "t", description: "d", path: "/research" });
    expect(meta.openGraph?.title).toBe(`t | ${SITE.name}`);
    expect((meta.twitter as any)?.card).toBe("summary_large_image");
    expect(meta.openGraph?.siteName).toBe(SITE.name);
  });

  it("indexes production pages by default", () => {
    const meta = pageMetadata({ title: "t", description: "d", path: "/projects" });
    expect(meta.robots).toEqual({ index: true, follow: true });
  });

  it("honours the noIndex flag", () => {
    const meta = pageMetadata({
      title: "t",
      description: "d",
      path: "/thank-you",
      noIndex: true,
    });
    expect(meta.robots).toEqual({ index: false, follow: false });
  });

  it("never emits a placeholder domain", () => {
    const meta = pageMetadata({ title: "t", description: "d", path: "/contact" });
    const serialised = JSON.stringify(meta);
    expect(serialised).not.toMatch(/example\.com|your-domain|localhost/i);
  });
});

describe("JSON-LD builders", () => {
  it("describes a Person with both profiles linked", () => {
    const person = personJsonLd();
    expect(person["@type"]).toBe("Person");
    expect(person.sameAs).toContain("https://github.com/vickyPotheesh2004");
    expect(person.sameAs).toContain(
      "https://www.linkedin.com/in/potheesh-vignesh-k-2017092a9/",
    );
  });

  it("numbers breadcrumb items from one", () => {
    const crumbs = breadcrumbJsonLd([
      { name: "Home", path: "/" },
      { name: "Projects", path: "/projects" },
    ]);
    expect(crumbs.itemListElement).toHaveLength(2);
    expect(crumbs.itemListElement[0].position).toBe(1);
    expect(crumbs.itemListElement[1].position).toBe(2);
    expect(crumbs.itemListElement[1].item).toBe(`${SITE.url}/projects`);
  });

  it("omits an absent repository rather than emitting undefined", () => {
    const software = softwareSourceJsonLd({
      name: "n",
      description: "d",
      url: "/projects/x",
    });
    expect(software).not.toHaveProperty("codeRepository");
  });

  it("maps FAQs to the FAQPage schema", () => {
    const faq = faqJsonLd([{ question: "q", answer: "a" }]);
    expect(faq["@type"]).toBe("FAQPage");
    expect(faq.mainEntity[0].name).toBe("q");
    expect(faq.mainEntity[0].acceptedAnswer.text).toBe("a");
  });
});
