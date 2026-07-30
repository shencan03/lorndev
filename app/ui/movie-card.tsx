import Image from "next/image";
import { Movie } from "@/app/lib/definitions";

export default async function MovieCard({ movie }: { movie: Movie }) {
  return (
    <div className="w-36 relative aspect-[2/3]">
      <Image
        src={movie.poster_path}
        fill={true}
        alt={`Poster art for ${movie.title}`}
        className="object-cover not-prose"
      />
    </div>
  );
}
