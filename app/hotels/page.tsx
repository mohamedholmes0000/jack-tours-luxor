import type { Metadata } from "next";
import Image from "next/image";
import { ContentCardGrid } from "@/components/content/content-card-grid";
import { getToursSafe } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Egypt Hotels",
  description:
    "Browse hotel options and curated stays arranged by Jack Luxor Tour.",
};

export default async function HotelsPage() {
  const hotels = await getToursSafe("HOTEL");

  return (
    <>
      <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/felucca.jpg"
          alt="Nile river light in Egypt"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(6,17,31,0.55)]" />
        <div className="container-premium relative py-12">
          <p className="eyebrow text-[var(--color-gold-light)]">Curated stays</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">
            Egypt Hotels
          </h1>
          <p className="mt-3 text-base text-white/70">
            {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} available
          </p>
        </div>
      </section>

      <ContentCardGrid emptyLabel="Hotel" items={hotels} />
    </>
  );
}
