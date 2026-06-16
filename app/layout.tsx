import type { Metadata } from "next";
import "./globals.css";
import { JetBrains_Mono } from "next/font/google";
import { cn } from "@/lib/utils";
import Navbar from "@/app/ui/Navbar";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
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
    <html lang="en" className={cn("font-mono", jetbrainsMono.variable)}>
      <body className="antialiased min-h-full flex flex-col">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
