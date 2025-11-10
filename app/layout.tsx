import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import Header from "@/app/components/ui/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FTC SCOUT : DECODE",
  description: "Scouting App for FIRST Tech Challenge 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased grid min-h-screen `}
      >
        <div className="fixed top-0 w-full h-8 bg-zinc-900 z-50">
          <Header />
        </div>
        <main className="absolute grid min-w-full min-h-full bg-slate-800 text-white pt-8 mb-auto">
          {children}
        </main>

        <footer className="fixed bottom-0 w-full h-24 bg-zinc-800 text-white p-4 z-50">  
          // Footer could go here
        </footer>
      </body>
    </html>
  );
}
