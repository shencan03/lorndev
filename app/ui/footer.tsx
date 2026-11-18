import { SOCIALS } from "@/app/lib/socials";

export default function Footer() {
  return (
    <footer className="border-t">
      <div className="shell flex flex-wrap justify-between gap-3 py-5 text-xs text-muted-foreground">
        <span>lorndev</span>
        <nav aria-label="Social media" className="flex gap-4">
          {SOCIALS.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noreferrer noopener"
              className="transition-colors hover:text-foreground"
            >
              {social.name.toLowerCase()}
            </a>
          ))}
        </nav>
      </div>
    </footer>
  );
}
