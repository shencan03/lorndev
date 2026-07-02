import { getSession } from "@/app/lib/actions";
import { SignoutForm } from "@/app/ui/forms";

export default async function Signout() {
  const session = await getSession();

  if (!session) {
    return;
  }

  return <SignoutForm />;
}
