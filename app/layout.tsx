import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";
import { SITE_URL } from "@/app/lib/site";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

// Display face for the wordmark and headings: condensed via wdth, and opsz
// tightens it at large sizes.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  axes: ["wdth", "opsz"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: "lorndev", template: "%s · lorndev" },
  description: "Personal web blog of lorndev",
  openGraph: {
    siteName: "lorndev",
    type: "website",
    locale: "en_US",
    url: "/",
  },
  twitter: { card: "summary_large_image" },
};

// The site is dark-only: tint the mobile browser chrome and native controls.
export const viewport: Viewport = {
  themeColor: "#0c090c",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full antialiased font-mono dark",
        jetbrainsMono.variable,
        bricolage.variable,
      )}
    >
      <body className="min-h-full flex flex-col text-[13px] leading-relaxed">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
