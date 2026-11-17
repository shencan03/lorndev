import { ImageResponse } from "next/og";
import { colors, loadFont } from "@/app/lib/og";

// Shared renderer for `icon.tsx` and `apple-icon.tsx`: a bold "l" plus the
// accent block cursor from the OG images. Rendered once at build time.

export async function renderIcon({
  size,
  rounded,
}: {
  size: number;
  /** Browser tabs show the corners; iOS applies its own mask, so skip them. */
  rounded: boolean;
}) {
  const bold = await loadFont("Bold");
  const unit = size / 64;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 3 * unit,
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: "JetBrains Mono",
        fontWeight: 700,
        fontSize: 46 * unit,
        // Keeps the icon visible against dark tab strips.
        ...(rounded && {
          borderRadius: 14 * unit,
          border: `${2 * unit}px solid ${colors.border}`,
        }),
      }}
    >
      <span style={{ lineHeight: 1, marginTop: -4 * unit }}>l</span>
      <div
        style={{
          width: 12 * unit,
          height: 32 * unit,
          marginTop: 2 * unit,
          backgroundColor: colors.accent,
        }}
      />
    </div>,
    {
      width: size,
      height: size,
      fonts: [{ name: "JetBrains Mono", data: bold, weight: 700 }],
    },
  );
}
