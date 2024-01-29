import { Navbar } from "@/components/navbar";
import "./globals.css";

import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";
import Survey from "./survery";

const quicksand = Quicksand({
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "CarbTrkr",
  description: "CarbTrkr, track your carbon footprint now!",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${quicksand.className} font-normal`}>
        <Providers>
          <Navbar />
          {children}
          <Footer />
        </Providers>
        <Survey />
      </body>
    </html>
  );
}
