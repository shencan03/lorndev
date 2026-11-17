import { z } from "zod";

const baseUrl = "https://api.themoviedb.org/3/search/tv";

const SearchSchema = z.object({
  results: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      poster_path: z.string().nullable(),
    }),
  ),
});

export default async function searchTV(query: string) {
  const params = new URLSearchParams({ query });

  const res = await fetch(`${baseUrl}?${params}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error(`TMDB fetch failed with code ${res.status}`);
  }

  const match = SearchSchema.parse(await res.json()).results[0];
  if (!match) {
    throw new Error(`No TMDB TV series found for "${query}"`);
  }
  return match;
}
