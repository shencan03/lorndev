import NavMenu from "@/app/ui/NavMenu";
import type { NavLink } from "@/app/lib/definitions";
import HamburgerMenu from "@/app/ui/HamburgerMenu";
import SignOut from "@/app/ui/sign-out";

const links: NavLink[] = [
  { link: "home", href: "/" },
  { link: "curation", href: "/curation" },
  { link: "blog", href: "/blog" },
];

export default function Navbar() {
  return (
    <>
      <NavMenu links={links} className="hidden" />
      <HamburgerMenu className="sm:hidden" />
      <SignOut />
    </>
  );
}
