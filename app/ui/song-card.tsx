import Image from "next/image";
import type { SongCard } from "@/app/lib/definitions";

export default async function SongCard({ song }: { song: SongCard }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-square">
      <Image
        src={song.thumbnail}
        fill={true}
        alt={`Cover art for ${song.title} by ${song.artists}`}
        className="object-cover not-prose"
      />
    </div>
  );
}
