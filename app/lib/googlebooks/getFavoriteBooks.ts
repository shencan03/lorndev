import { readFile } from "node:fs/promises";
import path from "node:path";
import { z } from "zod";
import type { BookCard } from "@/app/lib/definitions";

// The books carousel mirrors catalogue/books.txt, which sync-books.yml copies from a Gist.
// Each line is an ISBN (hyphens allowed) or a Google Books link, optionally followed by
// `| title` and `| author` to override what Google Books has (e.g. a missing "ç"); blank
// lines and `#` comments are ignored. Titles and authors come from Google Books while the
// site builds, so they match the edition listed (usually a Turkish translation); see below
// for covers.
const catalogue = path.join(
  process.cwd(),
  "app/lib/googlebooks/catalogue/books.txt",
);

const apiUrl = "https://www.googleapis.com/books/v1/volumes";
const openLibraryCoverUrl = "https://covers.openlibrary.org/b/isbn";

type Edition = { isbn: string } | { volumeId: string };
type Entry = { edition: Edition; title?: string; author?: string };

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

const tidy = (text: string) => text.replace(/\s+/g, " ").trim();

function parseEdition(ref: string): Edition {
  // books.google.com/books?id=<id> and google.com/books/edition/<title>/<id>
  const link =
    ref.match(/[?&]id=([\w-]+)/) ??
    ref.match(/\/books\/edition\/[^/]*\/([\w-]+)/);
  if (link) return { volumeId: link[1] };
  const isbn = ref.replace(/[\s-]/g, "").toUpperCase();
  if (/^(\d{9}[\dX]|\d{13})$/.test(isbn)) return { isbn };
  throw new Error(`books.txt: not an ISBN or Google Books link: ${ref}`);
}

function parseLine(line: string): Entry {
  const [ref, title, author] = line.split("|").map(tidy);
  return {
    edition: parseEdition(ref),
    title: title || undefined,
    author: author || undefined,
  };
}

async function readEntries(): Promise<Entry[]> {
  const text = await readFile(catalogue, "utf8");
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith("#"))
    .map(parseLine);
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

async function findVolumeId(edition: Edition): Promise<string> {
  if ("volumeId" in edition) return edition.volumeId;
  const { isbn } = edition;
  const search = SearchSchema.parse(
    await googleBooks(`?q=isbn:${isbn}`, `search for ISBN ${isbn}`),
  );
  const volume = search.items?.[0];
  // Fail the build on a typo rather than silently dropping a book.
  if (!volume) {
    throw new Error(
      `No Google Books edition for ISBN ${isbn}; use its Google Books link instead`,
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
// Medium (~575px wide) is sharp at the reel's 220px on retina screens; extraLarge is ~1700px
// and several hundred KB, so it's the last resort before the 128px thumbnail.
function googleCover(volume: Volume): string | undefined {
  const links = volume.volumeInfo.imageLinks;
  const url =
    links?.medium ??
    links?.large ??
    links?.small ??
    links?.extraLarge ??
    links?.thumbnail;
  return url?.replace(/^http:/, "https:").replace(/&edge=curl/, "");
}

// Compares names loosely: "Zweig" matches "zweıg", "Dostoyevski" matches "Dostoyevskı".
const loose = (text: string) =>
  text
    .normalize("NFD")
    .replace(/\p{M}/gu, "")
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i");

// Some publishers append the author: "Bir Kadının Yirmi Dört Saati - Stefan Zweig".
function cleanTitle(title: string, authors: string[]): string {
  const match = tidy(title).match(/^(.+?)\s+[-–—]\s+([^-–—]+)$/);
  if (!match) return tidy(title);
  const [, rest, tail] = match;
  return authors.some((author) => loose(author) === loose(tail))
    ? rest
    : tidy(title);
}

async function lookUp({
  edition,
  title,
  author,
}: Entry): Promise<BookCard | null> {
  const id = await findVolumeId(edition);
  const volume = VolumeSchema.parse(
    await googleBooks(`/${encodeURIComponent(id)}`, `volume ${id}`),
  );
  const info = volume.volumeInfo;

  // A line given as a link still has an ISBN on its volume, usually.
  const isbn =
    "isbn" in edition
      ? edition.isbn
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

  const authors = (info.authors ?? []).map(tidy).filter(Boolean);
  return {
    title: title ?? cleanTitle(info.title, authors),
    authors: author ?? authors.slice(0, 2).join(" & "),
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
