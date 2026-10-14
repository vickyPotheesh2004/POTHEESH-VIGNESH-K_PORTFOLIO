import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  FEATURED_PROJECTS,
  PROJECTS,
  PROJECTS_BY_SLUG,
  PROJECT_STATS,
  SORTED_PROJECTS,
  getRelated,
  videoSourceProjects,
} from "./projects";

const SLUGS = PROJECTS.map((project) => project.slug);
const PUBLIC_DIR = join(process.cwd(), "public");

describe("project catalogue integrity", () => {
  it("has at least one project", () => {
    expect(PROJECTS.length).toBeGreaterThan(0);
  });

  it("uses unique slugs", () => {
    expect(new Set(SLUGS).size).toBe(SLUGS.length);
  });

  it("uses unique order values", () => {
    const orders = PROJECTS.map((project) => project.order);
    expect(new Set(orders).size).toBe(orders.length);
  });

  it("gives every project a non-empty title, tagline and category", () => {
    for (const project of PROJECTS) {
      expect(project.title.trim(), project.slug).not.toBe("");
      expect(project.tagline.trim(), project.slug).not.toBe("");
      expect(project.category.trim(), project.slug).not.toBe("");
    }
  });

  it("resolves every slug through the lookup map", () => {
    for (const project of PROJECTS) {
      expect(PROJECTS_BY_SLUG.get(project.slug), project.slug).toBe(project);
    }
  });

  it("connects every related slug to a real project", () => {
    for (const project of PROJECTS) {
      for (const slug of project.related) {
        expect(SLUGS, `${project.slug} → ${slug}`).toContain(slug);
      }
      expect(getRelated(project.related), project.slug).toHaveLength(
        project.related.length,
      );
    }
  });

  it("never lists a project as related to itself", () => {
    for (const project of PROJECTS) {
      expect(project.related, project.slug).not.toContain(project.slug);
    }
  });

  it("excludes the repositories requested to be excluded", () => {
    const banned = [
      "FundLink",
      "FundLink---prod",
      "FPGA_ARCH_demo",
      "NeetCode",
      "Project-Repo-Batch-11",
    ];
    const haystack = JSON.stringify(PROJECTS);
    for (const term of banned) {
      expect(haystack, `excluded term present: ${term}`).not.toContain(term);
    }
  });
});

describe("the 24-block contract", () => {
  it("fills every narrative block on every project", () => {
    for (const project of PROJECTS) {
      expect(project.summary.length, `${project.slug} summary`).toBeGreaterThan(0);
      expect(project.problem.trim(), `${project.slug} problem`).not.toBe("");
      expect(project.audience.trim(), `${project.slug} audience`).not.toBe("");
      expect(project.constraints.length, `${project.slug} constraints`).toBeGreaterThan(0);
      expect(project.approach.length, `${project.slug} approach`).toBeGreaterThan(0);
      expect(project.pipeline.length, `${project.slug} pipeline`).toBeGreaterThan(0);
      expect(project.dataFlow.length, `${project.slug} dataFlow`).toBeGreaterThan(0);
      expect(project.techniques.length, `${project.slug} techniques`).toBeGreaterThan(0);
      expect(project.implementation.length, `${project.slug} implementation`).toBeGreaterThan(0);
      expect(project.verification.length, `${project.slug} verification`).toBeGreaterThan(0);
      expect(project.limitations.length, `${project.slug} limitations`).toBeGreaterThan(0);
      expect(project.futureWork.length, `${project.slug} futureWork`).toBeGreaterThan(0);
      expect(project.stack.length, `${project.slug} stack`).toBeGreaterThan(0);
    }
  });

  it("gives every pipeline stage a sequential mono id and a valid role", () => {
    const roles = ["input", "process", "reasoning", "validation", "output"];
    for (const project of PROJECTS) {
      project.pipeline.forEach((stage, index) => {
        expect(stage.id, `${project.slug} stage ${index}`).toBe(
          String(index + 1).padStart(2, "0"),
        );
        expect(roles, `${project.slug} stage ${index}`).toContain(stage.role);
      });
    }
  });

  it("gives every data-flow step a from, to and payload", () => {
    for (const project of PROJECTS) {
      for (const step of project.dataFlow) {
        expect(step.from.trim(), project.slug).not.toBe("");
        expect(step.to.trim(), project.slug).not.toBe("");
        expect(step.payload.trim(), project.slug).not.toBe("");
      }
    }
  });

  it("states a scope caveat wherever source is not published", () => {
    for (const project of PROJECTS) {
      if (project.status === "documented-design") {
        expect(project.caveat, `${project.slug} needs a caveat`).toBeTruthy();
      }
    }
  });
});

describe("evidence discipline", () => {
  it("tags every result row with a valid evidence level", () => {
    for (const project of PROJECTS) {
      for (const row of project.results) {
        expect(["verified", "reported", "proposed"], project.slug).toContain(
          row.evidence,
        );
      }
    }
  });

  it("names a source for every reported figure", () => {
    for (const project of PROJECTS) {
      for (const row of project.results) {
        expect(row.source.trim(), `${project.slug} → ${row.value}`).not.toBe("");
      }
    }
  });

  it("never presents an unbuilt feature as a result", () => {
    for (const project of PROJECTS) {
      const proposed = project.results.filter((row) => row.evidence === "proposed");
      expect(proposed, `${project.slug} lists proposed work as a result`).toHaveLength(0);
    }
  });

  it("records a status note on every project", () => {
    for (const project of PROJECTS) {
      expect(project.statusNote.trim(), project.slug).not.toBe("");
    }
  });
});

describe("links and media", () => {
  it("uses https and a real host for every external link", () => {
    for (const project of PROJECTS) {
      for (const link of project.links) {
        expect(link.href, `${project.slug} → ${link.label}`).toMatch(/^https:\/\//);
        expect(link.href).not.toMatch(/example\.com|localhost|your-domain|TODO/i);
      }
    }
  });

  it("gives every link a label and a valid kind", () => {
    for (const project of PROJECTS) {
      for (const link of project.links) {
        expect(link.label.trim(), project.slug).not.toBe("");
        expect(["repo", "live", "package"], project.slug).toContain(link.kind);
      }
    }
  });

  it("ships a video file and poster that actually exist on disk", () => {
    for (const project of PROJECTS) {
      if (!project.video) continue;
      expect(project.video.src, `${project.slug} src`).toMatch(/^\/videos\/.+\.mp4$/);
      expect(
        existsSync(join(PUBLIC_DIR, project.video.src)),
        `${project.slug} missing ${project.video.src}`,
      ).toBe(true);
      expect(
        existsSync(join(PUBLIC_DIR, project.video.poster)),
        `${project.slug} missing ${project.video.poster}`,
      ).toBe(true);
    }
  });

  it("gives every recording a caption and a confidence flag", () => {
    for (const project of PROJECTS) {
      if (!project.video) continue;
      expect(project.video.caption.trim(), project.slug).not.toBe("");
      expect(["confirmed", "inferred"], project.slug).toContain(
        project.video.confidence,
      );
    }
  });

  it("lists one video source per recorded project", () => {
    const sources = videoSourceProjects();
    expect(sources).toHaveLength(PROJECT_STATS.videos);
    expect(new Set(sources.map((entry) => entry.src)).size).toBe(sources.length);
  });

  it("references only reference imagery that exists", () => {
    for (const file of ["images/profile-portrait.png", "images/workspace.png"]) {
      expect(existsSync(join(PUBLIC_DIR, file)), `missing ${file}`).toBe(true);
    }
  });
});

describe("aggregate stats", () => {
  it("agrees with the project list", () => {
    expect(PROJECT_STATS.total).toBe(PROJECTS.length);
    expect(PROJECT_STATS.shipped).toBe(
      PROJECTS.filter((project) => project.status === "shipped").length,
    );
    expect(PROJECT_STATS.videos).toBe(
      PROJECTS.filter((project) => project.video).length,
    );
  });

  it("returns featured projects only", () => {
    expect(FEATURED_PROJECTS.length).toBeGreaterThan(0);
    expect(FEATURED_PROJECTS.every((project) => project.featured)).toBe(true);
    // Featured list is sorted by the catalogue order.
    const orders = FEATURED_PROJECTS.map((project) => project.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
  });

  it("sorts the full catalogue by order", () => {
    const orders = SORTED_PROJECTS.map((project) => project.order);
    expect([...orders].sort((a, b) => a - b)).toEqual(orders);
    expect(SORTED_PROJECTS).toHaveLength(PROJECTS.length);
  });

  it("publishes at most seven packages, matching the verified PyPI count", () => {
    expect(PROJECT_STATS.publishedPackages).toBe(7);
  });
});
