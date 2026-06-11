import type { Metadata } from "next";
import "./globals.css";
import {Space_Mono} from 'next/font/google'
import Navbar from "@/components/Navbar";

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
      lang="en"
    >
      <body className={`${spaceMono.className} antialiased min-h-full flex flex-col gap-20`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
