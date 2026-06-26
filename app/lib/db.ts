"use server";

import { MongoClient } from "mongodb";

export const client = new MongoClient(process.env.MONGODB_URI!, {
  tls: true,
});

export const db = client.db("lorndev");
