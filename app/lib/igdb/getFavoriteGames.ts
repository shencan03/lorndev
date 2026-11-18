import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { GameCard } from "@/app/lib/definitions";

// The games carousel mirrors catalogue/games.txt, which sync-games.yml copies from a Gist.
// Each line is an IGDB slug or game URL (https://www.igdb.com/games/<slug>); blank lines
// and `#` comments are ignored. Details and covers are fetched from IGDB while the site
// builds.
const catalogue = path.join(process.cwd(), "app/lib/igdb/catalogue/games.txt");

const tokenUrl = "https://id.twitch.tv/oauth2/token";
const apiUrl = "https://api.igdb.com/v4";
const coverUrl = "https://images.igdb.com/igdb/image/upload/t_cover_big_2x";

const TokenSchema = z.object({ access_token: z.string() });

const GamesSchema = z.array(
  z.object({
    name: z.string(),
    slug: z.string(),
    url: z.string(),
    cover: z.object({ image_id: z.string() }).optional(),
    // Unix seconds.
    first_release_date: z.number().optional(),
  }),
);

function env(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

function parseSlug(line: string): string {
  const match = line.match(/igdb\.com\/games\/([^/?#\s]+)/);
  return (match ? match[1] : line).trim().toLowerCase();
}

async function readSlugs(): Promise<string[]> {
  const text = await readFile(catalogue, "utf8");
  const slugs = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map(parseSlug);
  return [...new Set(slugs)];
}

// App access tokens last about 60 days; a build only needs one, so fetch it fresh.
async function accessToken(clientId: string): Promise<string> {
  const params = new URLSearchParams({
    client_id: clientId,
    client_secret: env("IGDB_CLIENT_SECRET"),
    grant_type: "client_credentials",
  });
  const res = await fetch(tokenUrl, { method: "POST", body: params });
  if (!res.ok) {
    throw new Error(`Twitch token request failed with code ${res.status}`);
  }
  return TokenSchema.parse(await res.json()).access_token;
}

async function fetchFavoriteGames(): Promise<GameCard[]> {
  const slugs = await readSlugs();
  if (slugs.length === 0) throw new Error("games.txt lists no games");

  const clientId = env("IGDB_CLIENT_ID");
  const res = await fetch(`${apiUrl}/games`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "Client-ID": clientId,
      Authorization: `Bearer ${await accessToken(clientId)}`,
    },
    body: `fields name,slug,url,cover.image_id,first_release_date; where slug = (${slugs
      .map((slug) => JSON.stringify(slug))
      .join(",")}); limit 500;`,
  });
  if (!res.ok) {
    throw new Error(`IGDB games query failed with code ${res.status}`);
  }
  const games = GamesSchema.parse(await res.json());

  // Fail the build on a typo rather than silently dropping a game.
  const found = new Set(games.map((game) => game.slug));
  const missing = slugs.filter((slug) => !found.has(slug));
  if (missing.length > 0) {
    throw new Error(`No IGDB game for slug(s): ${missing.join(", ")}`);
  }

  return games.flatMap((game) =>
    game.cover
      ? [
          {
            name: game.name,
            cover: `${coverUrl}/${game.cover.image_id}.jpg`,
            url: game.url,
            year: game.first_release_date
              ? new Date(game.first_release_date * 1000).getUTCFullYear()
              : undefined,
          },
        ]
      : [],
  );
}

// Shared by the carousel and the OG image so a build fetches the list once per worker.
let cached: Promise<GameCard[]> | undefined;

export function getFavoriteGames(): Promise<GameCard[]> {
  cached ??= fetchFavoriteGames().catch((error: unknown) => {
    cached = undefined;
    throw error;
  });
  return cached;
}
