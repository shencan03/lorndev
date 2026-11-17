import CoverImage from "@/app/ui/cover-image";
import type { SongCard } from "@/app/lib/definitions";

export default function SongCard({ song }: { song: SongCard }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-square bg-muted">
      <CoverImage
        src={song.thumbnail}
        alt={`Cover art for ${song.title} by ${song.artists}`}
      />
    </div>
  );
}
