import { ytm } from "@/app/lib/ytmusic/client";
import { SONGS } from "@/app/lib/ytmusic/catalogue/song";
import type { MediaObj, SongCard, SongReview } from "@/app/lib/definitions";

// Thumbnail URLs end in a size like "=w120-h120-l90-rj"; ask for a larger one.
function largeThumbnail(url: string) {
  return url.replace(/=w\d+-h\d+/, "=w544-h544");
}

export function getSong(query: string, type: "card"): Promise<SongCard>;

export function getSong(query: string, type: "review"): Promise<SongReview>;

export async function getSong(query: string, type: MediaObj) {
  try {
    const [song] = await ytm.search(query, { filter: "songs", limit: 1 });

    if (!song || song.resultType !== "song" || !song.videoId || !song.title) {
      throw new Error(`No YouTube Music song found for "${query}"`);
    }

    const thumbnail = song.thumbnails?.at(-1);
    if (!thumbnail) {
      throw new Error(`No thumbnail for "${query}"`);
    }

    const data: SongCard = {
      title: song.title,
      artists: (song.artists ?? []).map((artist) => artist.name).join(", "),
      thumbnail: largeThumbnail(thumbnail.url),
      videoId: song.videoId,
    };

    if (type === "card") {
      return data;
    }
    return { ...data, review: SONGS[query] };
  } catch (e) {
    console.error(e);
    throw new Error("Failed to fetch song");
  }
}
