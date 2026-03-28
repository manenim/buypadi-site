import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BuyPadi.ng — Coming Soon",
  description:
    "BuyPadi.ng is launching soon. Nigeria's trusted inspection and verification service for online marketplace transactions.",
  openGraph: {
    title: "BuyPadi.ng — Coming Soon",
    description: "Nigeria's trusted verification service for P2P online transactions. Launching April 2026.",
    url: "https://buypadi.ng",
    siteName: "BuyPadi.ng",
    locale: "en_NG",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  );
}
