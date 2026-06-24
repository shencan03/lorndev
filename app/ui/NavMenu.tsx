import { Button } from "@/components/ui/button";
import type { NavLink } from "@/app/lib/definitions";
import Link from "next/link";
import Logo from "@/app/ui/Logo";
import LastPlayedCard from "@/app/ui/LastPlayedCard";
import { SWRConfig } from "swr";
import { Suspense } from "react";
import { getLastPlayed } from "@/app/lib/last-played";
import LastPlayedCardSkeleton from "@/app/ui/LastPlayedCardSkeletion";

export default async function NavMenu({
  links,
  className,
}: {
  links: NavLink[];
  className?: string;
}) {
  return (
    <nav
      className={`sm:flex sm:justify-between sm:px-4 sm:py-2 sm:border-b sm:items-center ${className}`}
    >
      <Logo className="text-xl" />
      <Suspense fallback={<LastPlayedCardSkeleton />}>
        <SWRConfig value={{ fallbackData: getLastPlayed() }}>
          <LastPlayedCard />
        </SWRConfig>
      </Suspense>
      <div>
        {links.map((link) => {
          return (
            <Button
              key={link.link}
              variant="link"
              className="text-white"
              asChild
            >
              <Link href={link.href}>{link.link}</Link>
            </Button>
          );
        })}
      </div>
    </nav>
  );
}
