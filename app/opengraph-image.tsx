import {
  colors,
  ogContentType,
  ogResponse,
  ogSize,
  wordmark,
} from "@/app/lib/og";
import { SOCIALS } from "@/app/lib/socials";

export const alt = "lorndev";
export const size = ogSize;
export const contentType = ogContentType;

// Square previews (WhatsApp, Reddit) keep only the centre 630x630, so the
// wordmark and `ls` sit inside it; the socials live in the right-hand wing
// that only wide previews show. Bottom-right, since X overlays the domain
// bottom-left.

const fill = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
} as const;

const DOT_SPACING = 30;
const DOT_MAX_OPACITY = 0.3;
// Dots fade to nothing this far from the centre (an ellipse, wider than tall).
const FADE_RADIUS = { x: 560, y: 330 };

// [cx, cy, opacity] for each dot that is visible at all.
const DOTS = Array.from(
  { length: Math.ceil(ogSize.width / DOT_SPACING) },
  (_, col) =>
    Array.from({ length: Math.ceil(ogSize.height / DOT_SPACING) }, (_, row) => {
      const cx = DOT_SPACING / 2 + col * DOT_SPACING;
      const cy = DOT_SPACING / 2 + row * DOT_SPACING;
      const distance = Math.hypot(
        (cx - ogSize.width / 2) / FADE_RADIUS.x,
        (cy - ogSize.height / 2) / FADE_RADIUS.y,
      );
      return [
        cx,
        cy,
        DOT_MAX_OPACITY * Math.max(0, 1 - distance) ** 1.2,
      ] as const;
    }),
)
  .flat()
  .filter(([, , opacity]) => opacity > 0.01);

export default function Image() {
  return ogResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: "JetBrains Mono",
      }}
    >
      {/* Dot grid fading out from the centre, then a soft accent glow. Plain
          circles with baked-in opacity: Satori neither tiles gradients nor
          keeps SVG patterns, and its ellipse gradients render near-solid. */}
      <svg
        width={ogSize.width}
        height={ogSize.height}
        style={fill}
        viewBox={`0 0 ${ogSize.width} ${ogSize.height}`}
      >
        {DOTS.map(([cx, cy, opacity]) => (
          <circle
            key={`${cx},${cy}`}
            cx={cx}
            cy={cy}
            r={1.6}
            fill="#ffffff"
            fillOpacity={opacity}
          />
        ))}
      </svg>
      <div
        style={{
          ...fill,
          backgroundImage: `radial-gradient(circle at center, rgba(215, 126, 218, 0.12) 0%, ${colors.transparent} 38%)`,
        }}
      />

      <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
        {wordmark({ fontSize: 80 })}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 6,
            fontSize: 28,
          }}
        >
          <div style={{ display: "flex", color: colors.mutedForeground }}>
            <span style={{ color: colors.accent }}>~</span>
            <span>&nbsp;$ ls</span>
          </div>
          <div style={{ display: "flex", gap: 28 }}>
            <span>blog/</span>
            <span>curation/</span>
          </div>
        </div>
      </div>

      <div
        style={{
          position: "absolute",
          right: 48,
          bottom: 40,
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 12,
          fontSize: 18,
          color: colors.mutedForeground,
        }}
      >
        {SOCIALS.map((social) => (
          <div
            key={social.name}
            style={{ display: "flex", alignItems: "center", gap: 10 }}
          >
            <span>{social.handle}</span>
            <svg
              width={22}
              height={22}
              viewBox="0 0 256 256"
              fill={colors.mutedForeground}
            >
              <path d={social.iconPath} />
            </svg>
          </div>
        ))}
      </div>
    </div>,
  );
}
