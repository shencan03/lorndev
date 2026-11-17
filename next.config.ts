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
