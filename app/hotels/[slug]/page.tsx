import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import { getToursSafe } from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";

type HotelDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const hotels = await getToursSafe("HOTEL");
  return hotels.map((hotel) => ({ slug: hotel.slug }));
}

export async function generateMetadata({ params }: HotelDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const hotels = await getToursSafe("HOTEL");
  const hotel = hotels.find((item) => item.slug === slug);

  if (!hotel) {
    return {};
  }

  return {
    title: hotel.title,
    description: hotel.shortDescription,
  };
}

export default async function HotelDetailPage({ params }: HotelDetailProps) {
  const { slug } = await params;
  const [hotels, settings] = await Promise.all([
    getToursSafe("HOTEL"),
    getPublicSettings(),
  ]);
  const hotel = hotels.find((item) => item.slug === slug);

  if (!hotel || hotel.contentType !== "HOTEL") {
    notFound();
  }

  return (
    <ContentDetailPage
      allItems={hotels}
      item={hotel}
      kind="HOTEL"
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
