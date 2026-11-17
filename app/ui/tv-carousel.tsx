import ShuffledCarousel from "@/app/ui/shuffled-carousel";
import { TVs } from "@/app/lib/tmdb/catalogue/tv";
import TVCard from "@/app/ui/tv-card";
import { getTV } from "@/app/lib/tmdb/getTV";

export default async function TVCarousel() {
  const tvs = await Promise.all(TVs.map((query) => getTV(query)));

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
