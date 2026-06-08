import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/tours/tour-card";
import { tourCategories } from "@/lib/content";
import { getToursSafe } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Private Egypt Tours",
  description:
    "Browse private Luxor tours, Nile cruises, luxury Egypt tours, and tailor-made itineraries from Jack Tours Luxor.",
};

type ToursPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function ToursPage({ searchParams }: ToursPageProps) {
  const params = await searchParams;
  const tours = await getToursSafe();
  const activeCategory = params?.category;
  const visibleTours = activeCategory
    ? tours.filter((tour) => tour.category === activeCategory)
    : tours;

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-navy)] py-20 text-white md:py-32">
        <Image
          src="https://images.unsplash.com/photo-1602258409022-1db00d4a9d31?auto=format&fit=crop&w=1800&q=82"
          alt="Luxor temple at golden hour"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-46"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.82)] to-[rgba(6,17,31,0.35)]" />
        <div className="container-premium relative">
          <p className="eyebrow text-[var(--color-gold-light)]">Private Egypt Tours</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Handpicked journeys <span className="italic text-[var(--color-gold-light)]">just for you.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Browse polished starting points, then ask for availability, refinements, or a private
            proposal directly on WhatsApp.
          </p>
        </div>
      </section>

      <section className="section-dark border-y border-[rgb(214_173_84_/_22%)] py-8">
        <div className="container-premium flex gap-3 overflow-x-auto pb-2">
          <Link
            href="/tours"
            className={`shrink-0 border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] ${
              !activeCategory
                ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                : "border-[rgb(214_173_84_/_32%)] text-white"
            }`}
          >
            All
          </Link>
          {tourCategories.map((category) => (
            <Link
              key={category}
              href={`/tours?category=${encodeURIComponent(category)}`}
              className={`shrink-0 border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] ${
                activeCategory === category
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                  : "border-[rgb(214_173_84_/_32%)] text-white"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow={activeCategory ?? "All tours"}
            title="Choose a starting point, then tailor the details."
            description="Prices are guide points for inquiry. Final proposals depend on dates, group size, hotel level, and preferred pacing."
          />
          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-3">
            {visibleTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark pattern-overlay py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div className="relative">
            <p className="eyebrow text-[var(--color-gold-light)]">Need advice?</p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-white">
              Ask us which tour fits your dates.
            </h2>
          </div>
          <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            WhatsApp Jack Tours
          </a>
        </div>
      </section>
    </>
  );
}
