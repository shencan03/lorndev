import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import { SONGS } from "@/app/lib/ytmusic/catalogue/song";
import SongCard from "@/app/ui/song-card";
import { getSong } from "@/app/lib/ytmusic/getSong";
import Link from "next/link";

export default async function SongCarousel() {
  const songsArr = await Promise.all(
    Object.keys(SONGS).map(async (query) => {
      const song = await getSong(query, "card");
      return (
        <CarouselItem key={song.videoId} className="basis-1/2.1">
          <Link href={`/curation/song/${query}`}>
            <SongCard song={song} />
          </Link>
        </CarouselItem>
      );
    }),
  );

  return (
    <>
      <Carousel
        opts={{
          dragFree: true,
        }}
        className="border"
      >
        <CarouselContent>{songsArr}</CarouselContent>
      </Carousel>
    </>
  );
}
