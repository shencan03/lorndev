import { readdirSync } from "node:fs";
import { join } from "node:path";
import type { ComponentType } from "react";

// Posts live in content/blog/<slug>.mdx and export their own metadata:
//   export const metadata = { title, date: "YYYY-MM-DD", description }
// Add `draft: true` to keep a post off the live site: drafts show up under
// `pnpm dev` and are left out of production builds entirely (their URLs 404).

export type PostMeta = {
  title: string;
  /** ISO date, YYYY-MM-DD. */
  date: string;
  description: string;
  /** Hidden in production; visible in dev. */
  draft?: boolean;
};

export type Post = PostMeta & { slug: string };

/** Drafts are shown everywhere except a production build. */
export const SHOW_DRAFTS = process.env.NODE_ENV !== "production";

const POSTS_DIR = join(process.cwd(), "content/blog");

export function postSlugs(): string[] {
  return readdirSync(POSTS_DIR)
    .filter((file) => file.endsWith(".mdx"))
    .map((file) => file.replace(/\.mdx$/, ""));
}

export async function loadPost(
  slug: string,
): Promise<{ meta: Post; Content: ComponentType }> {
  const mod = await import(`@/content/blog/${slug}.mdx`);
  return {
    meta: { ...(mod.metadata as PostMeta), slug },
    Content: mod.default,
  };
}

/** Every post that should be visible here, newest first. */
export async function allPosts(): Promise<Post[]> {
  const posts = await Promise.all(
    postSlugs().map(async (slug) => (await loadPost(slug)).meta),
  );
  return posts
    .filter((post) => SHOW_DRAFTS || !post.draft)
    .sort((a, b) => b.date.localeCompare(a.date));
}

/** "19 Nov 2026" */
export function formatDate(date: string): string {
  return new Date(`${date}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
