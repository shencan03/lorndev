import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Shared renderer for the `opengraph-image.tsx` files. The routes have no
// dynamic params, so Next renders them once at build time into static PNGs.

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

// Hex equivalents of the `.dark` tokens in globals.css (Satori can't parse
// oklch). `accent` is oklch(0.72 0.16 326): the theme's mauve hue, saturated.
export const colors = {
  background: "#0c090c",
  foreground: "#fafafa",
  mutedForeground: "#a89ea9",
  muted: "#2a212c",
  border: "rgba(255, 255, 255, 0.1)",
  accent: "#d77eda",
  accentGlow: "rgba(215, 126, 218, 0.14)",
  transparent: "rgba(12, 9, 12, 0)",
};

/** Cover art for the collage: posters are 2:3, album art is square. */
export type Cover = { url: string; shape: "poster" | "square" };

const TILE_WIDTH = 168;
const tileHeight = (shape: Cover["shape"]) =>
  shape === "poster" ? TILE_WIDTH * 1.5 : TILE_WIDTH;

// Which shape goes where; staggered so posters and squares interleave.
const COLLAGE: Cover["shape"][][] = [
  ["poster", "square", "poster"],
  ["square", "poster", "square"],
  ["poster", "square", "square"],
];
// Vertical offset per column, for a masonry-like stagger.
const COLUMN_OFFSETS = [-40, -150, -70];

// Satori needs ttf/otf/woff, not the woff2 that next/font serves.
export const loadFont = (weight: "Regular" | "Bold") =>
  readFile(join(process.cwd(), `app/fonts/JetBrainsMono-${weight}.ttf`));

// Fetch up front and inline as data URIs, so one dead image drops a tile
// instead of failing the build. Satori only decodes png/jpeg.
async function toDataUri(url: string): Promise<string | null> {
  try {
    const res = await fetch(url);
    const type = res.headers.get("content-type") ?? "";
    if (!res.ok || !/^image\/(png|jpeg)/.test(type)) return null;
    const data = Buffer.from(await res.arrayBuffer()).toString("base64");
    return `data:${type};base64,${data}`;
  } catch {
    return null;
  }
}

async function layoutCollage(covers: Cover[]) {
  const loaded = await Promise.all(
    covers.map(async (c) => ({ ...c, src: await toDataUri(c.url) })),
  );
  const pools = {
    poster: loaded.filter((c) => c.src && c.shape === "poster"),
    square: loaded.filter((c) => c.src && c.shape === "square"),
  };
  return COLLAGE.map((column) =>
    column.flatMap((shape) => pools[shape].shift() ?? []),
  ).filter((column) => column.length > 0);
}

export async function renderOgImage({
  title,
  description,
  path = "",
  covers = [],
}: {
  title: string;
  description: string;
  /** Route path, e.g. "/curation"; shown in the URL and the prompt. */
  path?: string;
  covers?: Cover[];
}) {
  const [regular, bold, columns] = await Promise.all([
    loadFont("Regular"),
    loadFont("Bold"),
    layoutCollage(covers),
  ]);
  const hasCollage = columns.length > 0;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: colors.background,
        backgroundImage: `radial-gradient(circle at 0% 100%, ${colors.accentGlow}, ${colors.transparent} 55%)`,
        color: colors.foreground,
        fontFamily: "JetBrains Mono",
      }}
    >
      {/* Mirrors the site header: logo left, bordered bottom. */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "36px 64px",
          borderBottom: `2px solid ${colors.border}`,
          fontSize: 32,
        }}
      >
        <span style={{ fontWeight: 700 }}>lorndev</span>
        <span style={{ color: colors.mutedForeground }}>lorndev.com{path}</span>
      </div>

      <div
        style={{
          flex: 1,
          display: "flex",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {hasCollage && (
          <div
            style={{
              position: "absolute",
              top: 0,
              right: 0,
              width: 600,
              height: "100%",
              display: "flex",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: -60,
                left: 70,
                display: "flex",
                gap: 18,
                transform: "rotate(-8deg)",
              }}
            >
              {columns.map((column, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 18,
                    marginTop: COLUMN_OFFSETS[i],
                  }}
                >
                  {column.map((cover) => (
                    // eslint-disable-next-line @next/next/no-img-element, jsx-a11y/alt-text
                    <img
                      key={cover.url}
                      src={cover.src!}
                      width={TILE_WIDTH}
                      height={tileHeight(cover.shape)}
                      style={{
                        objectFit: "cover",
                        borderRadius: 8,
                        border: `1px solid ${colors.border}`,
                        backgroundColor: colors.muted,
                      }}
                    />
                  ))}
                </div>
              ))}
            </div>
            {/* Fade the collage into the background toward the text. */}
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `linear-gradient(90deg, ${colors.background} 0%, ${colors.transparent} 45%)`,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                backgroundImage: `linear-gradient(0deg, ${colors.background} 0%, ${colors.transparent} 22%)`,
              }}
            />
          </div>
        )}

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            padding: "0 64px",
            gap: 20,
            width: hasCollage ? 680 : "100%",
          }}
        >
          {/* Shell prompt for the current route. */}
          <div style={{ display: "flex", fontSize: 32 }}>
            <span style={{ color: colors.accent }}>~{path}</span>
            <span style={{ color: colors.mutedForeground }}>&nbsp;$</span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1.1,
              letterSpacing: "-0.02em",
            }}
          >
            <span>{title}</span>
            {/* Block cursor. */}
            <div
              style={{
                width: 46,
                height: 84,
                backgroundColor: colors.accent,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 34,
              lineHeight: 1.4,
              color: colors.mutedForeground,
            }}
          >
            {description}
          </div>
        </div>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
        { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
      ],
    },
  );
}
