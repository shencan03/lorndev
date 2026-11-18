import Image from "next/image";
import { cn } from "@/lib/utils";
import { shuffled } from "@/app/lib/shuffle";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import { getMovie } from "@/app/lib/tmdb/getMovie";
import { getFavoriteSeries } from "@/app/lib/tmdb/getFavoriteSeries";
import { LIKED_SONGS } from "@/app/lib/ytmusic/getSong";
import styles from "@/app/ui/home-hero.module.css";

const COLUMNS = 4;
const ROWS = 4;

type Tile = { src: string; square: boolean };

// Posters from the TV list and the movie catalogue, with one album cover per column.
// Rendered at build, so each deploy gets a fresh collage; a failed fetch just
// leaves fewer posters.
async function collage(): Promise<Tile[][]> {
  const [series, movies] = await Promise.allSettled([
    getFavoriteSeries(),
    Promise.all(MOVIES.map(getMovie)),
  ]);
  const posters = shuffled([
    ...(series.status === "fulfilled"
      ? series.value.map((tv) => tv.poster_path)
      : []),
    ...(movies.status === "fulfilled"
      ? movies.value.map((movie) => movie.poster_path)
      : []),
  ]);
  const songs = shuffled(LIKED_SONGS.map((song) => song.thumbnail));

  return Array.from({ length: COLUMNS }, (_, column) =>
    Array.from({ length: ROWS }, (_, row): Tile | undefined => {
      const square = row === (column + 1) % ROWS;
      const src = square ? songs.pop() : posters.pop();
      return src ? { src, square } : undefined;
    }).filter((tile) => tile !== undefined),
  );
}

export default async function HomeHero({ title }: { title: string }) {
  const columns = await collage();

  return (
    <section className={styles.hero}>
      <div className={styles.collage} aria-hidden>
        {columns.map((tiles, i) => (
          <div key={i} className={styles.column}>
            {tiles.map((tile) => (
              <div
                key={tile.src}
                className={cn(styles.tile, tile.square && styles.square)}
              >
                <Image src={tile.src} alt="" fill sizes="200px" unoptimized />
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className={cn("shell", styles.copy)}>
        <h1 className={cn("type-display", styles.title)}>{title}</h1>
      </div>
    </section>
  );
}
