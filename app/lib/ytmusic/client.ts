import { YTMusic } from "yt-music-node";

// Signed out: search needs no account, so the build needs no extra secret.
// Pinned language/location keep results the same locally and in CI.
export const ytm = new YTMusic({ language: "en", location: "US", retry: 2 });
