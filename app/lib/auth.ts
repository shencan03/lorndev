import { betterAuth } from "better-auth";
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { nextCookies } from "better-auth/next-js";
import { i18n } from "@better-auth/i18n";

const client = new MongoClient(process.env.MONGODB_URI!, {
  tls: true,
});
const db = client.db("lorndev");

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies()],
});
