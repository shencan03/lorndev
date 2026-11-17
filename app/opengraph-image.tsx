import { ogContentType, ogSize, renderOgImage } from "@/app/lib/og";

export const alt = "lorndev — personal web blog";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    title: "lorndev",
    description: "Personal web blog of lorndev",
  });
}
