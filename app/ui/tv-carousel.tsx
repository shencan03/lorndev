import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { TVs } from "@/app/lib/tmdb/catalogue/tv";
import TVCard from "@/app/ui/tv-card";
import { getTVCard } from "@/app/lib/tmdb/getTV";

export default async function Curation() {
  const tvArr = await Promise.all(
    TVs.map(async (query) => await getTVCard(query)),
  );

  if (!tvArr) {
    return <div>Failed to get tvs</div>;
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
          {tvArr.map((tv) => {
            return (
              <CarouselItem key={tv.name} className="basis-1/2.1">
                <TVCard tv={tv} />
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </>
  );
}
