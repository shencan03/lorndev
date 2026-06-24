import { Menu } from "lucide-react";
import type { NavLink } from "@/app/lib/definitions";
import Logo from "@/app/ui/Logo";
import LastPlayedCard from "@/app/ui/LastPlayedCard";

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
      <LastPlayedCard className="min-w-0 max-w-[200px]" />
      <Menu />
    </nav>
  );
}
