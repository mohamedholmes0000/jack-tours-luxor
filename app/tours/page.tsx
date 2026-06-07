import type { Metadata } from "next";
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
      <section className="bg-[var(--color-navy)] py-20 text-white md:py-28">
        <div className="container-premium">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
            Private Egypt Tours
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Premium tours with a WhatsApp-first planning flow.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Browse the first MVP collection, then ask for availability, refinements, or a private
            proposal directly on WhatsApp.
          </p>
        </div>
      </section>

      <section className="bg-white py-8">
        <div className="container-premium flex gap-3 overflow-x-auto pb-2">
          <Link
            href="/tours"
            className={`shrink-0 border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] ${
              !activeCategory
                ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                : "border-[var(--color-gray-100)] text-[var(--color-navy)]"
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
                  : "border-[var(--color-gray-100)] text-[var(--color-navy)]"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-16 md:py-24">
        <div className="container-premium">
          <SectionHeading
            eyebrow={activeCategory ?? "All tours"}
            title="Choose a starting point, then tailor the details."
            description="Prices are guide points for inquiry. Final proposals depend on dates, group size, hotel level, and preferred pacing."
          />
          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {visibleTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-sand)] py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Need advice?
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
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
