import type { NavLink } from "@/app/lib/definitions";
import Link from "next/link";
import Logo from "@/app/ui/logo";
import LastPlayedCard from "@/app/ui/last-played-card";
import Signout from "@/app/ui/sign-out";

export default function NavMenu({
  links,
  className,
}: {
  links: NavLink[];
  className?: string;
}) {
  return (
    <header
      className={`sm:flex sm:justify-between sm:px-4 sm:py-2 sm:border-b sm:items-center ${className}`}
    >
      <Logo className="text-xl" />
      <LastPlayedCard />
      <nav>
        {links.map((link) => {
          return (
            <Link key={link.link} href={link.href}>
              {link.link}
            </Link>
          );
        })}
        <Signout />
      </nav>
    </header>
  );
}
