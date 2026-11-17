import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import SongCard from "@/app/ui/song-card";
import { LIKED_SONGS } from "@/app/lib/ytmusic/getSong";
import Link from "next/link";

export default function SongCarousel() {
  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      className="border"
    >
      <CarouselContent>
        {LIKED_SONGS.map((song) => (
          <CarouselItem key={song.videoId} className="basis-1/2.1">
            <Link href={`/curation/song/${song.videoId}`}>
              <SongCard song={song} />
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
