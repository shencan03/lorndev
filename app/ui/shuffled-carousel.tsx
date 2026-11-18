"use client";

import { useSyncExternalStore, type ReactNode } from "react";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";

export type ShuffledItem = {
  key: string;
  href: string;
  card: ReactNode;
};

// Fisher–Yates over a copy, stopping once the first `count` slots are filled.
function pickRandom<T>(items: T[], count: number): T[] {
  const pool = items.slice();
  for (let i = 0; i < count; i++) {
    const j = i + Math.floor(Math.random() * (pool.length - i));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

// The pages are static, so the shuffle has to happen in the browser. The server snapshot is
// null, which renders placeholders; after hydration React switches to the client snapshot.
// Each carousel's pick is computed once per page load and cached by `id` so the snapshot
// stays stable between renders.
const picks = new Map<string, ShuffledItem[]>();
const subscribe = () => () => {};

export default function ShuffledCarousel({
  id,
  items,
  max,
  placeholderClassName,
}: {
  id: string;
  items: ShuffledItem[];
  // Show at most this many; omit to show every item.
  max?: number;
  // Same size as the card, so nothing shifts when the items appear.
  placeholderClassName: string;
}) {
  const shown = Math.min(max ?? items.length, items.length);
  const picked = useSyncExternalStore(
    subscribe,
    () => {
      let pick = picks.get(id);
      if (!pick) {
        pick = pickRandom(items, shown);
        picks.set(id, pick);
      }
      return pick;
    },
    () => null,
  );

  return (
    <Carousel
      opts={{
        dragFree: true,
      }}
      className="border"
    >
      <CarouselContent>
        {picked
          ? picked.map((item) => (
              <CarouselItem key={item.key} className="basis-1/2.1">
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.card}
                </a>
              </CarouselItem>
            ))
          : Array.from({ length: shown }, (_, i) => (
              <CarouselItem key={i} className="basis-1/2.1" aria-hidden>
                <div
                  className={`w-24 sm:w-36 bg-muted ${placeholderClassName}`}
                />
              </CarouselItem>
            ))}
      </CarouselContent>
    </Carousel>
  );
}
