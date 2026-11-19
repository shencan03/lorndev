import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { BookCard } from "@/app/lib/definitions";

// The books carousel mirrors catalogue/books.txt, which sync-books.yml copies from a Gist.
// Each line is an ISBN (hyphens allowed) or a Google Books link; blank lines and `#`
// comments are ignored. Titles and authors come from Google Books while the site builds, so
// they match the edition listed (usually a Turkish translation); see below for covers.
const catalogue = path.join(
  process.cwd(),
  "app/lib/googlebooks/catalogue/books.txt",
);

const apiUrl = "https://www.googleapis.com/books/v1/volumes";
const openLibraryCoverUrl = "https://covers.openlibrary.org/b/isbn";

type Entry = { isbn: string } | { volumeId: string };

const ImageLinksSchema = z.object({
  smallThumbnail: z.string().optional(),
  thumbnail: z.string().optional(),
  small: z.string().optional(),
  medium: z.string().optional(),
  large: z.string().optional(),
  extraLarge: z.string().optional(),
});

const VolumeSchema = z.object({
  id: z.string(),
  volumeInfo: z.object({
    title: z.string(),
    authors: z.array(z.string()).optional(),
    imageLinks: ImageLinksSchema.optional(),
    industryIdentifiers: z
      .array(z.object({ type: z.string(), identifier: z.string() }))
      .optional(),
    canonicalVolumeLink: z.string().optional(),
  }),
});

const SearchSchema = z.object({
  totalItems: z.number(),
  items: z.array(VolumeSchema).optional(),
});

type Volume = z.infer<typeof VolumeSchema>;

function apiKey(): string {
  const value = process.env.GOOGLE_BOOKS_API_KEY;
  if (!value) throw new Error("GOOGLE_BOOKS_API_KEY is not set");
  return value;
}

function parseLine(line: string): Entry {
  // books.google.com/books?id=<id> and google.com/books/edition/<title>/<id>
  const link =
    line.match(/[?&]id=([\w-]+)/) ??
    line.match(/\/books\/edition\/[^/]*\/([\w-]+)/);
  if (link) return { volumeId: link[1] };
  const isbn = line.replace(/[\s-]/g, "").toUpperCase();
  if (/^(\d{9}[\dX]|\d{13})$/.test(isbn)) return { isbn };
  throw new Error(`books.txt: not an ISBN or Google Books link: ${line}`);
}

async function readEntries(): Promise<Entry[]> {
  const text = await readFile(catalogue, "utf8");
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"));
  return [...new Set(lines)].map(parseLine);
}

// The key rides in the query string, so errors name the lookup rather than the URL.
async function googleBooks(
  pathAndQuery: string,
  label: string,
): Promise<unknown> {
  const sep = pathAndQuery.includes("?") ? "&" : "?";
  const url = `${apiUrl}${pathAndQuery}${sep}key=${apiKey()}`;
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(url, { headers: { accept: "application/json" } });
    if (res.ok) return res.json();
    const retryable = res.status === 429 || res.status >= 500;
    if (!retryable || attempt === 3) {
      throw new Error(`Google Books ${label} failed with code ${res.status}`);
    }
    await new Promise((resolve) => setTimeout(resolve, attempt * 1000));
  }
}

async function findVolumeId(entry: Entry): Promise<string> {
  if ("volumeId" in entry) return entry.volumeId;
  const search = SearchSchema.parse(
    await googleBooks(`?q=isbn:${entry.isbn}`, `search for ISBN ${entry.isbn}`),
  );
  const volume = search.items?.[0];
  // Fail the build on a typo rather than silently dropping a book.
  if (!volume) {
    throw new Error(
      `No Google Books edition for ISBN ${entry.isbn}; use its Google Books link instead`,
    );
  }
  return volume.id;
}

// Covers come from Open Library by ISBN when it has one: Google Books usually holds only a
// 128px thumbnail for Turkish editions (its larger zooms are an "image not available"
// placeholder), while Open Library has the same edition's cover at ~500px.
async function openLibraryCover(isbn: string): Promise<string | undefined> {
  const url = `${openLibraryCoverUrl}/${isbn}-L.jpg`;
  const res = await fetch(`${url}?default=false`, { method: "HEAD" });
  return res.ok ? url : undefined;
}

// The volume lists larger sizes than search results do, when the publisher supplied them.
function googleCover(volume: Volume): string | undefined {
  const links = volume.volumeInfo.imageLinks;
  const url =
    links?.extraLarge ??
    links?.large ??
    links?.medium ??
    links?.small ??
    links?.thumbnail;
  return url?.replace(/^http:/, "https:").replace(/&edge=curl/, "");
}

async function lookUp(entry: Entry): Promise<BookCard | null> {
  const id = await findVolumeId(entry);
  const volume = VolumeSchema.parse(
    await googleBooks(`/${encodeURIComponent(id)}`, `volume ${id}`),
  );
  const info = volume.volumeInfo;

  // A line given as a link still has an ISBN on its volume, usually.
  const isbn =
    "isbn" in entry
      ? entry.isbn
      : (
          info.industryIdentifiers?.find((id) => id.type === "ISBN_13") ??
          info.industryIdentifiers?.find((id) => id.type === "ISBN_10")
        )?.identifier;
  const cover =
    (isbn ? await openLibraryCover(isbn) : undefined) ?? googleCover(volume);
  if (!cover) {
    console.warn(`No cover for "${info.title}" (${id}); skipping it`);
    return null;
  }

  return {
    title: info.title,
    authors: (info.authors ?? []).slice(0, 2).join(" & "),
    cover,
    url: info.canonicalVolumeLink ?? `https://books.google.com/books?id=${id}`,
  };
}

async function fetchFavoriteBooks(): Promise<BookCard[]> {
  const entries = await readEntries();
  if (entries.length === 0) throw new Error("books.txt lists no books");

  // A few at a time, to stay under Google's per-minute quota.
  const books: (BookCard | null)[] = [];
  for (let i = 0; i < entries.length; i += 4) {
    books.push(...(await Promise.all(entries.slice(i, i + 4).map(lookUp))));
  }

  // An ISBN and a link can name the same edition.
  const seen = new Set<string>();
  return books.filter((book): book is BookCard => {
    if (!book || seen.has(book.url)) return false;
    seen.add(book.url);
    return true;
  });
}

// Fetched once per build worker, like the other shelves.
let cached: Promise<BookCard[]> | undefined;

export function getFavoriteBooks(): Promise<BookCard[]> {
  cached ??= fetchFavoriteBooks().catch((error: unknown) => {
    cached = undefined;
    throw error;
  });
  return cached;
}
