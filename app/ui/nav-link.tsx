import Link from "next/link";
import type { NavLinkProps } from "@/app/lib/definitions";

export default function NavLink({ link, href }: NavLinkProps) {
  return (
    <Link href={href} className="">
      {link}
    </Link>
  );
}
