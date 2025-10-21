import type { Metadata } from "next";
import Image from "next/image";

import Footer from "@/app/components/Footer";


export const metadata: Metadata = {
  title: "FTC SCOUT : DECODE Dashboard",
  description: "FTC Scouting App for FTC 2026",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
<div className="
    bg-slate-200
    font-sans grid grid-rows-[30px_1fr_100px] justify-items-center min-h-screen
    ">
      <div className="bg-slate-800 w-full flex flex-row row-start-1 items-start justify-items-center p-1">
          <Image src="/ui/FTC-SCOUT-white.svg" alt="FTC | SCOUTING APP" width={150} height={25} />
      </div>
      <main className="flex flex-row row-start-2 w-full">
        {children}
      </main>
      <footer className="
      bg-slate-800 w-full
      row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        
        <Footer />

      </footer>
    </div>
  );
}
