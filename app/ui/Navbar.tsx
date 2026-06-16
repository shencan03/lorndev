import NavMenu from "@/app/ui/NavMenu";
import type { NavLink } from "@/app/lib/definitions";

const links: NavLink[] = [
  { link: "home", href: "/" },
  { link: "curation", href: "/curation" },
];

export default function Navbar() {
  return <NavMenu links={links} />;
}
