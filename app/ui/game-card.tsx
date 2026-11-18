import CoverImage from "@/app/ui/cover-image";
import type { GameCard } from "@/app/lib/definitions";

export default function GameCard({ game }: { game: GameCard }) {
  return (
    <div className="w-24 sm:w-36 relative aspect-[2/3] bg-muted">
      <CoverImage
        src={game.cover}
        alt={`Cover art for ${game.name}`}
        unoptimized
      />
    </div>
  );
}
