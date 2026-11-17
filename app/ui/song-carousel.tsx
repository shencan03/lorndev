import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import SongCard from "@/app/ui/song-card";
import { LIKED_SONGS, youtubeMusicUrl } from "@/app/lib/ytmusic/getSong";

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
            <a
              href={youtubeMusicUrl(song.videoId)}
              target="_blank"
              rel="noopener noreferrer"
            >
              <SongCard song={song} />
            </a>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
