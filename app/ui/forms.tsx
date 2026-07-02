import Form from "next/form";
import { signout } from "@/app/lib/actions";
import { SignoutButton } from "@/app/ui/buttons";

export function SignoutForm() {
  return (
    <Form action={signout} className="inline-flex">
      <SignoutButton />
    </Form>
  );
}
