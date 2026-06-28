import { getSession } from "@/app/lib/actions";
import SigninForm from "@/app/ui/sign-in";

export default async function Signin() {
  const session = await getSession();
  if (session) {
    return <div>You are already signed in.</div>;
  }
  return <SigninForm />;
}
