import { z } from "zod";
import searchMovie from "@/app/lib/tmdb/searchMovie";

const baseUrl = "https://api.themoviedb.org/3/movie";
const posterUrl = "https://image.tmdb.org/t/p";

const MovieSchema = z.object({
  title: z.string(),
  poster_path: z.string(),
});

export async function getMovieCard(query: string) {
  const id = await searchMovie(query);
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
    const data = MovieSchema.parse(rawData);
    data.poster_path = `${posterUrl}/original${data.poster_path}`;

    return data;
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch movie");
  }
}
