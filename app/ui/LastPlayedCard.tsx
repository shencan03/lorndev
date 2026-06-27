"use client";

import { getLastPlayed } from "@/app/lib/last-played";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import LastPlayedCardSkeleton from "@/app/ui/LastPlayedCardSkeletion";

export default function LastPlayedCard({ className }: { className?: string }) {
  const { data, isLoading } = useSWR("lastplayed", getLastPlayed, {
    refreshInterval: 3000000,
    revalidateOnFocus: false,
    dedupingInterval: 9000,
  });

  if (isLoading) return <LastPlayedCardSkeleton />;
  const { title, url, thumbnailurl, artist, album } = data!;
  return (
    <div className={`flex items-center gap-x-3 sm:gap-x-4 px-2 ${className}`}>
      <Link href={url} className="shrink-0 group" aria-label="Go to track">
        <div className="relative w-[48px] h-[48px] sm:w-[64px] sm:h-[64px] animate-spin-slow group-hover:[animation-play-state:paused]">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/20 via-white/5 to-white/15" />
          <div className="absolute inset-[3px] sm:inset-[4px] rounded-full overflow-hidden">
            <Image
              src={thumbnailurl}
              alt={`Album art for ${title}`}
              width={120}
              height={120}
              className="w-full h-full object-cover"
            />
          </div>

          <div
            className="absolute inset-[3px] sm:inset-[4px] rounded-full pointer-events-none opacity-30"
            style={{
              background:
                "conic-gradient(from 0deg, transparent, rgba(255,100,100,0.3), transparent, rgba(100,200,255,0.3), transparent, rgba(100,255,150,0.3), transparent)",
            }}
          />

          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[8px] h-[8px] sm:w-[10px] sm:h-[10px] rounded-full bg-background ring-1 ring-white/10" />
          </div>
        </div>
      </Link>

      <section className="min-w-0">
        <span className="block text-[10px] sm:text-xs uppercase tracking-widest text-gray-500 leading-none mb-0.5">
          Last Played
        </span>
        <Link
          className="block text-sm tracking-tight sm:text-lg leading-tight line-clamp-1 hover:underline"
          href={url}
        >
          {title}
        </Link>
        <section className="flex max-w-24 sm:max-w-none">
          {artist ? (
            artist.url ? (
              <Link
                key={artist.title}
                href={artist.url}
                className="text-xs line-clamp-1 sm:text-base sm:line-clamp-none text-gray-400 hover:text-gray-200 transition-colors"
              >
                {artist.title}
              </Link>
            ) : (
              <span className="text-xs sm:text-base line-clamp-1 text-gray-400 hidden sm:block">
                {artist.title}
              </span>
            )
          ) : null}
          {/* {artists
            ? artists.map((artist) => {
                return artist.url ? (
                  <Link
                    className="text-xs line-clamp-1 sm:text-base sm:line-clamp-none text-gray-400 hover:text-gray-200 transition-colors hidden sm:block"
                    key={artist.title}
                    href={artist.url}
                  >
                    {artist.title}
                  </Link>
                ) : (
                  <span className="text-xs sm:text-base line-clamp-1 text-gray-400 hidden sm:block">
                    {artist.title}
                  </span>
                );
              })
            : null} */}
          {album ? (
            <Link
              className="hidden sm:block text-base text-gray-400 hover:text-gray-200 transition-colors"
              href={album.url}
            >
              {album.title}
            </Link>
          ) : null}
        </section>
      </section>
    </div>
  );
}
