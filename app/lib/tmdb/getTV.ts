import { z } from "zod";

import searchTV from "@/app/lib/tmdb/searchTV";
const baseUrl = "https://api.themoviedb.org/3/tv";
const posterUrl = "https://image.tmdb.org/t/p";

const TVCardSchema = z.object({
  name: z.string(),
  poster_path: z.string(),
});

export async function getTVCard(query: string) {
  const id = await searchTV(query);
  const url = `${baseUrl}/${id}`;

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
    const data = TVCardSchema.parse(rawData);
    data.poster_path = `${posterUrl}/original${data.poster_path}`;

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch TV");
  }
}
