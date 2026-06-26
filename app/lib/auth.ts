"use server";

import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { passkey } from "@better-auth/passkey";
import { client, db } from "@/app/lib/db";

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    client,
  }),
  plugins: [
    passkey({
      registration: {
        requireSession: false,
      },
    }),
  ],
});
