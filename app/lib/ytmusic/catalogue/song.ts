// Reviews keyed by YouTube Music videoId (the `v=` in music.youtube.com/watch?v=…).
// The song list itself comes from liked.json, written by scripts/sync-liked-songs.mts;
// a liked song without an entry here still shows, just without a review.
export const REVIEWS: Record<string, string> = {};
