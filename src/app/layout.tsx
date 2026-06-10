import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LangSetter } from "@/components/LangSetter";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameForge - 2D Level Editor",
  description: "Visual 2D platformer game editor. Create levels with drag & drop, place tiles, enemies, coins and play directly in the browser.",
  keywords: ["level editor", "game creator", "2D platformer", "game maker", "Mario Maker"],
  authors: [{ name: "GameForge" }],
  openGraph: {
    title: "GameForge - 2D Level Editor",
    description: "2D platformer game creator similar to Mario Maker, fully web-based.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <LangSetter />
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
