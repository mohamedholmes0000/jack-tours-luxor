import type { Metadata } from "next";
import Image from "next/image";
import { DestinationsListingClient } from "@/components/destinations/destinations-listing-client";
import { getDestinationListingSafe } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Egypt Destinations",
  description:
    "Explore Luxor, Cairo, Aswan, Hurghada, and Alexandria with private Egypt travel planning from Jack Luxor Tour.",
};

export default async function DestinationsPage() {
  const destinations = await getDestinationListingSafe();

  return (
    <>
      <section className="relative grid h-[220px] place-items-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/aswan.jpg"
          alt="Nile landscape in Egypt"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(0_0_0_/_50%)]" />
        <div className="relative px-5">
          <p className="eyebrow text-[12.5px] text-[var(--color-gold-light)]">
            Where We Travel
          </p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">
            Destinations Across Egypt
          </h1>
          <p className="mt-3 text-base text-white/70">
            {destinations.length} {destinations.length === 1 ? "destination" : "destinations"} to explore
          </p>
        </div>
      </section>

      <DestinationsListingClient destinations={destinations} />
    </>
  );
}
