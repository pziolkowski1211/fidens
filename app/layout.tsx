import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Fidens — Finansowanie dla firm: pojazdy, maszyny i sprzęt",
  description:
    "Leasing, kredyt i wynajem pojazdów osobowych, ciężarowych, maszyn budowlanych i sprzętu dla firm i przedsiębiorców. Szybka decyzja kredytowa, bezpłatna kalkulacja.",
  keywords: "leasing dla firm, kredyt samochodowy, maszyny budowlane, finansowanie floty, broker finansowy",
  openGraph: {
    title: "Fidens — Finansowanie dla firm: pojazdy, maszyny i sprzęt",
    description: "Leasing, kredyt i wynajem dla firm. Szybka decyzja kredytowa, bezpłatna kalkulacja.",
    url: "https://fidens.pl",
    siteName: "Fidens",
    locale: "pl_PL",
    type: "website",
    images: [
      {
        url: "https://fidens.pl/og-image.png",
        width: 1200,
        height: 630,
        alt: "Fidens — Finansowanie dla firm: pojazdy, maszyny i sprzęt",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fidens — Finansowanie dla firm: pojazdy, maszyny i sprzęt",
    description: "Leasing, kredyt i wynajem dla firm. Szybka decyzja kredytowa, bezpłatna kalkulacja.",
    images: ["https://fidens.pl/og-image.png"],
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