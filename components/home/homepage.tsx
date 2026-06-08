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

const stats = [
  ["10+", "Years of experience"],
  ["1000+", "Happy travelers"],
  ["50+", "Private routes"],
  ["24/7", "WhatsApp support"],
];

export function Homepage() {
  const featuredTours = tours.filter((tour) => tour.featured).slice(0, 3);
  const featuredDestinations = destinations.slice(0, 3);

  return (
    <>
      <section className="luxury-shell pattern-overlay min-h-[calc(100vh-5rem)] overflow-hidden">
        <Image
          src="https://images.unsplash.com/photo-1539768942893-daf53e448371?auto=format&fit=crop&w=2200&q=84"
          alt="Golden Egyptian desert landscape with ancient monuments"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-overlay)]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.72)] to-[rgba(6,17,31,0.12)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-transparent to-[rgba(6,17,31,0.22)]" />
        <div className="container-premium relative grid min-h-[calc(100vh-5rem)] gap-10 py-16 md:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-4xl">
            <p className="eyebrow text-[var(--color-gold-light)]">
              Luxury Egypt Private Tours & DMC
            </p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-[0.96] sm:text-6xl md:text-8xl">
              Experience Egypt <span className="italic text-[var(--color-gold-light)]">Like Never Before</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/82 md:text-xl">
              Private tours, expert guides, Nile journeys, and unforgettable days shaped by a Luxor-based team.
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
          <div className="hidden self-end lg:block">
            <div className="luxury-card ml-auto max-w-sm p-5 backdrop-blur">
              <p className="eyebrow text-[var(--color-gold-light)]">Signature route</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold leading-tight">
                Luxor, Aswan and Cairo arranged with quiet precision.
              </h2>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Start with a refined private tour, then let us extend the rhythm across Egypt.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark border-y border-[rgb(214_173_84_/_22%)]">
        <div className="container-premium grid gap-px bg-[rgb(214_173_84_/_20%)] md:grid-cols-5">
          {trustItems.map((item) => (
            <div key={item} className="bg-[rgba(6,17,31,0.88)] px-5 py-6 text-center">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                {item}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-ivory py-20 md:py-28">
        <div className="container-premium">
          <SectionHeading
            eyebrow="Why Jack Tours"
            title="Private Egypt travel with local intelligence and international polish."
            description="The experience is intentionally simple: send a brief, get responsive guidance, and travel with a Luxor-based team that understands both the monuments and the small details."
          />
          <div className="mt-12 grid gap-4 md:grid-cols-4">
            {whyItems.map((item) => (
              <div key={item.title} className="border border-[rgb(214_173_84_/_24%)] bg-white/78 p-7 shadow-[0_18px_50px_rgb(87_59_22_/_8%)]">
                <h3 className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {item.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark py-20 md:py-28">
        <div className="container-premium [&_h2]:text-white [&_p]:text-white/70">
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
                className="border border-[rgb(214_173_84_/_24%)] bg-white/[0.04] p-5 text-white transition hover:border-[var(--color-gold)] hover:bg-white/[0.08]"
              >
                <span className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                  Explore
                </span>
                <h3 className="mt-3 font-serif text-2xl font-semibold text-white">
                  {category}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ivory py-20 md:py-28">
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
          <div className="mt-12 grid gap-7 md:grid-cols-2 xl:grid-cols-4">
            {featuredTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      <section className="section-dark pattern-overlay py-20 text-white md:py-28">
        <div className="container-premium">
          <div className="relative max-w-3xl">
            <p className="eyebrow text-[var(--color-gold-light)]">Destinations</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">
              Discover Egypt <span className="italic text-[var(--color-gold-light)]">from Luxor outward.</span>
            </h2>
          </div>
          <div className="relative mt-12 grid gap-6 lg:grid-cols-3">
            {featuredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>
          <div className="relative mt-16 grid gap-px bg-[rgb(214_173_84_/_22%)] sm:grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div key={label} className="bg-[rgba(6,17,31,0.86)] p-7 text-center">
                <p className="font-serif text-4xl font-semibold text-[var(--color-gold-light)]">{value}</p>
                <p className="mt-2 text-sm text-white/70">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ivory py-20 md:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="eyebrow">Traveler stories</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)] md:text-5xl">
              Loved by travelers <span className="italic text-[var(--color-gold-dark)]">from around the world.</span>
            </h2>
            <p className="mt-6 text-lg leading-8 text-[var(--color-gray-600)]">
              An unforgettable experience from start to finish. The guides were amazing, the service
              was exceptional, and every detail felt considered.
            </p>
            <p className="mt-6 text-sm font-bold uppercase tracking-[0.16em] text-[var(--color-navy)]">
              Sarah M. / United States
            </p>
          </div>
          <div className="relative min-h-96 overflow-hidden shadow-[0_28px_80px_rgb(87_59_22_/_18%)]">
            <Image
              src="https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=82"
              alt="Egyptian temple columns in warm light"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-[var(--color-navy)] py-20 text-white md:py-28">
        <Image
          src="https://images.unsplash.com/photo-1571229709351-8dd880e08b43?auto=format&fit=crop&w=1800&q=82"
          alt="Nile sailing at sunset"
          fill
          sizes="100vw"
          className="object-cover opacity-46"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.78)] to-[rgba(6,17,31,0.32)]" />
        <div className="container-premium relative">
          <div className="max-w-3xl">
            <p className="eyebrow text-[var(--color-gold-light)]">Start with WhatsApp</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight md:text-6xl">
              Ready to plan your unforgettable <span className="italic text-[var(--color-gold-light)]">Egypt experience?</span>
            </h2>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/74">
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
