import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "BuyPadi.ng — Buy Used Items Safely Online in Nigeria",
  description:
    "BuyPadi is Nigeria's trusted inspection and verification service for remote peer-to-peer transactions. Buy from Facebook Marketplace, Jiji, and WhatsApp without getting scammed.",
  keywords: [
    "buy used items Nigeria",
    "online marketplace verification",
    "Jiji inspection",
    "Facebook Marketplace Nigeria",
    "peer to peer trust",
    "BuyPadi",
  ],
  openGraph: {
    title: "BuyPadi.ng — Buy Used Items Safely Online in Nigeria",
    description:
      "Nigeria's trusted inspection and verification service for remote P2P transactions.",
    url: "https://buypadi.ng",
    siteName: "BuyPadi.ng",
    locale: "en_NG",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "BuyPadi.ng — Buy Used Items Safely Online",
    description:
      "Nigeria's #1 trust & verification service for online marketplace transactions.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
