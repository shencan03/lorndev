import { readFile } from "node:fs/promises";
import { z } from "zod";
import { songArt, youtubeMusicUrl } from "@/app/lib/ytmusic/songArt";

// Written hourly by scripts/sync-last-played.mts on the server and mounted into the
// container; read per request so the home page itself can stay static.
const FILE = process.env.LAST_PLAYED_FILE || "/data/last-played.json";

// Past this, the hourly job has stopped working (usually an expired cookie): show nothing
// rather than a song that may be days old.
const STALE_AFTER_MS = 48 * 60 * 60 * 1000;

const LastPlayed = z.object({
  videoId: z.string(),
  title: z.string().min(1),
  artists: z.string(),
  thumbnail: z.url().nullish(),
  seenAt: z.iso.datetime(),
  checkedAt: z.iso.datetime(),
});

export type LastPlayedSong = {
  title: string;
  artists: string;
  /** Square-ish cover, sized for a 28px slot on high-density screens. */
  art: string | null;
  href: string;
  seenAt: string;
};

export const dynamic = "force-dynamic";

export async function GET() {
  const song = await readFile(FILE, "utf8")
    .then((text) => LastPlayed.parse(JSON.parse(text)))
    .catch(() => null);

  if (!song || Date.now() - Date.parse(song.checkedAt) > STALE_AFTER_MS) {
    return new Response(null, {
      status: 204,
      headers: { "Cache-Control": "public, max-age=300" },
    });
  }

  const body: LastPlayedSong = {
    title: song.title,
    artists: song.artists,
    art: song.thumbnail ? songArt(song.thumbnail, 96) : null,
    href: youtubeMusicUrl(song.videoId),
    seenAt: song.seenAt,
  };
  return Response.json(body, {
    headers: {
      "Cache-Control": "public, max-age=300, stale-while-revalidate=3600",
    },
  });
}
