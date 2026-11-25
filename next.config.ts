import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import { common } from "lowlight";
import dockerfile from "highlight.js/lib/languages/dockerfile";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "image.tmdb.org",
      },
      {
        protocol: "https",
        hostname: "images.igdb.com",
        pathname: "/igdb/image/upload/**",
      },
      {
        // Google Books covers, when Open Library has none (books/content and
        // books/publisher/content)
        protocol: "https",
        hostname: "books.google.com",
        pathname: "/books/**",
      },
      {
        // Book covers by ISBN (they redirect to archive.org, which the
        // image optimizer follows)
        protocol: "https",
        hostname: "covers.openlibrary.org",
        pathname: "/b/isbn/**",
      },
      {
        // YouTube Music cover art (yt3./lh3.googleusercontent.com)
        protocol: "https",
        hostname: "*.googleusercontent.com",
      },
      {
        // Thumbnails of liked videos (uploads, not album tracks)
        protocol: "https",
        hostname: "i.ytimg.com",
        pathname: "/vi/**",
      },
    ],
  },
  output: "standalone",
  // Dev only: hosts allowed to load the dev server's scripts, e.g. a phone on
  // the same network: DEV_ORIGINS=10.0.0.5 pnpm dev -H 0.0.0.0
  allowedDevOrigins: process.env.DEV_ORIGINS?.split(","),
  // Serve one host only; canonical tags cover crawlers that skip redirects.
  async redirects() {
    return [
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.lorndev.com" }],
        destination: "https://lorndev.com/:path*",
        permanent: true,
      },
    ];
  },
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
  options: {
    // GFM for footnotes ([^1]), plus tables, strikethrough and autolinks.
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      [rehypeHighlight, { languages: { ...common, dockerfile } }],
    ],
  },
});

export default withMDX(nextConfig);
