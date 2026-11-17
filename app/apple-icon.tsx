import { renderIcon } from "@/app/lib/icon";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return renderIcon({ size: size.width, rounded: false });
}
