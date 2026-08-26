import type { Metadata } from "next";
import Image from "next/image";
import { ToursListingClient } from "@/components/tours/tours-listing-client";
import { getToursSafe } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Private Egypt Tours",
  description:
    "Browse private Luxor tours, Nile cruises, luxury Egypt tours, and tailor-made itineraries from Jack Luxor Tour.",
};

type ToursPageProps = {
  searchParams?: Promise<{
    category?: string;
    journey?: string;
    destination?: string;
    durationMin?: string;
    durationMax?: string;
    priceMin?: string;
    priceMax?: string;
  }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const [params, tours] = await Promise.all([searchParams, getToursSafe()]);

  return (
    <>
      <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/karnak.jpg"
          alt="Luxor temple columns in warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(6,17,31,0.5)]" />
        <div className="container-premium relative py-12">
          <p className="eyebrow text-[var(--color-gold-light)]">Explore our tours</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">
            Private Egypt Experiences
          </h1>
          <p className="mt-3 text-base text-white/70">
            {tours.length} {tours.length === 1 ? "tour" : "tours"} available
          </p>
        </div>
      </section>

      <ToursListingClient
        tours={tours}
        initialCategory={params?.category}
        initialJourney={params?.journey}
        initialDestination={params?.destination}
        initialDurationMin={params?.durationMin}
        initialDurationMax={params?.durationMax}
        initialPriceMin={params?.priceMin}
        initialPriceMax={params?.priceMax}
      />
    </>
  );
}
