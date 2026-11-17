import ShuffledCarousel from "@/app/ui/shuffled-carousel";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import MovieCard from "@/app/ui/movie-card";
import { getMovie } from "@/app/lib/tmdb/getMovie";

export default async function MovieCarousel() {
  const movies = await Promise.all(MOVIES.map(getMovie));

  return (
    <ShuffledCarousel
      id="movies"
      placeholderClassName="aspect-[2/3]"
      items={movies.map((movie) => ({
        key: movie.url,
        href: movie.url,
        card: <MovieCard movie={movie} />,
      }))}
    />
  );
}
