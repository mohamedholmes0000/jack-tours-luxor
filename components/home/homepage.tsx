import Image from "next/image";
import Link from "next/link";
import { DestinationCard } from "@/components/destinations/destination-card";
import { SectionHeading } from "@/components/shared/section-heading";
import { TourCard } from "@/components/tours/tour-card";
import { destinations, tourCategories, tours } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const whyItems = [
  {
    title: "Luxor-based expertise",
    text: "Local planning from the city where Egypt's richest archaeological days begin.",
  },
  {
    title: "Private by default",
    text: "Flexible pacing, trusted guides, and private vehicles for a more composed journey.",
  },
  {
    title: "Fast WhatsApp support",
    text: "Short inquiry flow, clear replies, and practical coordination before and during travel.",
  },
  {
    title: "Tailor-made itineraries",
    text: "Day tours, Nile cruises, and multi-day routes shaped around your dates and style.",
  },
];

const trustItems = ["TripAdvisor rating", "Google rating", "Licensed operator", "Luxor local team", "24/7 support"];

export function Homepage() {
  const featuredTours = tours.filter((tour) => tour.featured).slice(0, 3);
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <>
      <section className="relative min-h-[calc(100vh-5rem)] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src="https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=2200&q=84"
          alt="Golden Egyptian desert landscape with ancient monuments"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-overlay)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,27,42,0.92)] via-transparent to-[rgba(13,27,42,0.18)]" />
        <div className="container-premium relative flex min-h-[calc(100vh-5rem)] items-center py-20">
          <div className="max-w-4xl">
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
              Luxury Egypt Tours & DMC Services
            </p>
            <h1 className="mt-5 font-serif text-6xl font-semibold leading-[0.95] md:text-8xl">
              Discover Egypt Beyond Expectations
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
              Private tailor-made journeys through Egypt, curated by Luxor-based local experts.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link className="btn-primary" href="/trip-planner">
                Plan My Trip
              </Link>
              <a
                className="btn-ghost"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp Us Now
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-premium grid gap-px border-x border-[var(--color-gray-100)] bg-[var(--color-gray-100)] md:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item} className="bg-white px-5 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-20 md:py-28">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Why Jack Tours"
            title="Private Egypt travel with local intelligence and international polish."
            description="The experience is intentionally simple: send a brief, get responsive guidance, and travel with a Luxor-based team that understands both the monuments and the small details."
          />
          <div className="mt-12 grid gap-px bg-[var(--color-gray-100)] md:grid-cols-4">
            {whyItems.map((item) => (
              <div key={item.title} className="bg-white p-7">
                <h3 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Tour styles"
            title="Choose the shape of your Egypt journey."
            description="From a single perfect Luxor day to a multi-city private itinerary, each path begins with a short WhatsApp conversation."
          />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {tourCategories.map((category) => (
              <Link
                key={category}
                href={`/tours?category=${encodeURIComponent(category)}`}
                className="border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-5 transition hover:border-[var(--color-gold)] hover:bg-white"
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  Explore
                </span>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-sand)] py-20 md:py-28">
        <div className="container-premium">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              eyebrow="Featured tours"
              title="Polished private experiences, ready to tailor."
              description="A compact first collection drawn from the MVP seed data."
            />
            <Link className="btn-secondary self-start md:self-auto" href="/tours">
              View All Tours
            </Link>
          </div>
          <div className="mt-12 grid gap-7 lg:grid-cols-3">
            {featuredTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-20 text-white md:py-28">
        <div className="container-premium">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold-light)]">
              Destinations
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-5xl">
              Egypt&apos;s essential places, curated from Luxor outward.
            </h2>
          </div>
          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
        </div>
      </section>

      <section className="bg-white py-20 md:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <div className="relative min-h-96 overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=82"
              alt="Egyptian temple columns in warm light"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Start with WhatsApp
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)] md:text-5xl">
              Tell us your dates, travelers, and the Egypt you want to feel.
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--color-gray-600)]">
              Share the basics and the Jack Tours Luxor team will guide you toward the right tour,
              cruise, or private itinerary.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
                WhatsApp Us Now
              </a>
              <Link className="btn-secondary" href="/trip-planner">
                Open Trip Planner
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
