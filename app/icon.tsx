import { renderIcon } from "@/app/lib/render-icon";

// 64px so it stays sharp on high-DPI tab bars; browsers scale it down.
export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return renderIcon({ size: size.width, rounded: true });
}
