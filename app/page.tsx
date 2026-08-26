import type { Metadata } from "next";
import { Homepage } from "@/components/home/homepage";
import { JsonLd, organizationJsonLd } from "@/lib/seo";

export const metadata: Metadata = {
  title: "Luxury Egypt Private Tours & DMC Services",
  description:
    "Discover private Luxor tours, Nile cruises, tailor-made Egypt itineraries, and DMC support from Jack Luxor Tour.",
};

export default function Home() {
  return (
    <>
      <JsonLd data={organizationJsonLd()} />
      <Homepage />
    </>
  );
}
