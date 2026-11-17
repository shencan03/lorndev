import searchTV from "@/app/lib/tmdb/searchTV";
import type { TVCard } from "@/app/lib/definitions";

const posterUrl = "https://image.tmdb.org/t/p/w342";

export async function getTV(query: string): Promise<TVCard> {
  const tv = await searchTV(query);
  return {
    name: tv.name,
    poster_path: `${posterUrl}${tv.poster_path}`,
    url: `https://www.themoviedb.org/tv/${tv.id}`,
  };
}
