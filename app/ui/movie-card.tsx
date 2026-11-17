import CoverImage from "@/app/ui/cover-image";
import type { MovieCard } from "@/app/lib/definitions";

export default function MovieCard({ movie }: { movie: MovieCard }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-[2/3] bg-muted">
      <CoverImage
        src={movie.poster_path}
        alt={`Poster art for ${movie.title}`}
        unoptimized
      />
    </div>
  );
}
