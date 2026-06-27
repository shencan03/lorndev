import Form from "next/form";
import { logout } from "@/app/lib/actions";

export default async function SignOut() {
  return (
    <Form action={logout}>
      <button type="submit">logout</button>
    </Form>
  );
}
