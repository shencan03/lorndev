import Link from "next/link";
import Signout from "@/app/ui/sign-out";

export default function Logo() {
  return (
    <div>
      <Link href="/" className="font-bold text-xl text-mint">
        lorndev
      </Link>
      <Signout />
    </div>
  );
}
