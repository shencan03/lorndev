import { Button } from "@/components/ui/button";
import type { NavLink } from "@/app/lib/definitions";
import Link from "next/link";
import Logo from "@/app/ui/Logo";

export default function NavMenu({
  links,
  className,
}: {
  links: NavLink[];
  className?: string;
}) {
  return (
    <nav
      className={`sm:flex sm:justify-between sm:px-4 sm:py-2 sm:border-b sm:items-center ${className}`}
    >
      <Logo className="text-xl" />
      <div>
        {links.map((link) => {
          return (
            <>
              <Button variant="link" className="text-white">
                <Link key={link.link} href={link.href} className="text-lg">
                  {link.link}
                </Link>
              </Button>
            </>
          );
        })}
      </div>
    </nav>
  );
}
