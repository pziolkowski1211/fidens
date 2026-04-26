import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Fidens — Finansowanie pojazdów i maszyn budowlanych",
  description:
    "Leasing, kredyt i wynajem pojazdów osobowych, ciężarowych i maszyn budowlanych. Szybka decyzja kredytowa, bezpłatna kalkulacja.",
  keywords: "leasing, kredyt samochodowy, maszyny budowlane, finansowanie pojazdów, broker finansowy",
  openGraph: {
    title: "Fidens — Finansowanie pojazdów i maszyn budowlanych",
    description: "Leasing, kredyt i wynajem. Szybka decyzja kredytowa, bezpłatna kalkulacja.",
    url: "https://fidens.pl",
    siteName: "Fidens",
    locale: "pl_PL",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pl" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}