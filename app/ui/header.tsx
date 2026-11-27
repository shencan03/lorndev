import Logo from "@/app/ui/logo";
import NavLinks from "@/app/ui/nav-links";
import LastPlayed from "@/app/ui/last-played";

// Equal side columns keep the middle (the last played song, on the home page) truly
// centred; only the middle gives way when the row is tight.
export default function Header() {
  return (
    <header className="shell relative z-10 grid grid-cols-[minmax(max-content,1fr)_minmax(0,auto)_minmax(max-content,1fr)] items-center gap-4 py-5">
      <div className="justify-self-start">
        <Logo />
      </div>
      <LastPlayed />
      <div className="justify-self-end">
        <NavLinks />
      </div>
    </header>
  );
}
