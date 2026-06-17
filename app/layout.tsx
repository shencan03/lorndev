import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono, Space_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/app/ui/Navbar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

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
      <body
        className={`${spaceMono.className} antialiased min-h-full flex flex-col gap-6`}
      >
        <Navbar />
        {children}
      </body>
    </html>
  );
}
