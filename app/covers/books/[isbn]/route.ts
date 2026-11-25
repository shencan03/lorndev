import { getOpenLibraryCovers } from "@/app/lib/googlebooks/getFavoriteBooks";

// Book covers from Open Library, downloaded once at build (see getFavoriteBooks.ts).
export const dynamic = "force-static";
export const dynamicParams = false;

export async function generateStaticParams() {
  const covers = await getOpenLibraryCovers();
  return [...covers.keys()].map((isbn) => ({ isbn }));
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ isbn: string }> },
) {
  const { isbn } = await params;
  const cover = (await getOpenLibraryCovers()).get(isbn);
  if (!cover) return new Response("Not found", { status: 404 });
  return new Response(cover, {
    headers: {
      "content-type": "image/jpeg",
      "cache-control": "public, max-age=31536000, immutable",
    },
  });
}
