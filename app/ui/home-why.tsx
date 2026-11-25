"use client";

import { useState, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "@/app/ui/home-stack.module.css";

// The third band. The essay stays in the HTML (for search and find-in-page)
// but folded and inert until "why" is opened. It sits after the band as its
// own grid item, so on wide screens it opens under all three columns.
export default function HomeWhy({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className={cn(styles.band, styles.why)}>
        <div className={styles.label}>
          <h2 className={cn("type-display", styles.word)}>
            {/* Stretched over the whole band, so any of it opens the essay. */}
            <button
              type="button"
              className={styles.whyButton}
              aria-expanded={open}
              aria-controls="why"
              onClick={() => setOpen((o) => !o)}
            >
              why
            </button>
          </h2>
          <span className={styles.sub}>what this site is for</span>
        </div>
        <div className={styles.art} aria-hidden>
          <span className={styles.qmark}>?</span>
        </div>
      </div>
      <div
        id="why"
        className={styles.answer}
        data-open={open || undefined}
        inert={!open}
      >
        <div className={styles.answerInner}>{children}</div>
      </div>
    </>
  );
}
