import type { NavLinkProps } from "@/app/lib/definitions";
import NavLink from "@/app/ui/nav-link";
import Logo from "@/app/ui/logo";
import LastPlayedCard from "@/app/ui/last-played-card";

export default function NavMenu({
  links,
  className,
}: {
  links: NavLinkProps[];
  className?: string;
}) {
  return (
    <header
      className={`sm:flex sm:justify-between sm:px-4 sm:py-2 sm:border-b sm:items-center ${className}`}
    >
      <Logo />
      <LastPlayedCard />
      <div className="flex items-center">
        <nav>
          {links.map((link) => {
            return (
              <NavLink key={link.href} link={link.link} href={link.href} />
            );
          })}
        </nav>
      </div>
    </header>
  );
}
