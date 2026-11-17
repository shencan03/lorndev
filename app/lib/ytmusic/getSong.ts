import liked from "@/app/lib/ytmusic/catalogue/liked.json";
import type { SongCard } from "@/app/lib/definitions";

// Synced from YouTube Music by scripts/sync-liked-songs.mts; read at build time, no network.
export const LIKED_SONGS: SongCard[] = liked;

export function youtubeMusicUrl(videoId: string): string {
  return `https://music.youtube.com/watch?v=${videoId}`;
}
