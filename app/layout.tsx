import type { Metadata } from "next";
import { Cormorant_Garamond, DM_Sans } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jacktoursluxor.com";

export const metadata: Metadata = {
  title: {
    default: "Jack Egypt Tour | Luxury Egypt Private Tours",
    template: "%s | Jack Egypt Tour",
  },
  description:
    "Private tailor-made Egypt journeys, Luxor day tours, Nile cruises, and DMC services curated by local experts.",
  metadataBase: new URL(siteUrl),
  keywords: [
    "Luxor tours",
    "Egypt private tours",
    "Egypt travel agency",
    "Egypt DMC",
    "Nile cruise Egypt",
    "Luxor day tours",
  ],
  openGraph: {
    title: "Jack Egypt Tour | Luxury Egypt Private Tours",
    description:
      "Private tailor-made Egypt journeys, Luxor day tours, Nile cruises, and DMC services curated by local experts.",
    url: siteUrl,
    siteName: "Jack Egypt Tour",
    images: [
      {
        url: "/photos/karnak.jpg",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_US",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteChrome>{children}</SiteChrome>
      </body>
    </html>
  );
}
