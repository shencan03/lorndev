import { z } from "zod";
import type { MovieCard } from "@/app/lib/definitions";
import type { MovieEntry } from "@/app/lib/tmdb/catalogue/movie";

const baseUrl = "https://api.themoviedb.org/3/movie";
const posterUrl = "https://image.tmdb.org/t/p/original";

const MovieSchema = z.object({
  title: z.string(),
  poster_path: z.string(),
});

export async function getMovie({ tmdbId }: MovieEntry): Promise<MovieCard> {
  const res = await fetch(`${baseUrl}/${tmdbId}`, {
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${process.env.TMDB_TOKEN}`,
    },
  });
  if (!res.ok) {
    throw new Error(
      `TMDB fetch for movie ${tmdbId} failed with code ${res.status}`,
    );
  }

  const movie = MovieSchema.parse(await res.json());
  return {
    title: movie.title,
    poster_path: `${posterUrl}${movie.poster_path}`,
    url: `https://www.themoviedb.org/movie/${tmdbId}`,
  };
}
