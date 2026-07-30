import type { Metadata } from "next";
import { JetBrains_Mono } from "next/font/google";
import "@/app/globals.css";
import { cn } from "@/lib/utils";
import Header from "@/app/ui/header";
import Footer from "@/app/ui/footer";

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "lorndev",
  description: "Personal web blog of lorndev",
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
      )}
    >
      <body className="min-h-full flex flex-col sm:mx-128 justify-between gap-4">
        <Header />
        <main className="basis-4xl px-4 prose prose-sm sm:prose">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
