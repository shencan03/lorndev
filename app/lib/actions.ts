"use server";

import { promises } from "fs";
import crypto from "crypto";

export async function writeJsonResponse(res: JSON) {
  const data = JSON.stringify(res);
  try {
    await promises.writeFile(`${process.cwd()}/response.json`, data);
  } catch (err) {
    throw new Error(err);
  }
}

export async function getLastPlayed() {
  const url = process.env.YT_MUSIC_URL!;

  const headers = JSON.parse(process.env.YT_MUSIC_HEADERS!);

  const sha1 = crypto.createHash("sha1");
  const date = new Date();
  const unixTimestamp = String(date.getTime()).substring(0, 10);
  const sapisid = process.env.YT_MUSIC_SAPISID;
  const origin = process.env.YT_MUSIC_ORIGIN;
  const baseAuth = `${sapisid} ${origin}`;

  const encoder = new TextEncoder();
  const sha1_data = encoder.encode(`${unixTimestamp} ${baseAuth}`);
  sha1.update(sha1_data);

  const authorization = `SAPISIDHASH ${unixTimestamp}_${sha1.digest("hex")}`;
  headers.authorization = authorization;

  const body = JSON.parse(process.env.YT_MUSIC_BODY!);
  body.context.client.clientVersion = `1.${date.toISOString().split("T")[0].split("-").join("")}.01.00`;

  const res = await fetch(url, {
    method: "POST",
    headers: headers,
    body: JSON.stringify(body),
  });

  const data = await res.json();

  return "hey";
}
