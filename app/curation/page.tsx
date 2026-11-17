import type { Metadata } from "next";
import CurationPage from "@/content/curation-page.mdx";

const description = "Songs, movies and TV shows I'd like to share";

export const metadata: Metadata = {
  title: "curation",
  description,
  alternates: { canonical: "/curation" },
  // A page's openGraph replaces the layout's wholesale, so restate the base.
  openGraph: {
    siteName: "lorndev",
    type: "website",
    locale: "en_US",
    url: "/curation",
    title: "curation · lorndev",
    description,
  },
};

export default function Curation() {
  return <CurationPage />;
}
