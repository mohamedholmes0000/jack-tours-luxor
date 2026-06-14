import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { SiteChrome } from "@/components/layout/site-chrome";
import { getPublicSettings } from "@/lib/data/settings";
import "./globals.css";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jacktoursluxor.com";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getPublicSettings();
  const title =
    settings.defaultSeoTitle || "Jack Egypt Tour | Luxury Egypt Private Tours";
  const description =
    settings.defaultSeoDescription ||
    "Private tailor-made Egypt tours and DMC services from Luxor-based experts.";

  return {
    title: {
      default: title,
      template: `%s | ${settings.companyName}`,
    },
    description,
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
      title,
      description,
      url: siteUrl,
      siteName: settings.companyName,
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
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await getPublicSettings();

  return (
    <html
      lang="en"
      className={`${inter.variable} ${cormorant.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">
        <SiteChrome settings={settings}>{children}</SiteChrome>
      </body>
    </html>
  );
}
