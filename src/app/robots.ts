import type { MetadataRoute } from "next";
import { SITE } from "@/data/site";

/**
 * robots.txt. Everything public is crawlable; the post-submission
 * confirmation page and the API route are not.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/", "/thank-you"],
      },
    ],
    sitemap: `${SITE.url}/sitemap.xml`,
    host: SITE.url,
  };
}
