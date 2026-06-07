import type { Metadata } from "next";
import { DestinationCard } from "@/components/destinations/destination-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { destinations } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Egypt Destinations",
  description:
    "Explore Luxor, Cairo, Aswan, Hurghada, and Alexandria with private Egypt travel planning from Jack Tours Luxor.",
};

export default function DestinationsPage() {
  return (
    <>
      <section className="bg-[var(--color-navy)] py-20 text-white md:py-28">
        <div className="container-premium">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
            Egypt Destinations
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Curated from Luxor outward.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Start with the essential places and let Jack Tours Luxor shape the route around your
            dates, hotel style, and travel pace.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-16 md:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Where to go"
            title="Elegant Egypt destination planning for private travelers."
            description="Luxor, Cairo, and Aswan form the core. Red Sea and Mediterranean extensions can be added when the itinerary calls for them."
          />
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {destinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl font-semibold text-[var(--color-navy)]">
            Not sure how many days each destination needs?
          </h2>
          <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            Ask on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
