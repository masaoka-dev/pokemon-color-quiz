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
  title: "ポケモン色彩クイズ",
  description: "めざせ！色彩マスター！色だけでポケモンを当てろ！！",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <p className="h-[calc(5vh)] w-full text-4xl font-bold text-center bg-[#FFCCCC]"> 
        ヘッダ</p>

        {children}
      </body>
    </html>
  );
}
