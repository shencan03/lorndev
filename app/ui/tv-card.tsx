import CoverImage from "@/app/ui/cover-image";
import type { TVCard } from "@/app/lib/definitions";

export default function TVCard({ tv }: { tv: TVCard }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-[2/3] bg-muted">
      <CoverImage
        src={tv.poster_path}
        alt={`Poster art for ${tv.name}`}
        unoptimized
      />
    </div>
  );
}
