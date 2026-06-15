import type { Metadata } from "next";
import "./globals.css";
import {Space_Mono, JetBrains_Mono } from 'next/font/google'
import Navbar from "@/app/ui/Navbar";
import { cn } from "@/lib/utils";

const jetbrainsMono = JetBrains_Mono({subsets:['latin'],variable:'--font-mono'});

const spaceMono = Space_Mono({
  weight: ["400", "700"],
  subsets: ["latin"]
})

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
    <html
      lang="en" className={cn("font-mono", jetbrainsMono.variable)}
    >
      <body className={`${spaceMono.className} antialiased min-h-full flex flex-col sm:pt-30`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
