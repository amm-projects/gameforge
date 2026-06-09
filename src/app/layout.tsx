import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "GameForge - Editor de niveles 2D",
  description: "Editor visual de juegos de plataformas 2D. Crea niveles con drag & drop, coloca tiles, enemigos, monedas y juega directamente en el navegador.",
  keywords: ["editor de niveles", "creador de juegos", "plataformas 2D", "game maker", "Mario Maker"],
  authors: [{ name: "GameForge" }],
  openGraph: {
    title: "GameForge - Editor de niveles 2D",
    description: "Creador de juegos de plataformas 2D similar a Mario Maker, completamente web.",
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
      lang="es"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-slate-950 text-slate-100">{children}</body>
    </html>
  );
}
