import type { NextConfig } from "next";
import createMDX from "@next/mdx";
import rehypeHighlight from "rehype-highlight";
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
    rehypePlugins: [
      [rehypeHighlight, { languages: { ...common, dockerfile } }],
    ],
  },
});

export default withMDX(nextConfig);
