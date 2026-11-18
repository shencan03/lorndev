import ShuffledCarousel from "@/app/ui/shuffled-carousel";
import GameCard from "@/app/ui/game-card";
import { getFavoriteGames } from "@/app/lib/igdb/getFavoriteGames";

export default async function GameCarousel() {
  const games = await getFavoriteGames();

  return (
    <ShuffledCarousel
      id="games"
      placeholderClassName="aspect-[2/3]"
      items={games.map((game) => ({
        key: game.url,
        href: game.url,
        card: <GameCard game={game} />,
      }))}
    />
  );
}
