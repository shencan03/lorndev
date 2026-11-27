// Writes the song you last played on YouTube Music to a small JSON file that the running
// site reads at request time (app/api/last-played/route.ts), so refreshing it needs no
// commit and no rebuild.
//
//   node scripts/sync-last-played.mts
//
// YTM_AUTH_FILE      browser auth file from `npx yt-music-node browser` (default: browser.json)
// LAST_PLAYED_FILE   where to write (default: last-played.json)
//
// The history only says which day a song was played ("Today"), so `seenAt` records when this
// script first saw the song at the top. `checkedAt` is the last successful check; the site
// hides the song once that is too old (for example after the cookie expired).
//
// A cookie that no longer signs in is reported as a warning and exits 0: this runs hourly,
// and the daily liked-songs sync already fails loudly on the same cookie. The last good file
// is left as it is.
import { readFile, rename, writeFile } from "node:fs/promises";
import { YTMusic } from "yt-music-node";

type LastPlayed = {
  videoId: string;
  title: string;
  artists: string;
  thumbnail: string | null;
  seenAt: string;
  checkedAt: string;
};

const authFile = process.env.YTM_AUTH_FILE || "browser.json";
const outFile = process.env.LAST_PLAYED_FILE || "last-played.json";

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

  let history: Awaited<ReturnType<typeof ytm.getHistory>>;
  try {
    history = await ytm.getHistory();
  } catch (error) {
    console.warn(
      `::warning::Could not read history with ${authFile} (has the cookie expired?):`,
      error instanceof Error ? error.message : error,
    );
    return;
  }

  const track = history.find((item) => item.videoId && item.title);
  if (!track?.videoId || !track.title) {
    console.warn("::warning::History is empty; keeping the existing file");
    return;
  }

  const previous = await readFile(outFile, "utf8")
    .then((text) => JSON.parse(text) as Partial<LastPlayed>)
    .catch(() => ({}) as Partial<LastPlayed>);

  const now = new Date().toISOString();
  const next: LastPlayed = {
    videoId: track.videoId,
    title: track.title,
    artists: (track.artists ?? []).map((artist) => artist.name).join(", "),
    thumbnail: track.thumbnails?.at(-1)?.url ?? null,
    seenAt:
      previous.videoId === track.videoId && previous.seenAt
        ? previous.seenAt
        : now,
    checkedAt: now,
  };

  // Write beside the target, then rename, so the site never reads a half-written file.
  // (Mount the folder into the container, not the file: a rename replaces the file.)
  const tmp = `${outFile}.tmp`;
  await writeFile(tmp, JSON.stringify(next, null, 2) + "\n", { mode: 0o644 });
  await rename(tmp, outFile);
  console.log(
    previous.videoId === next.videoId
      ? `Still ${next.title}`
      : `Now ${next.title} by ${next.artists}`,
  );
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
