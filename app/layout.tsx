import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "AI Hub - En İyi Yapay Zeka Araçları ve Rehberi",
  description: "Yapay zeka dünyasındaki en güncel araçları keşfet, incele, fiyatlarını öğren, kullanıcı yorumlarını oku ve kendi aracını öner.",
  keywords: ["yapay zeka araçları", "AI tools", "ChatGPT", "Claude", "Midjourney", "türkçe ai rehber", "yapay zeka platformu"],
  authors: [{ name: "Torqbox" }],
  openGraph: {
    title: "AI Hub - Yapay Zeka Araçları Platformu",
    description: "Yüzlerce yapay zeka aracını tek bir yerden keşfet, incele ve karşılaştır.",
    url: "https://ai-hub.vercel.app", // Kendi canlı Vercel linkini buraya yazabilirsin
    siteName: "AI Hub",
    locale: "tr_TR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="tr">
      <body className={inter.className}>{children}</body>
    </html>
  );
}