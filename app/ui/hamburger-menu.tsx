import Logo from "@/app/ui/logo";
import LastPlayedCard from "@/app/ui/last-played-card";

export default function HamburgerMenu({ className }: { className?: string }) {
  return (
    <header
      className={`flex justify-between py-2 px-4 border-b-2 items-center ${className}`}
    >
      <Logo />
      <LastPlayedCard className="min-w-0 max-w-[200px]" />
    </header>
  );
}
