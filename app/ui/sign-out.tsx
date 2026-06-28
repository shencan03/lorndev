import Form from "next/form";
import { signout } from "@/app/lib/actions";
import { getSession } from "@/app/lib/actions";

export default async function Signout() {
  const session = await getSession();

  if (!session) {
    return;
  }

  return (
    <Form action={signout}>
      <button type="submit">signout</button>
    </Form>
  );
}
