"use client";

import { getLastPlayed } from "@/app/lib/last-played";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import LastPlayedCardSkeleton from "@/app/ui/LastPlayedCardSkeletion";

export default function LastPlayedCard({ className }: { className?: string }) {
  const { data, isLoading } = useSWR("lastplayed", getLastPlayed, {
    refreshInterval: 300000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <LastPlayedCardSkeleton />;
  const { title, url, thumbnailurl, artists, album } = data!;
  return (
    <div className={`flex items-center gap-x-2 px-2 ${className}`}>
      <Link href={url} className="border-r shrink-0">
        <Image
          src={thumbnailurl}
          alt="small thumbnail of lastplayed song"
          width={60}
          height={60}
          className="w-[32px] h-[32px] sm:w-[60px] sm:h-[60px] pr-1"
        />
      </Link>

      <section>
        <Link
          className="text-sm tracking-tight text-ellipsis sm:text-lg line-clamp-1"
          href={url}
        >
          {title}
        </Link>
        <section className="flex max-w-24 sm:max-w-none">
          {artists
            ? artists.map((artist) => {
                return artist.url ? (
                  <Link
                    className="text-xs line-clamp-1 sm:text-base sm:line-clamp-none text-gray-400"
                    key={artist.title}
                    href={artist.url}
                  >
                    {artist.title}
                  </Link>
                ) : (
                  <span className="text-xs sm:text-base line-clamp-1">
                    {artist.title}
                  </span>
                );
              })
            : null}
          {album ? (
            <Link className="hidden sm:block text-base" href={album.url}>
              {album.title}
            </Link>
          ) : null}
        </section>
      </section>
    </div>
  );
}
