import NavMenu from "@/app/ui/nav-menu";
import type { NavLinkProps } from "@/app/lib/definitions";
import HamburgerMenu from "@/app/ui/hamburger-menu";

const links: NavLinkProps[] = [
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
