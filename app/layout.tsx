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
    url: "https://ai-hub-nine-alpha.vercel.app",
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
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6311027964585578"
          crossOrigin="anonymous"
        ></script>
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}