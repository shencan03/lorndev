import type { Metadata } from "next";
import HomePage from "@/content/home-page.mdx";

// Set per page, not in the layout: a layout canonical would be inherited by
// every page that doesn't override it, pointing them all at "/".
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Home() {
  return <HomePage />;
}
