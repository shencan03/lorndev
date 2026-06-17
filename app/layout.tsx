import type { Metadata } from "next";
import "./globals.css";
import { Space_Mono } from "next/font/google";
import Navbar from "@/app/ui/Navbar";

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "lorndev",
  description: "personal blog of lorndev",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceMono.className} antialiased min-h-full`}>
        <Navbar />
        <main className="m-auto max-w-7xl px-4 py-10 sm:py-14">{children}</main>
      </body>
    </html>
  );
}
