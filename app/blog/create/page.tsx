import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import NewPost from "@/app/ui/new-post";

export default async function Create() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>You are not lorndev.</div>;
  }
  return <NewPost />;
}
