import {
  COLLAGE_SLOTS,
  type Cover,
  ogContentType,
  ogSize,
  renderCollageImage,
} from "@/app/lib/og";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import { TVs } from "@/app/lib/tmdb/catalogue/tv";
import { getMovie } from "@/app/lib/tmdb/getMovie";
import { getTV } from "@/app/lib/tmdb/getTV";
import { LIKED_SONGS } from "@/app/lib/ytmusic/getSong";

export const alt = "lorndev/curation — songs, movies and TV shows";
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
  // One spare of each shape, in case an image fails to load.
  const posterResults = await Promise.allSettled([
    ...sample(TVs, 1).map((q) => getTV(q).then((r) => r.poster_path)),
    ...sample(MOVIES, COLLAGE_SLOTS.poster).map((m) =>
      getMovie(m).then((r) => r.poster_path),
    ),
  ]);
  const posters = posterResults.flatMap((r) =>
    r.status === "fulfilled" ? [r.value] : [],
  );

  const covers: Cover[] = [
    ...sample(posters, posters.length).map((url) => ({
      url,
      shape: "poster" as const,
    })),
    ...sample(LIKED_SONGS, COLLAGE_SLOTS.square + 1).map((s) => ({
      url: s.thumbnail,
      shape: "square" as const,
    })),
  ];

  return renderCollageImage({ path: "/curation", covers });
}
