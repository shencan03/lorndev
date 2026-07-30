import { z } from "zod";

const urlBase = "https://api.themoviedb.org/3/search/tv";

const SearchSchema = z.object({
  results: z.array(
    z.object({
      id: z.number(),
    }),
  ),
});

export default async function searchTV(query: string) {
  const url = `${urlBase}?query=${encodeURIComponent(query)}`;
  try {
    const res = await fetch(url, {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
      },
    });

    if (!res.ok) {
      throw new Error(`TMDB fetch failed with code ${res.status}`);
    }
    const rawData = await res.json();
    const data = SearchSchema.parse(rawData);
    return data.results[0].id;
  } catch (e) {
    console.error(e);
  }
}
