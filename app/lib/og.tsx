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
  transparent: "rgba(12, 9, 12, 0)",
};

/** Cover art for the collage: posters are 2:3, album art is square. */
export type Cover = { url: string; shape: "poster" | "square" };

const TILE_WIDTH = 168;
const TILE_GAP = 18;
const tileHeight = (shape: Cover["shape"]) =>
  shape === "poster" ? TILE_WIDTH * 1.5 : TILE_WIDTH;

// Which shape goes where; staggered so posters and squares interleave. Four
// tiles per column so the tilted columns overrun the card top and bottom.
const COLLAGE: Cover["shape"][][] = [
  ["poster", "square", "poster", "square"],
  ["square", "poster", "square", "poster"],
  ["poster", "square", "square", "poster"],
];
// Vertical offset per column, for a masonry-like stagger.
const COLUMN_OFFSETS = [0, -110, -40];

/** How many covers of each shape the collage can hold. */
export const COLLAGE_SLOTS = {
  poster: COLLAGE.flat().filter((s) => s === "poster").length,
  square: COLLAGE.flat().filter((s) => s === "square").length,
};

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

/** Renders `node` as the OG PNG, with JetBrains Mono loaded. */
export async function ogResponse(node: React.ReactElement) {
  const [regular, bold] = await Promise.all([
    loadFont("Regular"),
    loadFont("Bold"),
  ]);
  return new ImageResponse(node, {
    ...ogSize,
    fonts: [
      { name: "JetBrains Mono", data: regular, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: bold, weight: 700, style: "normal" },
    ],
  });
}

/** "lorndev", the muted route path, then the accent block cursor. */
export function wordmark({
  path = "",
  fontSize,
  marginLeft = 0,
}: {
  path?: string;
  fontSize: number;
  marginLeft?: number;
}) {
  return (
    <div
      style={{ display: "flex", alignItems: "center", fontSize, marginLeft }}
    >
      <span style={{ fontWeight: 700 }}>lorndev</span>
      {path && <span style={{ color: colors.mutedForeground }}>{path}</span>}
      <div
        style={{
          width: "0.5em",
          height: "0.9em",
          marginLeft: "0.15em",
          backgroundColor: colors.accent,
        }}
      />
    </div>
  );
}

// A fade from the background color toward `direction`.
const fade = (direction: string, stop: string) => (
  <div
    style={{
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundImage: `linear-gradient(${direction}, ${colors.background} 0%, ${colors.transparent} ${stop})`,
    }}
  />
);

export async function renderCollageImage({
  path = "",
  covers = [],
}: {
  /** Route path, e.g. "/curation"; shown muted after the wordmark. */
  path?: string;
  covers?: Cover[];
}) {
  const columns = await layoutCollage(covers);
  const hasCollage = columns.length > 0;

  return ogResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: hasCollage ? "flex-start" : "center",
        position: "relative",
        overflow: "hidden",
        backgroundColor: colors.background,
        color: colors.foreground,
        fontFamily: "JetBrains Mono",
      }}
    >
      {hasCollage && (
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 560,
            height: "100%",
            display: "flex",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: -90,
              left: 70,
              display: "flex",
              gap: TILE_GAP,
              transform: "rotate(-8deg)",
            }}
          >
            {columns.map((column, i) => (
              <div
                key={i}
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: TILE_GAP,
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
          {/* Fade the collage into the background on every open edge. */}
          {fade("90deg", "45%")}
          {fade("180deg", "18%")}
          {fade("0deg", "18%")}
        </div>
      )}

      {wordmark({
        path,
        fontSize: hasCollage ? 48 : 72,
        marginLeft: hasCollage ? 80 : 0,
      })}
    </div>,
  );
}
