"use client";

import { useSyncExternalStore } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

import SongCard from "@/app/ui/song-card";
import { LIKED_SONGS, youtubeMusicUrl } from "@/app/lib/ytmusic/getSong";
import type { SongCard as Song } from "@/app/lib/definitions";

const SHOWN = Math.min(24, LIKED_SONGS.length);

// Fisher–Yates over a copy, stopping once the first `count` slots are filled.
function pickRandom(songs: Song[], count: number): Song[] {
  const pool = songs.slice();
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

// The page is static, so the shuffle has to happen in the browser. The server snapshot is
// null, which renders placeholders; after hydration React switches to the client snapshot.
// It is computed once per page load and cached so the snapshot stays stable between renders.
let picked: Song[] | null = null;
const subscribe = () => () => {};
const getSnapshot = () => (picked ??= pickRandom(LIKED_SONGS, SHOWN));
const getServerSnapshot = () => null;

export default function SongCarousel() {
  const songs = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      className="border"
    >
      <CarouselContent>
        {songs
          ? songs.map((song) => (
              <CarouselItem key={song.videoId} className="basis-1/2.1">
                <a
                  href={youtubeMusicUrl(song.videoId)}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <SongCard song={song} />
                </a>
              </CarouselItem>
            ))
          : // Same size as a SongCard, so nothing shifts when the songs appear.
            Array.from({ length: SHOWN }, (_, i) => (
              <CarouselItem key={i} className="basis-1/2.1" aria-hidden>
                <div className="w-24 sm:w-36 aspect-square bg-muted" />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
