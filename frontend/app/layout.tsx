import { Navbar } from "@/components/navbar";
import "./globals.css";

import type { Metadata } from "next";
import { Quicksand } from "next/font/google";
import { Providers } from "./providers";
import { Footer } from "@/components/footer";

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
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${quicksand.className} font-normal`}>
        <Providers>
          <Navbar />
          {children}
          {modal}
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
