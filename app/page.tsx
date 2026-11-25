import type { Metadata } from "next";
import HomeStack from "@/app/ui/home-stack";
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
      <h1 className="sr-only">lorndev</h1>
      <HomeStack
        essay={
          <div className={styles.essay}>
            <HomePage />
          </div>
        }
      />
    </>
  );
}
