import { type Cover, ogContentType, ogSize, renderOgImage } from "@/app/lib/og";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import { TVs } from "@/app/lib/tmdb/catalogue/tv";
import { getMovie } from "@/app/lib/tmdb/getMovie";
import { getTV } from "@/app/lib/tmdb/getTV";
import { LIKED_SONGS } from "@/app/lib/ytmusic/getSong";

export const alt = "lorndev curation — songs, movies and TV shows";
export const size = ogSize;
export const contentType = ogContentType;

// Rendered at build, so each deploy gets a fresh selection.
function sample<T>(items: T[], count: number): T[] {
  const pool = items.slice();
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }
  return pool.slice(0, count);
}

export default async function Image() {
  // The collage holds 4 posters and 5 squares; one poster is a TV show.
  const posters = await Promise.allSettled([
    ...sample(MOVIES, 3).map((m) => getMovie(m).then((r) => r.poster_path)),
    ...sample(TVs, 1).map((q) => getTV(q).then((r) => r.poster_path)),
  ]);

  const covers: Cover[] = [
    ...sample(
      posters.flatMap((p) => (p.status === "fulfilled" ? [p.value] : [])),
      4,
    ).map((url) => ({ url, shape: "poster" as const })),
    ...sample(LIKED_SONGS, 5).map((s) => ({
      url: s.thumbnail,
      shape: "square" as const,
    })),
  ];

  return renderOgImage({
    title: "curation",
    description: "Songs, movies and TV shows I'd like to share",
    path: "/curation",
    covers,
  });
}
