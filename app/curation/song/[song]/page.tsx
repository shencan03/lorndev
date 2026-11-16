import { SONGS } from "@/app/lib/ytmusic/catalogue/song";
import { getSong } from "@/app/lib/ytmusic/getSong";
import Image from "next/image";

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(SONGS).map((query) => ({
    song: query,
  }));
}

export default async function Page({
  params,
}: {
  params: Promise<{ song: string }>;
}) {
  const { song } = await params;
  const reviewObj = await getSong(decodeURIComponent(song), "review");
  return (
    <div className="flex">
      <a
        href={`https://music.youtube.com/watch?v=${reviewObj.videoId}`}
        className="flex w-36 relative aspect-square shrink-0"
      >
        <Image
          src={reviewObj.thumbnail}
          alt={`Cover art for ${reviewObj.title} by ${reviewObj.artists}`}
          fill={true}
          className="object-cover not-prose"
        />
      </a>
      <p>{reviewObj.review}</p>
    </div>
  );
}
