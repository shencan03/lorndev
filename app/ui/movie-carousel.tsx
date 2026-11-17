import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import MovieCard from "@/app/ui/movie-card";
import { getMovie } from "@/app/lib/tmdb/getMovie";

export default async function MovieCarousel() {
  const movies = await Promise.all(MOVIES.map(getMovie));

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      className="border"
    >
      <CarouselContent>
        {movies.map((movie) => (
          <CarouselItem key={movie.url} className="basis-1/2.1">
            <a href={movie.url} target="_blank" rel="noopener noreferrer">
              <MovieCard movie={movie} />
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
