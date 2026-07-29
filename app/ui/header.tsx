import Logo from "@/app/ui/logo";
import NavLinks from "@/app/ui/nav-links";

export default function Header() {
  return (
    <header className="flex justify-between items-center bg-background border-b">
      <Logo />
      <NavLinks />
    </header>
  );
}
