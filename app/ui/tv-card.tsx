import Image from "next/image";
import { TV } from "@/app/lib/definitions";

export default async function TVCard({ tv }: { tv: TV }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-[2/3]">
      <Image
        src={tv.poster_path}
        fill={true}
        alt={`Poster art for ${tv.name}`}
        className="object-cover not-prose"
      />
    </div>
  );
}
