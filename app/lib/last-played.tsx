"use server";

import {
  YT_MUSIC_ORIGIN,
  YT_MUSIC_VIDEO_ENDPOINT,
  YT_MUSIC_ARTIST_ENDPOINT,
  YT_MUSIC_ALBUM_ENDPOINT,
} from "@/app/lib/constants";
import { LastPlayed } from "@/app/lib/definitions";
import crypto from "crypto";

function getAuthorizationHeader(): string {
  const sha1 = crypto.createHash("sha1");
  const date = new Date();
  const unixTimestamp = String(date.getTime()).substring(0, 10);
  const sapisid = process.env.YT_MUSIC_SAPISID;
  const origin = YT_MUSIC_ORIGIN;
  const baseAuth = `${sapisid} ${origin}`;

  const encoder = new TextEncoder();
  const sha1_data = encoder.encode(`${unixTimestamp} ${baseAuth}`);
  sha1.update(sha1_data);

  return `SAPISIDHASH ${unixTimestamp}_${sha1.digest("hex")}`;
}

function getBodyContext() {
  const date = new Date();
  return `1.${date.toISOString().split("T")[0].split("-").join("")}.01.00`;
}

async function fetchLastPlayed() {
  const url = process.env.YT_MUSIC_URL!;

  const headers = JSON.parse(process.env.YT_MUSIC_HEADERS!);
  headers.authorization = getAuthorizationHeader();

  const body = JSON.parse(process.env.YT_MUSIC_BODY!);
  body.context.client.clientVersion = getBodyContext();

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return data;
}

function formatLastPlayed(data: any) {
  const origin = YT_MUSIC_ORIGIN;
  const videoEndpoint = YT_MUSIC_VIDEO_ENDPOINT;
  const artistEndpoint = YT_MUSIC_ARTIST_ENDPOINT;
  const albumEndpoint = YT_MUSIC_ALBUM_ENDPOINT;

  const lastPlayed =
    data.contents.singleColumnBrowseResultsRenderer.tabs[0].tabRenderer.content
      .sectionListRenderer.contents[0].musicShelfRenderer.contents[0]
      .musicResponsiveListItemRenderer;

  const lastPlayedThumbNailUrl =
    lastPlayed.thumbnail.musicThumbnailRenderer.thumbnail.thumbnails[0].url;

  const lastPlayedTitle =
    lastPlayed.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text
      .runs[0].text;
  const lastPlayedUrl = `${origin}/${videoEndpoint}${
    lastPlayed.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text
      .runs[0].navigationEndpoint.watchEndpoint.videoId
  }`;

  const isLastPlayedVideo =
    lastPlayed.flexColumns[0].musicResponsiveListItemFlexColumnRenderer.text
      .runs[0].navigationEndpoint.watchEndpoint
      .watchEndpointMusicSupportedConfigs.watchEndpointMusicConfig
      .musicVideoType === "MUSIC_VIDEO_TYPE_UGC";

  const lastPlayedAlbum = isLastPlayedVideo
    ? lastPlayed.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text
        .runs[0]
    : null;

  const parsedAlbum = isLastPlayedVideo
    ? {
        title: lastPlayedAlbum.text,
        url: `${origin}/${albumEndpoint}/${lastPlayedAlbum.navigationEndpoint.browseEndpoint.browseId}`,
      }
    : null;

  const lastPlayedArtists = isLastPlayedVideo
    ? null
    : lastPlayed.flexColumns[1].musicResponsiveListItemFlexColumnRenderer.text
        .runs;

  const parsedArtists = isLastPlayedVideo
    ? null
    : lastPlayedArtists.map((artist: any) => {
        const urlValid = artist.navigationEndpoint;
        const url =
          urlValid &&
          `${origin}/${artistEndpoint}/${artist.navigationEndpoint.browseEndpoint.browseId}`;
        return {
          title: artist.text,
          url: urlValid ? url : null,
        };
      });

  return {
    title: lastPlayedTitle,
    url: lastPlayedUrl,
    thumbnailurl: lastPlayedThumbNailUrl,
    album: parsedAlbum,
    artists: parsedArtists,
  };
}

export async function getLastPlayed(): Promise<LastPlayed> {
  const data = await fetchLastPlayed();
  // writeJsonResponse(data);
  const { title, url, thumbnailurl, artists, album } = formatLastPlayed(data);

  return {
    title,
    url,
    thumbnailurl,
    artists,
    album,
  };
}
