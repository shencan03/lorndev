import type { Metadata } from "next";
import { cn } from "@/lib/utils";
import HomeHero from "@/app/ui/home-hero";
import HomePage from "@/content/home-page.mdx";
import styles from "@/app/page.module.css";

// Set per page, not in the layout: a layout canonical would be inherited by
// every page that doesn't override it, pointing them all at "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return (
    <>
      <HomeHero title="Why bother making this website?" />
      <div className={cn("shell", styles.essay)}>
        <HomePage />
      </div>
    </>
  );
}
