import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import MovieCard from "@/app/ui/movie-card";
import { getMovieCard } from "@/app/lib/tmdb/getMovie";

export default async function Curation() {
  const moviesArr = await Promise.all(
    MOVIES.map(async (query) => await getMovieCard(query)),
  );

  if (!moviesArr) {
    return <div>Failed to get movies</div>;
  }

  return (
    <>
      <Carousel
        opts={{
          dragFree: true,
        }}
        className="border"
      >
        <CarouselContent>
          {moviesArr.map((movie) => {
            return (
              <CarouselItem key={movie.title} className="basis-1/2.1">
                <MovieCard movie={movie} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </>
  );
}
