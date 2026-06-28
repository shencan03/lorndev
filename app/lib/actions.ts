"use server";

import { auth } from "@/app/lib/auth";
import { isAPIError } from "better-auth/api";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";

const signinSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export async function signin(prevState: any, formdata: FormData) {
  const credentials = signinSchema.safeParse({
    email: formdata.get("email"),
    password: formdata.get("password"),
  });

  if (!credentials.success) {
    return { message: "the fuck" };
  }

  try {
    await auth.api.signInEmail({
      body: {
        email: credentials.data.email,
        password: credentials.data.password,
      },
      headers: await headers(),
    });
  } catch (err) {
    if (isAPIError(err)) {
      return {
        message: err.message,
      };
    }
  }

  redirect("/");
}

export async function signout() {
  await auth.api.signOut({
    headers: await headers(),
  });

  redirect("/");
}

export async function getSession() {
  const session = auth.api.getSession({
    headers: await headers(),
  });

  return session;
}
