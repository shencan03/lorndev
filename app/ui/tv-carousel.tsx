import ShuffledCarousel from "@/app/ui/shuffled-carousel";
import TVCard from "@/app/ui/tv-card";
import { getFavoriteSeries } from "@/app/lib/tmdb/getFavoriteSeries";

export default async function TVCarousel() {
  const tvs = await getFavoriteSeries();

  return (
    <ShuffledCarousel
      id="tv"
      placeholderClassName="aspect-[2/3]"
      items={tvs.map((tv) => ({
        key: tv.url,
        href: tv.url,
        card: <TVCard tv={tv} />,
      }))}
    />
  );
}
