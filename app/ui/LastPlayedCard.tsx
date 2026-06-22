import { getLastPlayed } from "@/app/lib/last-played";
import Image from "next/image";
import { LastPlayed } from "@/app/lib/definitions";
import Link from "next/link";

export default async function LastPlayedCard() {
  const { title, url, thumbnailurl, artists, album }: LastPlayed =
    await getLastPlayed();

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
