import "./globals.css";

import type { Metadata } from "next";
import { Quicksand } from "next/font/google";

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
    <html lang="en" className="dark">
      <body className={`${quicksand.className} font-normal`}>{children}</body>
    </html>
  );
}