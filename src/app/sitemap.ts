import type { MetadataRoute } from "next";
import { PROJECTS } from "@/data/projects";
import { SERVICES } from "@/data/profile";
import { SECONDARY_NAV, SITE } from "@/data/site";

/**
 * Sitemap. Only canonical, indexable routes are listed:
 *  - the thank-you page is excluded (noindex, post-submission only)
 *  - every project and service detail page is included
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const home: MetadataRoute.Sitemap = [
    {
      url: SITE.url,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
  ];

  const staticPages: MetadataRoute.Sitemap = SECONDARY_NAV.map((item) => ({
    url: `${SITE.url}${item.href}`,
    lastModified,
    changeFrequency: item.href === "/projects" ? "weekly" : "monthly",
    priority: item.href === "/contact" ? 0.9 : 0.7,
  }));

  const projectPages: MetadataRoute.Sitemap = PROJECTS.map((project) => ({
    url: `${SITE.url}/projects/${project.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: project.featured ? 0.8 : 0.6,
  }));

  const servicePages: MetadataRoute.Sitemap = SERVICES.map((service) => ({
    url: `${SITE.url}/services/${service.slug}`,
    lastModified,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...home, ...staticPages, ...projectPages, ...servicePages];
}
