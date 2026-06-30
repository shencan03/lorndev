import NavMenu from "@/app/ui/nav-menu";
import type { NavLink } from "@/app/lib/definitions";
import HamburgerMenu from "@/app/ui/hamburger-menu";

const links: NavLink[] = [
  { link: "home", href: "/" },
  { link: "curation", href: "/curation" },
  { link: "blog", href: "/blog" },
];

export default function Navbar({ className }: { className?: string }) {
  return (
    <>
      <NavMenu links={links} className="hidden" />
      <HamburgerMenu className="sm:hidden" />
    </>
  );
}
