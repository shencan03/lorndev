import { ogContentType, ogSize, renderCollageImage } from "@/app/lib/og";

export const alt = "lorndev/blog";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderCollageImage({ path: "/blog" });
}
