// Writes all of your YouTube Music liked songs to app/lib/ytmusic/catalogue/liked.json.
// The site build only reads that file, so the build never needs the Google session cookie.
//
//   node scripts/sync-liked-songs.mts
//
// YTM_AUTH_FILE  browser auth file from `npx yt-music-node browser` (default: browser.json)
// SONG_LIMIT     keep only this many of the most recent likes (default: the whole library)
//
// Exits non-zero if the auth file is missing or no longer signs in, or if no songs come back,
// so an expired cookie fails loudly and never overwrites the last good list.
import { readFile, writeFile } from "node:fs/promises";
import { YTMusic } from "yt-music-node";

type SongCard = {
  videoId: string;
  title: string;
  artists: string;
  thumbnail: string;
};

const OUT_FILE = new URL("../app/lib/ytmusic/catalogue/liked.json", import.meta.url);
const authFile = process.env.YTM_AUTH_FILE || "browser.json";
const limit = process.env.SONG_LIMIT ? Number(process.env.SONG_LIMIT) : null;

// Thumbnail URLs end in a size like "=w120-h120-l90-rj"; ask for a larger one.
function largeThumbnail(url: string) {
  return url.replace(/=w\d+-h\d+/, "=w544-h544");
}

async function main() {
  let auth: string;
  try {
    auth = await readFile(authFile, "utf8");
  } catch {
    throw new Error(
      `Cannot read ${authFile}. Create it with: npx yt-music-node browser --file ${authFile}`,
    );
  }

  const ytm = new YTMusic({ auth, language: "en", location: "US", retry: 2 });

  // Fails with a clear error if the cookie has expired, before anything is written.
  const account = await ytm.getAccountInfo().catch((error: unknown) => {
    throw new Error(
      `${authFile} no longer signs in; refresh it with: npx yt-music-node browser --file ${authFile}`,
      { cause: error },
    );
  });
  if (!account.accountName) {
    throw new Error(`${authFile} no longer signs in (no account name returned)`);
  }

  // limit: null pages through the whole "Liked music" playlist.
  const liked = await ytm.getLikedSongs({ limit });

  const seen = new Set<string>();
  const songs: SongCard[] = [];
  for (const track of liked.tracks) {
    const thumbnail = track.thumbnails?.at(-1)?.url;
    if (!track.isAvailable || !track.videoId || !track.title || !thumbnail) continue;
    if (seen.has(track.videoId)) continue;
    seen.add(track.videoId);
    songs.push({
      videoId: track.videoId,
      title: track.title,
      artists: (track.artists ?? []).map((artist) => artist.name).join(", "),
      thumbnail: largeThumbnail(thumbnail),
    });
    if (limit != null && songs.length >= limit) break;
  }

  if (songs.length === 0) {
    throw new Error("No liked songs returned; keeping the existing list");
  }

  const next = JSON.stringify(songs, null, 2) + "\n";
  const previous = await readFile(OUT_FILE, "utf8").catch(() => "");
  if (next === previous) {
    console.log(`No change: ${songs.length} songs`);
    return;
  }
  await writeFile(OUT_FILE, next);
  console.log(`Wrote ${songs.length} songs to ${OUT_FILE.pathname}`);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
