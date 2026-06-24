"use client";

import { getLastPlayed } from "@/app/lib/last-played";
import useSWR from "swr";
import Image from "next/image";
import Link from "next/link";
import LastPlayedCardSkeleton from "@/app/ui/LastPlayedCardSkeletion";

export default function LastPlayedCard() {
  const { data, isLoading } = useSWR("lastplayed", getLastPlayed, {
    refreshInterval: 3000,
    revalidateOnFocus: false,
  });

  if (isLoading) return <LastPlayedCardSkeleton />;
  const { title, url, thumbnailurl, artists, album } = data!;
  return (
    <div className="flex justify-start items-center">
      <Image
        src={thumbnailurl}
        alt="small thumbnail of lastplayed song"
        width={60}
        height={60}
      ></Image>
      <section>
        <h3>
          <Link href={url}>{title}</Link>
        </h3>
        <section>
          {artists
            ? artists.map((artist) => {
                return artist.url ? (
                  <Link key={artist.title} href={artist.url}>
                    {artist.title}
                  </Link>
                ) : (
                  <span>{artist.title}</span>
                );
              })
            : null}
          <span> | </span>
          <Link href={album.url}>{album.title}</Link>
        </section>
      </section>
    </div>
  );
}
