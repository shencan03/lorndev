import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/site";
import { allPosts } from "@/app/lib/posts";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await allPosts();
  return [
    { url: SITE_URL },
    // Rebuilt whenever the liked-songs sync lands, so build time is accurate.
    { url: `${SITE_URL}/curation`, lastModified: new Date() },
    { url: `${SITE_URL}/blog` },
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.date,
    })),
  ];
}
