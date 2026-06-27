"use server";

import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";

export async function signin(formdata: FormData) {
  const credentials = {
    email: formdata.get("email") as string,
    password: formdata.get("password") as string,
  };

  await auth.api.signInEmail({
    body: {
      email: credentials.email,
      password: credentials.password,
    },
  });
}

export async function logout() {
  await auth.api.signOut({
    headers: await headers(),
  });
}
