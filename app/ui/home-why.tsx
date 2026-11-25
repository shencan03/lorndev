"use client";

import { useRef, type MouseEvent, type ReactNode } from "react";
import { cn } from "@/lib/utils";
import styles from "@/app/ui/home-stack.module.css";

const DURATION = 450;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Glide the window to y over DURATION ms; any wheel, touch or key stops it. */
function glideTo(y: number) {
  const from = window.scrollY;
  const to = Math.min(
    Math.max(0, y),
    document.documentElement.scrollHeight - window.innerHeight,
  );
  if (
    Math.abs(to - from) < 2 ||
    matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    window.scrollTo(0, to);
    return;
  }

  let frame = 0;
  const stop = () => {
    cancelAnimationFrame(frame);
    for (const e of ["wheel", "touchstart", "keydown"])
      window.removeEventListener(e, stop);
  };
  for (const e of ["wheel", "touchstart", "keydown"])
    window.addEventListener(e, stop, { passive: true });

  const start = performance.now();
  const step = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    window.scrollTo(0, from + (to - from) * easeOut(t));
    if (t < 1) frame = requestAnimationFrame(step);
    else stop();
  };
  frame = requestAnimationFrame(step);
}

// The third band, with the essay always open under it (on wide screens, under
// all three columns). Tapping the band brings "why" to the top of the screen
// with the essay right below it. Without JS, the anchor still jumps there.
export default function HomeWhy({ children }: { children: ReactNode }) {
  const label = useRef<HTMLDivElement>(null);

  const onClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!label.current) return;
    e.preventDefault();
    glideTo(label.current.getBoundingClientRect().top + window.scrollY - 16);
  };

  return (
    <>
      <a href="#why" className={cn(styles.band, styles.why)} onClick={onClick}>
        <div ref={label} className={styles.label}>
          <h2 className={cn("type-display", styles.word)}>why</h2>
          <span className={styles.sub}>what this site is for</span>
        </div>
        <div className={styles.art} aria-hidden>
          <span className={styles.qmark}>?</span>
        </div>
      </a>
      <div id="why" className={styles.answer}>
        {children}
      </div>
    </>
  );
}
