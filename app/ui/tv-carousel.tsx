import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { TVs } from "@/app/lib/tmdb/catalogue/tv";
import TVCard from "@/app/ui/tv-card";
import { getTV } from "@/app/lib/tmdb/getTV";

export default async function TVCarousel() {
  const tvs = await Promise.all(TVs.map((query) => getTV(query)));

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      className="border"
    >
      <CarouselContent>
        {tvs.map((tv) => (
          <CarouselItem key={tv.url} className="basis-1/2.1">
            <a href={tv.url} target="_blank" rel="noopener noreferrer">
              <TVCard tv={tv} />
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
