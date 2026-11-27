"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { LastPlayedSong } from "@/app/api/last-played/route";
import styles from "@/app/ui/last-played.module.css";

// The record turns only while the song is new, i.e. probably still playing.
const FRESH_MS = 90 * 60 * 1000;
const DAY_MS = 24 * 60 * 60 * 1000;

type Song = LastPlayedSong & { fresh: boolean; when: string };

/** "playing now", "last played today", "… yesterday", "… 3 days ago". */
function playedWhen(seenAt: string, now: number): string {
  const seen = new Date(seenAt);
  if (now - seen.getTime() < FRESH_MS) return "playing now";
  const startOf = (t: number) => new Date(t).setHours(0, 0, 0, 0);
  const days = Math.round((startOf(now) - startOf(seen.getTime())) / DAY_MS);
  if (days <= 0) return "last played today";
  if (days === 1) return "last played yesterday";
  return `last played ${days} days ago`;
}

/** A round label cut from the cover, on a grooved disc. */
function Record({ art, className }: { art: string | null; className: string }) {
  return (
    <span className={cn(styles.record, className)} aria-hidden>
      {art && (
        // eslint-disable-next-line @next/next/no-img-element -- tiny, already sized
        <img
          src={art}
          alt=""
          // googleusercontent refuses some referrers (localhost, for one).
          referrerPolicy="no-referrer"
        />
      )}
    </span>
  );
}

/**
 * The song last played on YouTube Music, on the home page: a small record centred in the
 * header that opens a card (a native popover: tap outside or Esc closes it). Fetched after
 * load so the page stays static.
 */
export default function LastPlayed() {
  const home = usePathname() === "/";
  const [song, setSong] = useState<Song | null>(null);

  useEffect(() => {
    if (!home) return;
    const controller = new AbortController();
    fetch("/api/last-played", { signal: controller.signal })
      .then((res) => (res.status === 200 ? res.json() : null))
      .then((data: LastPlayedSong | null) => {
        if (!data) return setSong(null);
        const now = Date.now();
        setSong({
          ...data,
          fresh: now - Date.parse(data.seenAt) < FRESH_MS,
          when: playedWhen(data.seenAt, now),
        });
      })
      .catch(() => {});
    return () => controller.abort();
  }, [home]);

  if (!home || !song) return <span className={styles.slot} />;

  return (
    <span className={styles.slot}>
      <button
        type="button"
        popoverTarget="last-played"
        className={styles.trigger}
        aria-label={`Last played song: ${song.title}`}
      >
        <span className={styles.mini} aria-hidden>
          <Record
            art={song.art}
            className={cn(styles.small, song.fresh && styles.spinning)}
          />
          <span className={styles.miniCover}>
            {song.art && (
              // eslint-disable-next-line @next/next/no-img-element -- already sized
              <img src={song.art} alt="" referrerPolicy="no-referrer" />
            )}
          </span>
        </span>
      </button>

      <div id="last-played" popover="auto" className={styles.card}>
        <a
          href={song.href}
          target="_blank"
          rel="noreferrer noopener"
          className={styles.sleeve}
          tabIndex={-1}
          aria-hidden
        >
          <Record
            art={song.art}
            className={cn(styles.large, song.fresh && styles.spinning)}
          />
          <span className={styles.cover}>
            {song.art && (
              // eslint-disable-next-line @next/next/no-img-element -- already sized
              <img src={song.art} alt="" referrerPolicy="no-referrer" />
            )}
          </span>
        </a>
        <div className={styles.info}>
          <a
            href={song.href}
            target="_blank"
            rel="noreferrer noopener"
            className={cn("type-display", styles.title)}
          >
            {song.title}
          </a>
          {song.artists && <p className={styles.artist}>{song.artists}</p>}
          <p className={styles.when}>{song.when}</p>
          <a
            href={song.href}
            target="_blank"
            rel="noreferrer noopener"
            className={styles.open}
          >
            open in YouTube Music
          </a>
        </div>
      </div>
    </span>
  );
}
