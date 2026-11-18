import type { Metadata } from "next";
import CurationReel, { type Shelf } from "@/app/ui/curation-reel";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import { getMovie } from "@/app/lib/tmdb/getMovie";
import { getFavoriteSeries } from "@/app/lib/tmdb/getFavoriteSeries";
import { getFavoriteGames } from "@/app/lib/igdb/getFavoriteGames";
import { LIKED_SONGS, youtubeMusicUrl } from "@/app/lib/ytmusic/getSong";

const description = "Songs, movies, TV shows and games I'd like to share";

export const metadata: Metadata = {
  title: "curation",
  description,
  alternates: { canonical: "/curation" },
  // A page's openGraph replaces the layout's wholesale, so restate the base.
  openGraph: {
    siteName: "lorndev",
    type: "website",
    locale: "en_US",
    url: "/curation",
    title: "curation · lorndev",
    description,
  },
};

const withYear = (noun: string, year?: number) =>
  year ? `${noun}, ${year}` : noun;

export default async function Curation() {
  const [series, movies, games] = await Promise.all([
    getFavoriteSeries(),
    Promise.all(MOVIES.map(getMovie)),
    getFavoriteGames(),
  ]);

  const shelves: Shelf[] = [
    {
      id: "tv",
      label: "TV",
      items: series.map((tv) => ({
        key: tv.url,
        title: tv.name,
        meta: withYear("TV series", tv.year),
        href: tv.url,
        image: tv.poster_path,
      })),
    },
    {
      id: "movies",
      label: "Movies",
      items: movies.map((movie) => ({
        key: movie.url,
        title: movie.title,
        meta: withYear("Movie", movie.year),
        href: movie.url,
        image: movie.poster_path,
      })),
    },
    {
      id: "games",
      label: "Games",
      items: games.map((game) => ({
        key: game.url,
        title: game.name,
        meta: withYear("Game", game.year),
        href: game.url,
        image: game.cover,
      })),
    },
    {
      id: "songs",
      label: "Songs",
      square: true,
      max: 24,
      items: LIKED_SONGS.map((song) => ({
        key: song.videoId,
        title: song.title,
        meta: `Song by ${song.artists}`,
        href: youtubeMusicUrl(song.videoId),
        image: song.thumbnail,
      })),
    },
  ];

  return <CurationReel shelves={shelves} initial="movies" />;
}
