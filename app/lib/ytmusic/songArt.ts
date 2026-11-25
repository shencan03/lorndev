// Client-safe helpers for liked songs (getSong.ts imports the whole catalogue).

const YT3 = "https://yt3.googleusercontent.com/";
// Album art URLs end in a size, e.g. "=w544-h544-l90-rj" (sometimes "-s-l90-rj").
const SIZED = /=w\d+-h\d+(-s)?-l(\d+)-rj$/;

/**
 * Album art at `size` px, as WebP (`-rw`): the synced URLs ask for 544px JPEGs, about
 * three times the bytes the reel needs. Video thumbnails (i.ytimg.com) pass through.
 */
export function songArt(url: string, size = 400): string {
  return url.replace(SIZED, `=w${size}-h${size}$1-l$2-rw`);
}

export function youtubeMusicUrl(videoId: string): string {
  return `https://music.youtube.com/watch?v=${videoId}`;
}

/**
 * A song as sent to the browser: [videoId, title, artists, art]. The reel shuffles every
 * liked song on each visit, so the page carries them all; dropping what can be rebuilt
 * (keys, the link, the art's host and size) roughly halves that payload. `art` is the
 * yt3 image id when the URL has the usual shape, otherwise the full URL.
 */
export type PackedSong = [string, string, string, string];

export function packSong(song: {
  videoId: string;
  title: string;
  artists: string;
  thumbnail: string;
}): PackedSong {
  const { videoId, title, artists, thumbnail } = song;
  const usual =
    thumbnail.startsWith(YT3) && /=w\d+-h\d+-l90-rj$/.test(thumbnail);
  const art = usual
    ? thumbnail.slice(YT3.length, thumbnail.lastIndexOf("="))
    : songArt(thumbnail);
  return [videoId, title, artists, art];
}

export function unpackSong([videoId, title, artists, art]: PackedSong) {
  return {
    key: videoId,
    title,
    meta: `Song by ${artists}`,
    href: youtubeMusicUrl(videoId),
    image: art.startsWith("https://") ? art : `${YT3}${art}=w400-h400-l90-rw`,
  };
}
