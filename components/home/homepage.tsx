import Image from "next/image";
import Link from "next/link";
import { TourCard } from "@/components/tours/tour-card";
import { tours } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const heroImage =
  "https://images.unsplash.com/photo-1602258409022-1db00d4a9d31?auto=format&fit=crop&w=1800&q=82";

const testimonialImage =
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1400&q=82";

const finalCtaImage =
  "https://images.unsplash.com/photo-1571229709351-8dd880e08b43?auto=format&fit=crop&w=1800&q=82";

const trustItems = [
  "Licensed operator",
  "TripAdvisor 5.0",
  "Google 5.0",
  "Luxor local team",
  "24/7 WhatsApp",
];

const whyItems = [
  {
    eyebrow: "01 / Local",
    title: "Luxor-based expertise",
    text: "We plan from the city where Egypt's richest archaeological days begin — not from a desk in another country.",
  },
  {
    eyebrow: "02 / Private",
    title: "Private by default",
    text: "Flexible pacing, trusted guides, and private vehicles. Your day is shaped around you, not a bus schedule.",
  },
  {
    eyebrow: "03 / Responsive",
    title: "Fast WhatsApp support",
    text: "Short inquiry flow, clear replies, and practical coordination before, during, and after travel.",
  },
  {
    eyebrow: "04 / Tailored",
    title: "Tailor-made itineraries",
    text: "Day tours, Nile cruises, and multi-day routes shaped around your dates, interests, and travel style.",
  },
];

const stats: ReadonlyArray<readonly [string, string]> = [
  ["10+", "Years of experience"],
  ["1,000+", "Happy travelers"],
  ["50+", "Private routes"],
  ["24/7", "WhatsApp support"],
];

const testimonial = {
  quote:
    "An unforgettable experience from start to finish. The guides were exceptional, the pacing felt considered, and every small detail was handled with care.",
  name: "Sarah M.",
  origin: "United States",
};

export function Homepage() {
  const featuredTours = tours.filter((tour) => tour.featured).slice(0, 3);

  return (
    <div data-mobile-cta="true">
      {/* ============================================================
          HERO — mobile first: full-bleed photo, one headline, one CTA.
          Desktop adds a floating "signature route" card on the right.
      ============================================================ */}
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={heroImage}
          alt="Karnak temple columns at golden hour in Luxor, Egypt"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(6,17,31,0.55)] via-[rgba(6,17,31,0.18)] to-[#06111f] sm:bg-gradient-to-r sm:from-[#06111f] sm:via-[rgba(6,17,31,0.7)] sm:to-[rgba(6,17,31,0.15)]"
        />

        <div className="container-premium relative flex min-h-[78vh] flex-col justify-end pb-10 pt-24 sm:min-h-[88vh] sm:justify-end sm:pb-16 sm:pt-32 lg:grid lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-10 lg:pb-24 lg:pt-24">
          <div className="max-w-xl lg:max-w-2xl">
            <p className="eyebrow text-[var(--color-gold-light)]">
              Private Egypt · est. Luxor
            </p>
            <h1 className="mt-4 font-serif text-[2.6rem] font-semibold leading-[0.98] sm:mt-5 sm:text-6xl md:text-7xl lg:text-[5.5rem]">
              Egypt,{" "}
              <span className="italic text-[var(--color-gold-light)]">
                unhurried.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/82 sm:mt-6 sm:max-w-lg sm:text-lg sm:leading-8">
              A Luxor-based team arranging private routes through Karnak, the
              Valley of the Kings, the Nile, Aswan, Abu Simbel, and the Red Sea.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <Link className="btn-primary" href="/trip-planner">
                Plan my trip
              </Link>
              <a
                className="btn-ghost"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp us
              </a>
            </div>
          </div>

          <aside className="hidden self-end lg:block">
            <div className="luxury-card ml-auto max-w-sm p-6 backdrop-blur">
              <p className="eyebrow text-[var(--color-gold-light)]">
                Signature route
              </p>
              <p className="mt-3 font-serif text-3xl font-semibold leading-tight">
                Luxor · Aswan · Cairo
                <span className="block italic text-[var(--color-gold-light)]">
                  eight quiet days.
                </span>
              </p>
              <p className="mt-4 text-sm leading-7 text-white/70">
                Begin with a private temple day, drift south by river, and
                finish in Cairo with the pyramids handled beautifully.
              </p>
              <Link
                href="/tours"
                className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]"
              >
                View itinerary
                <span aria-hidden>→</span>
              </Link>
            </div>
          </aside>
        </div>
      </section>

      {/* ============================================================
          TRUST STRIP — mobile: horizontal scroll, desktop: 5 columns.
      ============================================================ */}
      <section className="border-y border-[rgb(214_173_84_/_22%)] bg-[#050e1a] text-white">
        <div className="container-premium">
          <ul className="flex snap-x snap-mandatory gap-px overflow-x-auto bg-[rgb(214_173_84_/_22%)] md:grid md:grid-cols-5 md:overflow-visible">
            {trustItems.map((item) => (
              <li
                key={item}
                className="flex min-w-[58%] shrink-0 snap-start items-center justify-center bg-[#050e1a] px-5 py-5 text-center sm:min-w-[42%] md:min-w-0"
              >
                <span className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold)] sm:text-xs">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          WHY JACK — stacked editorial cards on mobile, 2×2 / 4×1 up.
      ============================================================ */}
      <section className="section-ivory py-16 sm:py-20 md:py-28">
        <div className="container-premium">
          <div className="max-w-2xl">
            <p className="eyebrow">Why Jack Egypt Tour</p>
            <h2 className="mt-4 font-serif text-[2.1rem] font-semibold leading-tight text-[var(--color-navy)] sm:text-4xl md:text-5xl">
              Private Egypt travel with
              <span className="italic text-[var(--color-gold-dark)]">
                {" "}
                local intelligence.
              </span>
            </h2>
            <p className="mt-4 text-base leading-7 text-[var(--color-gray-600)] sm:mt-5 sm:text-lg sm:leading-8">
              Send a short brief, get responsive guidance, and travel with a
              Luxor team that understands both the monuments and the small
              details.
            </p>
          </div>

          <div className="mt-10 grid gap-px bg-[rgb(214_173_84_/_24%)] sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
            {whyItems.map((item) => (
              <article
                key={item.title}
                className="flex flex-col gap-3 bg-[var(--color-ivory)] p-6 sm:p-7"
              >
                <p className="text-[0.62rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-dark)]">
                  {item.eyebrow}
                </p>
                <h3 className="font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)] sm:text-[1.65rem]">
                  {item.title}
                </h3>
                <p className="text-sm leading-7 text-[var(--color-gray-600)]">
                  {item.text}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          FEATURED TOURS — vertical stack on mobile, grid on desktop.
      ============================================================ */}
      <section className="section-ivory py-16 sm:py-20 md:py-28">
        <div className="container-premium">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-2xl">
              <p className="eyebrow">Featured journeys</p>
              <h2 className="mt-4 font-serif text-[2.1rem] font-semibold leading-tight text-[var(--color-navy)] sm:text-4xl md:text-5xl">
                Polished private experiences,
                <span className="italic text-[var(--color-gold-dark)]">
                  {" "}
                  ready to tailor.
                </span>
              </h2>
            </div>
            <Link className="btn-secondary self-start sm:self-auto" href="/tours">
              View all tours
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:mt-12 sm:grid-cols-2 lg:grid-cols-3">
            {featuredTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          STATS RIBBON — section-dark, mobile 2-col → desktop 4-col.
      ============================================================ */}
      <section className="section-dark pattern-overlay py-14 sm:py-20 md:py-24">
        <div className="container-premium relative">
          <div className="grid gap-px bg-[rgb(214_173_84_/_22%)] grid-cols-2 lg:grid-cols-4">
            {stats.map(([value, label]) => (
              <div
                key={label}
                className="bg-[rgba(6,17,31,0.92)] p-6 text-center sm:p-7"
              >
                <p className="font-serif text-3xl font-semibold text-[var(--color-gold-light)] sm:text-4xl">
                  {value}
                </p>
                <p className="mt-2 text-xs leading-6 text-white/70 sm:text-sm">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          TESTIMONIAL — quote first on mobile, side-by-side on desktop.
      ============================================================ */}
      <section className="section-ivory py-16 sm:py-20 md:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="order-2 lg:order-1">
            <p className="eyebrow">Traveler stories</p>
            <p
              aria-hidden
              className="mt-3 font-serif text-7xl leading-none text-[var(--color-gold)]/40 sm:text-8xl"
            >
              &ldquo;
            </p>
            <blockquote className="-mt-4 font-serif text-2xl font-medium leading-snug text-[var(--color-navy)] sm:text-3xl md:text-[2.4rem] md:leading-[1.15]">
              {testimonial.quote}
            </blockquote>
            <figcaption className="mt-6 text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-navy)] sm:text-sm">
              {testimonial.name}{" "}
              <span className="text-[var(--color-gold-dark)]">
                / {testimonial.origin}
              </span>
            </figcaption>
            <div className="mt-5 h-px w-16 bg-[var(--color-gold)]" />
          </div>

          <figure className="relative order-1 min-h-64 overflow-hidden shadow-[0_28px_80px_rgb(87_59_22_/_18%)] sm:min-h-80 lg:order-2 lg:min-h-[28rem]">
            <Image
              src={testimonialImage}
              alt="Hatshepsut temple colonnade in warm afternoon light"
              fill
              sizes="(min-width: 1024px) 45vw, 100vw"
              className="object-cover"
            />
          </figure>
        </div>
      </section>

      {/* ============================================================
          FINAL WHATSAPP CTA — immersive single-image, single ask.
      ============================================================ */}
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] py-16 text-white sm:py-20 md:py-28">
        <Image
          src={finalCtaImage}
          alt="Nile sailing at sunset between Luxor and Aswan"
          fill
          sizes="100vw"
          className="object-cover opacity-50"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.78)] to-[rgba(6,17,31,0.32)] sm:bg-gradient-to-r"
        />
        <div className="container-premium relative">
          <div className="max-w-2xl">
            <p className="eyebrow text-[var(--color-gold-light)]">
              Start with WhatsApp
            </p>
            <h2 className="mt-4 font-serif text-[2.2rem] font-semibold leading-tight sm:text-4xl md:text-6xl">
              Ready to plan your{" "}
              <span className="italic text-[var(--color-gold-light)]">
                Egypt journey?
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/76 sm:text-lg sm:leading-8">
              Share the basics — dates, group size, must-see places — and the
              Luxor team will guide you toward the right tour, cruise, or
              private itinerary.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
              <a
                className="btn-primary"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp us now
              </a>
              <Link className="btn-secondary" href="/trip-planner">
                Open trip planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
          STICKY MOBILE WHATSAPP CTA — visible only on mobile.
          Hides the global FloatingWhatsApp chip via globals.css rule
          targeting [data-mobile-cta] on this homepage.
      ============================================================ */}
      <div
        aria-hidden="false"
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgb(214_173_84_/_30%)] bg-[rgba(6,17,31,0.96)] p-3 backdrop-blur md:hidden"
        style={{
          paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="flex h-12 w-full items-center justify-center gap-2 rounded-sm bg-[linear-gradient(135deg,#f0cc7a,#d6ad54)] text-[0.72rem] font-bold uppercase tracking-[0.14em] text-[var(--color-navy)] shadow-[0_10px_28px_rgb(214_173_84_/_28%)]"
        >
          <span aria-hidden>✦</span>
          Plan via WhatsApp
          <span aria-hidden>→</span>
        </a>
      </div>
    </div>
  );
}
