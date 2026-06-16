import { Button } from "@/components/ui/button";
import type { NavLink } from "@/app/lib/definitions";
import Link from "next/link";

export default function NavMenu({ links }: { links: NavLink[] }) {
  return (
    <nav>
      {links.map((link) => {
        return (
          <Link key={link.link} href={link.href}>
            {link.link}
          </Link>
        );
      })}
    </nav>
  );
}
