import Logo from "@/app/ui/logo";
import NavLinks from "@/app/ui/nav-links";

export default function Header() {
  return (
    <header className="shell relative z-10 flex items-center justify-between py-5">
      <Logo />
      <NavLinks />
    </header>
  );
}
