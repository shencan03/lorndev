"use client";

import Image from "next/image";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type CSSProperties,
} from "react";
import { cn } from "@/lib/utils";
import { shuffled } from "@/app/lib/shuffle";
import { unpackSong, type PackedSong } from "@/app/lib/ytmusic/songArt";
import styles from "@/app/ui/curation-reel.module.css";

export type CurationItem = {
  key: string;
  title: string;
  /** e.g. "Movie, 1999" or "Song by Sade" */
  meta: string;
  href: string;
  image: string;
};

export type Shelf = {
  id: string;
  label: string;
  /** Album art is square; everything else is a 2:3 poster. */
  square?: boolean;
  /** Show at most this many per visit; omit to show all. */
  max?: number;
} & ({ items: CurationItem[] } | { songs: PackedSong[] });

const pickFrom = (shelf: Shelf): CurationItem[] =>
  "songs" in shelf
    ? shuffled(shelf.songs)
        .slice(0, shelf.max ?? shelf.songs.length)
        .map(unpackSong)
    : shuffled(shelf.items).slice(0, shelf.max ?? shelf.items.length);

// Covers sit this many slots in on load, so there's something on both sides.
const START = 2;
const PLACEHOLDERS = 7;

// The pages are static, so the shuffle happens in the browser: the server snapshot is
// null (placeholders), and the client snapshot is computed once per page load.
let picks: Record<string, CurationItem[]> | null = null;
const subscribe = () => () => {};

// The row nudges once per page load to show that it scrolls.
let hinted = false;

const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

type Rgb = [number, number, number];

// Average color of a cover, weighted toward saturated pixels and brightened so the
// glow reads on plum black. Sampled from a 32px copy served by Next's image optimizer:
// it's same-origin, so the canvas isn't tainted. (Loading the covers themselves with
// crossOrigin breaks them: TMDB omits CORS headers on plain requests and the browser
// reuses that cached response.)
const glowCache = new Map<string, Promise<Rgb | null>>();
function glowOf(src: string): Promise<Rgb | null> {
  let glow = glowCache.get(src);
  if (!glow) {
    glow = new Promise((resolve) => {
      const img = new window.Image();
      img.onload = () => resolve(averageColor(img));
      img.onerror = () => resolve(null);
      img.src = `/_next/image?url=${encodeURIComponent(src)}&w=32&q=75`;
    });
    glowCache.set(src, glow);
  }
  return glow;
}

function averageColor(img: HTMLImageElement): Rgb | null {
  try {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 12;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return null;
    ctx.drawImage(img, 0, 0, 12, 12);
    const data = ctx.getImageData(0, 0, 12, 12).data;
    let r = 0,
      g = 0,
      b = 0,
      n = 0;
    for (let i = 0; i < data.length; i += 4) {
      const w =
        Math.max(data[i], data[i + 1], data[i + 2]) -
        Math.min(data[i], data[i + 1], data[i + 2]) +
        8;
      r += data[i] * w;
      g += data[i + 1] * w;
      b += data[i + 2] * w;
      n += w;
    }
    const k = Math.min(255 / Math.max(r / n, g / n, b / n, 1), 2.2);
    return [
      Math.round((r / n) * k),
      Math.round((g / n) * k),
      Math.round((b / n) * k),
    ];
  } catch {
    return null;
  }
}

export default function CurationReel({
  shelves,
  initial,
}: {
  shelves: Shelf[];
  initial: string;
}) {
  const picked = useSyncExternalStore(
    subscribe,
    () =>
      (picks ??= Object.fromEntries(
        shelves.map((shelf) => [shelf.id, pickFrom(shelf)]),
      )),
    () => null,
  );

  const [shelfId, setShelfId] = useState(initial);
  const shelf = shelves.find((s) => s.id === shelfId) ?? shelves[0];
  const items = picked?.[shelf.id] ?? null;

  const roomRef = useRef<HTMLDivElement>(null);
  const reelRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(START);
  const currentRef = useRef(START);
  const drag = useRef<{ x: number; left: number; moved: boolean } | null>(null);
  const dragged = useRef(false);

  const slots = () =>
    Array.from(reelRef.current?.children ?? []) as HTMLElement[];

  // Scale, color and lift each cover by its distance from the centre, and track
  // which one is centred. Writes CSS variables directly: this runs every frame.
  const paint = useCallback(() => {
    const reel = reelRef.current;
    if (!reel) return;
    const mid = reel.scrollLeft + reel.clientWidth / 2;
    let best = 0;
    let bestDistance = Infinity;
    slots().forEach((slot, i) => {
      const distance =
        Math.abs(slot.offsetLeft + slot.offsetWidth / 2 - mid) /
        slot.offsetWidth;
      slot.style.setProperty("--t", Math.max(0, 1 - distance).toFixed(3));
      if (distance < bestDistance) {
        bestDistance = distance;
        best = i;
      }
    });
    if (best !== currentRef.current) {
      currentRef.current = best;
      setCurrent(best);
    }
  }, []);

  const centerOn = useCallback((index: number, smooth = true) => {
    const reel = reelRef.current;
    const all = slots();
    const slot = all[Math.max(0, Math.min(index, all.length - 1))];
    if (!reel || !slot) return;
    reel.scrollTo({
      left: slot.offsetLeft + slot.offsetWidth / 2 - reel.clientWidth / 2,
      behavior: smooth && !prefersReducedMotion() ? "smooth" : "auto",
    });
  }, []);

  // Open each shelf a couple of covers in.
  useLayoutEffect(() => {
    if (!items) return;
    const start = Math.min(START, items.length - 1);
    currentRef.current = -1;
    centerOn(start, false);
    paint();
  }, [items, centerOn, paint]);

  // The first time real covers appear, nudge the row once.
  useEffect(() => {
    const reel = reelRef.current;
    if (!items || hinted || !reel || prefersReducedMotion()) return;
    hinted = true;
    reel.classList.add(styles.hint);
    const done = () => reel.classList.remove(styles.hint);
    reel.addEventListener("animationend", done, { once: true });
  }, [items]);

  useEffect(() => {
    const reel = reelRef.current;
    if (!reel) return;
    let frame = 0;
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(paint);
    };
    const onResize = () => {
      centerOn(currentRef.current, false);
      paint();
    };
    // A plain vertical wheel moves the reel too, until it reaches either end.
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
      const max = reel.scrollWidth - reel.clientWidth;
      if (
        (e.deltaY < 0 && reel.scrollLeft <= 0) ||
        (e.deltaY > 0 && reel.scrollLeft >= max - 1)
      )
        return;
      e.preventDefault();
      reel.scrollLeft += e.deltaY;
    };
    reel.addEventListener("scroll", onScroll, { passive: true });
    reel.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(frame);
      reel.removeEventListener("scroll", onScroll);
      reel.removeEventListener("wheel", onWheel);
      window.removeEventListener("resize", onResize);
    };
  }, [paint, centerOn]);

  // Light the room with the centred cover's color.
  useEffect(() => {
    const src = items?.[current]?.image;
    if (!src) return;
    let stale = false;
    glowOf(src).then((glow) => {
      const room = roomRef.current;
      if (stale || !glow || !room) return;
      room.style.setProperty("--glow-r", String(glow[0]));
      room.style.setProperty("--glow-g", String(glow[1]));
      room.style.setProperty("--glow-b", String(glow[2]));
    });
    return () => {
      stale = true;
    };
  }, [current, items]);

  // Mouse drag; touch and trackpads scroll natively. Listeners go on the window
  // (not pointer capture) so a plain click still lands on the cover link.
  const onPointerDown = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || e.button !== 0) return;
    const reel = reelRef.current;
    if (!reel) return;
    dragged.current = false;
    drag.current = { x: e.clientX, left: reel.scrollLeft, moved: false };
    const onMove = (ev: PointerEvent) => {
      if (!drag.current) return;
      const dx = ev.clientX - drag.current.x;
      if (Math.abs(dx) > 4 && !drag.current.moved) {
        drag.current.moved = true;
        reel.classList.add(styles.dragging);
      }
      if (drag.current.moved) reel.scrollLeft = drag.current.left - dx;
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      if (drag.current?.moved) {
        dragged.current = true;
        reel.classList.remove(styles.dragging);
        centerOn(currentRef.current);
      }
      drag.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  };

  // Clicking a side cover brings it to the centre; only the centred one opens.
  const onCoverClick = (e: React.MouseEvent, index: number) => {
    if (dragged.current) {
      e.preventDefault();
      dragged.current = false;
      return;
    }
    if (index !== currentRef.current) {
      e.preventDefault();
      centerOn(index);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    slots()[currentRef.current + step]?.querySelector("a")?.focus();
  };

  const centred = items?.[current];

  return (
    <section
      ref={roomRef}
      className={styles.room}
      aria-labelledby="curation-heading"
    >
      <div className={styles.glow} aria-hidden />
      <h1 id="curation-heading" className="sr-only">
        Curation
      </h1>

      <div className="shell">
        <div className={styles.kinds} role="tablist" aria-label="Kind">
          {shelves.map((s) => (
            <button
              key={s.id}
              id={`shelf-${s.id}`}
              type="button"
              role="tab"
              aria-selected={s.id === shelf.id}
              aria-controls="curation-reel"
              className={cn("type-display", styles.kind)}
              onClick={() => setShelfId(s.id)}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={reelRef}
        id="curation-reel"
        role="tabpanel"
        aria-labelledby={`shelf-${shelf.id}`}
        aria-roledescription="carousel"
        className={cn(styles.reel, shelf.square && styles.square)}
        onPointerDown={onPointerDown}
        onKeyDown={onKeyDown}
      >
        {items
          ? items.map((item, i) => (
              <div key={item.key} className={styles.slot}>
                <a
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  draggable={false}
                  className={styles.cover}
                  aria-label={`${item.title} (${item.meta})`}
                  onClick={(e) => onCoverClick(e, i)}
                  onFocus={() => {
                    if (i !== currentRef.current) centerOn(i);
                  }}
                >
                  <Image
                    src={item.image}
                    alt=""
                    fill
                    sizes="220px"
                    unoptimized
                    loading={Math.abs(i - START) <= 4 ? "eager" : "lazy"}
                    draggable={false}
                  />
                </a>
              </div>
            ))
          : Array.from({ length: PLACEHOLDERS }, (_, i) => (
              <div
                key={i}
                className={styles.slot}
                style={{ "--t": i === START ? 1 : 0 } as CSSProperties}
                aria-hidden
              >
                <div className={styles.cover} />
              </div>
            ))}
      </div>

      <div className="shell">
        <div className={styles.caption} aria-live="polite">
          <h2 className={cn("type-display", styles.title)}>
            {centred && <span key={centred.key}>{centred.title}</span>}
          </h2>
          <p className={styles.meta}>{centred?.meta}</p>
        </div>
      </div>
    </section>
  );
}
