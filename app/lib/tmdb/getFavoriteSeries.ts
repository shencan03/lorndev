import { z } from "zod";
import type { TVCard } from "@/app/lib/definitions";
import { yearOf } from "@/app/lib/tmdb/getMovie";

// The TV carousel mirrors this TMDB list on the token owner's account. It is fetched while
// the site builds, so every deploy picks up whatever the list holds at that moment.
const LIST_NAME = "favorite series";

const apiUrl = "https://api.themoviedb.org/4";
const posterUrl = "https://image.tmdb.org/t/p/w342";

const ListsPageSchema = z.object({
  total_pages: z.number(),
  results: z.array(z.object({ id: z.number(), name: z.string() })),
});

const ListPageSchema = z.object({
  total_pages: z.number(),
  results: z.array(
    z.object({
      id: z.number(),
      media_type: z.string(),
      name: z.string().optional(),
      poster_path: z.string().nullable().optional(),
      first_air_date: z.string().optional(),
    }),
  ),
});

function token(): string {
  const value = process.env.TMDB_TOKEN;
  if (!value) throw new Error("TMDB_TOKEN is not set");
  return value;
}

// TMDB read access tokens are JWTs whose `sub` is the owner's v4 account id.
function accountId(): string {
  const payload = token().split(".")[1];
  const { sub } = z
    .object({ sub: z.string() })
    .parse(JSON.parse(Buffer.from(payload, "base64url").toString("utf8")));
  return sub;
}

async function tmdb(path: string): Promise<unknown> {
  const res = await fetch(`${apiUrl}${path}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${token()}`,
    },
  });
  if (!res.ok) {
    throw new Error(`TMDB fetch ${path} failed with code ${res.status}`);
  }
  return res.json();
}

async function findListId(): Promise<number> {
  const account = accountId();
  for (let page = 1, pages = 1; page <= pages; page++) {
    const data = ListsPageSchema.parse(
      await tmdb(`/account/${account}/lists?page=${page}`),
    );
    pages = data.total_pages;
    const match = data.results.find(
      (list) => list.name.trim().toLowerCase() === LIST_NAME,
    );
    if (match) return match.id;
  }
  throw new Error(
    `No public TMDB list named "${LIST_NAME}" on this token's account`,
  );
}

async function fetchFavoriteSeries(): Promise<TVCard[]> {
  const listId = await findListId();
  const series: TVCard[] = [];
  for (let page = 1, pages = 1; page <= pages; page++) {
    const data = ListPageSchema.parse(
      await tmdb(`/list/${listId}?page=${page}`),
    );
    pages = data.total_pages;
    for (const item of data.results) {
      if (item.media_type !== "tv" || !item.name || !item.poster_path) continue;
      series.push({
        name: item.name,
        poster_path: `${posterUrl}${item.poster_path}`,
        url: `https://www.themoviedb.org/tv/${item.id}`,
        year: yearOf(item.first_air_date),
      });
    }
  }
  if (series.length === 0) {
    throw new Error(`TMDB list "${LIST_NAME}" has no TV series`);
  }
  return series;
}

// Shared by the carousel and the OG image so a build fetches the list once per worker.
let cached: Promise<TVCard[]> | undefined;

export function getFavoriteSeries(): Promise<TVCard[]> {
  cached ??= fetchFavoriteSeries().catch((error: unknown) => {
    cached = undefined;
    throw error;
  });
  return cached;
}
