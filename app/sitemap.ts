import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: SITE_URL },
    // Rebuilt whenever the liked-songs sync lands, so build time is accurate.
    { url: `${SITE_URL}/curation`, lastModified: new Date() },
  ];
}
