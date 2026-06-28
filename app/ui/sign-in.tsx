"use client";

import Form from "next/form";
import { useActionState } from "react";
import { signin } from "@/app/lib/actions";

const initialState = {
  message: "",
};

export default function SigninForm() {
  const [state, formAction, pending] = useActionState(signin, initialState);

  return (
    <Form action={formAction}>
      <label htmlFor="email">Email</label>
      <input type="text" name="email" required />
      <label htmlFor="password">Password</label>
      <input type="password" name="password" required />
      {state?.message && <p aria-live="polite">{state?.message}</p>}
      <button type="submit" disabled={pending}>
        Signin
      </button>
    </Form>
  );
}
