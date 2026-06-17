import { Menu } from "lucide-react";
import type { NavLink } from "@/app/lib/definitions";
import Logo from "@/app/ui/Logo";

export default function HamburgerMenu({
  links,
  className,
}: {
  className?: string;
  links: NavLink[];
}) {
  return (
    <nav
      className={`flex justify-between py-2 px-4 border-b-2 items-center ${className}`}
    >
      <Logo className="text-lg" />
      <Menu />
    </nav>
  );
}
