import Form from "next/form";
import { signin } from "@/app/lib/actions";

export default function Signin() {
  return (
    <div>
      <Form action={signin}>
        <input name="email" />
        <input name="password" />
        <button type="submit">login</button>
      </Form>
    </div>
  );
}
