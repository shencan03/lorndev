import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { shuffled } from "@/app/lib/shuffle";
import { allPosts } from "@/app/lib/posts";
import { MOVIES } from "@/app/lib/tmdb/catalogue/movie";
import { getMovie } from "@/app/lib/tmdb/getMovie";
import { getFavoriteSeries } from "@/app/lib/tmdb/getFavoriteSeries";
import { getFavoriteGames } from "@/app/lib/igdb/getFavoriteGames";
import { getFavoriteBooks } from "@/app/lib/googlebooks/getFavoriteBooks";
import { LIKED_SONGS } from "@/app/lib/ytmusic/getSong";
import HomeWhy from "@/app/ui/home-why";
import styles from "@/app/ui/home-stack.module.css";

type Cover = { src: string; square?: boolean };

const pick = <T,>(items: readonly T[]): T | undefined => shuffled(items)[0];

// One cover from each shelf, picked at build so every deploy deals a new hand.
// A shelf whose fetch fails is just left out of the fan.
async function coverFan(): Promise<Cover[]> {
  const [series, movies, games, books] = await Promise.allSettled([
    getFavoriteSeries(),
    Promise.all(MOVIES.map(getMovie)),
    getFavoriteGames(),
    getFavoriteBooks(),
  ]);
  const song = pick(LIKED_SONGS);
  const covers: (Cover | undefined)[] = [
    song && { src: song.thumbnail, square: true },
    games.status === "fulfilled" ? cover(pick(games.value)?.cover) : undefined,
    series.status === "fulfilled"
      ? cover(pick(series.value)?.poster_path)
      : undefined,
    books.status === "fulfilled" ? cover(pick(books.value)?.cover) : undefined,
    movies.status === "fulfilled"
      ? cover(pick(movies.value)?.poster_path)
      : undefined,
  ];
  return covers.filter((c) => c !== undefined);
}

const cover = (src: string | undefined): Cover | undefined =>
  src ? { src } : undefined;

/** Position in a fan of n, from -1 (left) to 1 (right). */
const spread = (i: number, n: number) =>
  ({ "--i": n > 1 ? (2 * i) / (n - 1) - 1 : 0 }) as CSSProperties;

function Band({
  href,
  word,
  sub,
  art,
}: {
  href: string;
  word: string;
  sub: string;
  art: ReactNode;
}) {
  return (
    <Link href={href} prefetch={false} className={styles.band}>
      <div className={styles.label}>
        <h2 className={cn("type-display", styles.word)}>{word}</h2>
        <span className={styles.sub}>{sub}</span>
      </div>
      <div className={styles.art} aria-hidden>
        {art}
      </div>
    </Link>
  );
}

/** The home page: three equal ways in, with the essay folded under "why". */
export default async function HomeStack({ essay }: { essay: ReactNode }) {
  const [covers, posts] = await Promise.all([coverFan(), allPosts()]);
  const latest = posts[0];

  return (
    <div className={cn("shell", styles.stack)}>
      <Band
        href="/curation"
        word="curation"
        sub="songs, films, shows, books, games"
        art={
          <span className={styles.fan}>
            {covers.map((c, i) => (
              <span
                key={c.src}
                className={cn(styles.cover, c.square && styles.square)}
                style={spread(i, covers.length)}
              >
                <Image src={c.src} alt="" fill sizes="80px" unoptimized />
              </span>
            ))}
          </span>
        }
      />
      <Band
        href="/blog"
        word="blog"
        sub="dev problems, and thoughts on things I care about"
        art={
          <span className={styles.pages}>
            <span className={styles.page} />
            <span className={styles.page} />
            <span className={styles.page}>
              {latest && <b className={styles.pageTitle}>{latest.title}</b>}
              <i />
              <i />
              <i />
              <i />
              <i />
            </span>
          </span>
        }
      />
      <HomeWhy>{essay}</HomeWhy>
    </div>
  );
}
