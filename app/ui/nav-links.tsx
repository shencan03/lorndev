"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const LINKS = [
  { href: "/blog", label: "blog", prefetch: false },
  { href: "/curation", label: "curation", prefetch: undefined },
];

export default function NavLinks() {
  const pathname = usePathname();

  return (
    <nav aria-label="Pages" className="flex gap-5 text-xs">
      {LINKS.map(({ href, label, prefetch }) => {
        const current = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={href}
            href={href}
            prefetch={prefetch}
            aria-current={current ? "page" : undefined}
            className={cn(
              "transition-colors hover:text-foreground",
              current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
