import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function NavLinks() {
  return (
    <nav aria-label="Pages">
      <Link href="/blog" className={buttonVariants({ variant: "link" })}>
        blog
      </Link>
      <Link href="/curation" className={buttonVariants({ variant: "link" })}>
        curation
      </Link>
    </nav>
  );
}
