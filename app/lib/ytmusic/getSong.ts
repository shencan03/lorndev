import liked from "@/app/lib/ytmusic/catalogue/liked.json";
import { REVIEWS } from "@/app/lib/ytmusic/catalogue/song";
import type { SongCard, SongReview } from "@/app/lib/definitions";

// Synced from YouTube Music by scripts/sync-liked-songs.mts; read at build time, no network.
export const LIKED_SONGS: SongCard[] = liked;

export function getSong(videoId: string): SongReview {
  const song = LIKED_SONGS.find((s) => s.videoId === videoId);
  if (!song) {
    throw new Error(`Song ${videoId} is not in liked.json`);
  }
  return { ...song, review: REVIEWS[videoId] ?? "" };
}
