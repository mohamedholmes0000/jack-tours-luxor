import Image from "next/image";
import Link from "next/link";
import { DestinationCarousel } from "@/components/home/destination-carousel";
import { formatPrice, type Tour } from "@/lib/content";
import { getHomepageCityDestinationsSafe, getToursSafe } from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";
import { safeImageSrc } from "@/lib/images";

// ============================================================================
// Editorial Cartouche homepage — mobile-first, photography-led, magazine grammar.
// All imagery is sourced from Wikimedia Commons and stored locally in
// public/photos/ (downloaded 2026-06). Swap when real shoots arrive.
// ============================================================================

const fallbackHeroImage = "/photos/karnak.jpg";

const brandStoryImage = "/photos/hatshepsut.jpg";

const statsImage = "/photos/felucca.jpg";

const testimonialImage = "/photos/hatshepsut.jpg";

const finalCtaImage = "/photos/felucca.jpg";

// Sprint 1 — hero conversion chips. Each links into the existing /tours page
// with the matching category filter where one exists; "Red Sea Escapes" falls
// back to the unfiltered tours index (no DB category matches it yet).
const tourCategoryCards: ReadonlyArray<{
  label: string;
  href: string;
  image: string;
  note: string;
}> = [
  {
    label: "Day Tours",
    href: "/tours?category=Day%20Tours",
    image: "/photos/karnak.jpg",
    note: "Luxor, temples, private guiding",
  },
  {
    label: "Nile Cruises",
    href: "/tours?category=Nile%20Cruises",
    image: "/photos/nile.jpg",
    note: "Slow river days to Aswan",
  },
  {
    label: "Multi-Day Tours",
    href: "/tours?category=Multi-Day%20Packages",
    image: "/photos/pyramids.jpg",
    note: "Cairo, Luxor, Aswan routes",
  },
  {
    label: "Luxury Tours",
    href: "/tours?category=Luxury%20Tours",
    image: "/photos/hatshepsut.jpg",
    note: "Refined pacing and details",
  },
  {
    label: "Custom Tours",
    href: "/tours?category=Custom%20Egypt%20Tours",
    image: "/photos/felucca.jpg",
    note: "Built around your dates",
  },
];

/*
const destinationsMarquee = [
  {
    name: "Luxor",
    label: "West Bank · East Bank",
    image: "/photos/luxor-temple.jpg",
    href: "/destinations/luxor",
    description: "Temples, tombs, and Nile light from the west bank to Karnak.",
  },
  {
    name: "Karnak",
    label: "Largest temple complex",
    image: "/photos/karnak.jpg",
    href: "/destinations/luxor",
    description: "A vast temple world of pylons, courts, and sacred columns.",
  },
  {
    name: "Valley of the Kings",
    label: "Royal Theban necropolis",
    image: "/photos/valley-of-kings.jpg",
    href: "/destinations/luxor",
    description: "Royal tombs cut into the Theban cliffs for Egypt's pharaohs.",
  },
  {
    name: "Nile",
    label: "Luxor → Aswan",
    image: "/photos/nile.jpg",
    href: "/destinations/aswan",
    description: "Slow river days linking Luxor, Edfu, Kom Ombo, and Aswan.",
  },
  {
    name: "Aswan",
    label: "Nubian south",
    image: "/photos/aswan.jpg",
    href: "/destinations/aswan",
    description: "Nubian color, island temples, feluccas, and soft southern light.",
  },
  {
    name: "Abu Simbel",
    label: "Ramesses II",
    image: "/photos/abu-simbel.jpg",
    href: "/destinations/aswan",
    description: "A dramatic southern extension to the temples of Ramesses II.",
  },
  {
    name: "Red Sea",
    label: "Coastal finale",
    image: "/photos/red-sea.jpg",
    href: "/destinations/hurghada",
    description: "A coastal finale for reefs, rest, and clear Red Sea water.",
  },
];

*/
const whyPoints = [
  {
    eyebrow: "01",
    title: "Luxor-based.",
    text: "We plan from the city where Egypt's archaeological days begin — not from a desk in another country.",
  },
  {
    eyebrow: "02",
    title: "Private by default.",
    text: "Trusted guides, private vehicles, and pacing shaped around your interests, your dates, your light.",
  },
  {
    eyebrow: "03",
    title: "On WhatsApp time.",
    text: "Short inquiry flow, quick replies, practical coordination before, during, and after travel.",
  },
  {
    eyebrow: "04",
    title: "Tailored, not templated.",
    text: "Day tours, Nile cruises, multi-day routes — composed for you, not pulled from a catalog.",
  },
];

const stats: ReadonlyArray<readonly [string, string]> = [
  ["10+", "Years on the ground"],
  ["1,000+", "Travelers hosted"],
  ["50+", "Private routes"],
  ["24/7", "WhatsApp support"],
];

const testimonial = {
  quote:
    "An unforgettable journey from beginning to end. The guides were exceptional, the pacing felt considered, and every small detail was handled with care.",
  name: "Sarah M.",
  origin: "United States",
};

// ----------------------------------------------------------------------------
// Inline JourneyCard — tall, photography-led, homepage-only. Does NOT replace
// the shared TourCard used by /tours; that file is untouched.
// ----------------------------------------------------------------------------
function JourneyCard({ tour, eager = false }: { tour: Tour; eager?: boolean }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group reveal-up relative block aspect-[3/4] overflow-hidden bg-[var(--color-navy)] sm:aspect-[4/5]"
    >
      <Image
        src={tour.heroImage}
        alt={tour.title}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        priority={eager}
        className="object-cover transition-transform duration-[1400ms] ease-out group-hover:scale-[1.06]"
      />
      <div
        aria-hidden
        className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgb(6_17_31_/_20%)] to-transparent"
      />
      <div className="absolute inset-x-0 bottom-0 p-6 sm:p-7">
        <p className="text-[0.6rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
          {tour.category}
          <span className="mx-2 opacity-50">·</span>
          {tour.duration}
        </p>
        <h3 className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.02] text-white sm:text-[2.2rem]">
          {tour.title}
        </h3>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-white/74">{formatPrice(tour)}</span>
          <span className="inline-flex items-center gap-2 text-[0.66rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
            View
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
            >
              →
            </span>
          </span>
        </div>
      </div>
    </Link>
  );
}

// ============================================================================

export async function Homepage() {
  const [safeTours, settings] = await Promise.all([
    getToursSafe(),
    getPublicSettings(),
  ]);
  const destinationCities = await getHomepageCityDestinationsSafe(safeTours);
  const featuredTours = safeTours.filter((tour) => tour.featured).slice(0, 3);
  const heroImage = safeImageSrc(settings.homepageHeroImage, fallbackHeroImage);
  const heroCtaLabel =
    settings.homepageHeroPrimaryCtaLabel || "Plan My Egypt Journey";
  const heroCtaHref = settings.homepageHeroPrimaryCtaHref || "/trip-planner";
  const microTrustLine = [
    settings.homepageTrustItem1,
    settings.homepageTrustItem2,
    settings.homepageTrustItem3,
  ].filter(Boolean);

  return (
    <div data-mobile-cta="true" className="flex flex-col">
      {/* ============================================================
          1 · HERO — full-bleed photography, slow Ken Burns, type in
          a margin (does not cover the temple subject). Single CTA.
      ============================================================ */}
      <section className="relative isolate order-1 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={heroImage}
            alt="Karnak temple columns at first light in Luxor"
            fill
            priority
            sizes="100vw"
            className="ken-burns object-cover"
          />
        </div>
        {/* Bottom-only legibility scrim — keep the photo breathing. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[78%] bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.76)] to-transparent sm:h-[55%] sm:via-[rgba(6,17,31,0.55)]"
        />
        {/* Top eyebrow strip — tiny, restrained. */}
        <div className="absolute inset-0 bg-gradient-to-r from-[rgba(6,17,31,0.78)] via-[rgba(6,17,31,0.34)] to-[rgba(6,17,31,0.12)]" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-[rgba(6,17,31,0.78)] to-transparent sm:h-20" />

        <div className="container-premium relative flex min-h-[calc(100svh-4rem)] flex-col justify-between pb-10 pt-7 sm:min-h-[calc(100svh-4rem)] sm:pb-16 sm:pt-9 lg:min-h-[calc(100vh-6.625rem)] lg:pb-24 lg:pt-12">
          <p className="eyebrow text-[var(--color-gold-light)]">
            {settings.homepageHeroEyebrow}
          </p>
          <p className="hidden">
            Private Egypt · est. Luxor
          </p>

          <div className="max-w-[21.5rem] sm:max-w-md lg:max-w-3xl">
            <h1 className="font-serif font-semibold leading-[0.94] text-white text-[clamp(2.8rem,11vw,9.5rem)]">
              {settings.homepageHeroHeadline}
              <span className="font-accent-serif block italic text-[var(--color-gold-light)]">
                {settings.homepageHeroHeadlineAccent}
              </span>
            </h1>
            <p className="hidden">
              Luxury private Egypt tours — day trips, Nile cruises, and
              tailor-made multi-day packages, quietly arranged by a Luxor-based
              team.
            </p>
            <p className="mt-4 max-w-md text-[0.98rem] leading-7 text-white/86 sm:mt-7 sm:text-lg sm:leading-8 lg:max-w-lg">
              {settings.homepageHeroSubheadline}
            </p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link className="btn-primary" href={heroCtaHref}>
                <span>{heroCtaLabel}</span>
              </Link>
              <Link
                className="group hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 sm:inline-flex"
                href={heroCtaHref}
              >
                <span className="h-px w-8 bg-[var(--color-gold-light)] transition-all duration-300 group-hover:w-12" />
                Or Book Now
              </Link>
            </div>

            {/* Compact reassurance row directly below the CTAs. */}
            <ul className="mt-5 flex flex-col gap-2 border-l border-[rgb(240_204_122_/_40%)] pl-4 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-white/76 sm:mt-7 sm:flex-row sm:flex-wrap sm:border-l-0 sm:pl-0">
              {microTrustLine.map((item, index) => (
                <li key={item} className="flex items-center gap-2 whitespace-nowrap">
                  <span>{item}</span>
                  {index < microTrustLine.length - 1 ? (
                    <span aria-hidden className="hidden text-[var(--color-gold-light)] sm:inline">
                      /
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Tiny scroll cue, desktop-only — corner detail. */}
          <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/60 lg:flex">
            <span>Scroll</span>
            <span aria-hidden className="scroll-cue h-7 w-px bg-white/50" />
          </div>
        </div>
      </section>

      {/* ============================================================
          2 · MOBILE TOUR STYLES — image-backed swipe cards.
      ============================================================ */}
      <section className="hidden border-y border-[rgb(214_173_84_/_24%)] bg-[var(--color-navy)] py-7 text-white sm:bg-[var(--color-ivory)] sm:py-5 sm:text-[var(--color-navy)]">
        <div className="container-premium">
          <div className="mb-4 flex items-end justify-between gap-4 sm:hidden">
            <div>
              <p className="eyebrow text-[var(--color-gold-light)]">
                Choose your style
              </p>
              <h2 className="mt-2 font-serif text-2xl font-semibold text-white">
                Private Egypt, your way.
              </h2>
            </div>
            <Link
              href="/tours"
              className="shrink-0 text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]"
            >
              All tours
            </Link>
          </div>
          <div className="no-scrollbar -mx-[var(--container-edge,1.25rem)] flex snap-x snap-mandatory flex-nowrap gap-3 overflow-x-auto px-[var(--container-edge,1.25rem)] pb-1 sm:mx-0 sm:flex-wrap sm:justify-center sm:gap-3 sm:overflow-visible sm:px-0">
            {tourCategoryCards.map((category) => (
              <Link
                key={category.label}
                href={category.href}
                className="group relative h-44 w-[74vw] max-w-[18rem] shrink-0 snap-start overflow-hidden border border-[rgb(214_173_84_/_28%)] bg-[var(--color-navy)] shadow-[0_18px_42px_rgb(0_0_0_/_24%)] sm:h-auto sm:w-auto sm:bg-transparent sm:px-4 sm:py-3 sm:shadow-none"
              >
                <Image
                  src={category.image}
                  alt={category.label}
                  fill
                  sizes="(min-width: 640px) 12rem, 74vw"
                  className="object-cover transition duration-500 group-hover:scale-105 sm:hidden"
                />
                <span className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.22)] to-transparent sm:hidden" />
                <span className="absolute inset-x-0 bottom-0 p-4 sm:static sm:p-0">
                  <span className="block text-[0.62rem] font-bold uppercase tracking-[0.2em] text-[var(--color-gold-light)] sm:text-[var(--color-gold-dark)]">
                    {category.label}
                  </span>
                  <span className="mt-2 block max-w-44 text-xs leading-5 text-white/76 sm:hidden">
                    {category.note}
                  </span>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          3 · EDITORIAL PAUSE — pure ivory wall, one serif sentence.
      ============================================================ */}
      <section className="cartouche-pause homepage-note-pause hidden bg-[var(--color-ivory)]">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-dark)]">A note</p>
          <p className="mt-6 font-serif text-[2rem] font-medium leading-[1.18] text-[var(--color-navy)] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.4rem]">
            Egypt is not a checklist.
            <span className="block italic text-[var(--color-gold-dark)]">
              It is a slow reveal.
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================
          8 · FEATURED JOURNEYS — tall photographic cards.
          (Sprint 2: moved up here so tours appear within 1-2 mobile
          scrolls. Comment number left at "8" to preserve original
          numbering; visual order is what matters.)
      ============================================================ */}
      <section className="order-3 bg-[var(--color-ivory)] py-14 sm:py-20">
        <div className="container-premium">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-up max-w-xl">
              <p className="eyebrow">Featured journeys</p>
              <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.06] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
                Polished private experiences,
                <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                  ready to tailor.
                </span>
              </h2>
            </div>
            <Link className="btn-secondary self-start sm:self-auto" href="/tours">
              View all tours
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featuredTours.map((tour, idx) => (
              <JourneyCard key={tour.slug} tour={tour} eager={idx === 0} />
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          4 · BRAND STORY — image left, drop-capped paragraph right.
      ============================================================ */}
      <section className="order-5 bg-[var(--color-ivory)] py-14 sm:py-20">
        <div className="container-premium grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-stretch lg:gap-16">
          <figure className="reveal-up relative aspect-[4/5] w-full overflow-hidden shadow-[0_28px_80px_rgb(87_59_22_/_20%)] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[36rem]">
            <Image
              src={brandStoryImage}
              alt="Hatshepsut mortuary temple in warm afternoon light"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </figure>

          <div className="reveal-up flex flex-col justify-center">
            <p className="eyebrow">Our world</p>
            <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.08] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
              A small team,
              <span className="font-accent-serif italic text-[var(--color-gold-dark)]">
                {" "}
                quietly capable.
              </span>
            </h2>
            <p className="drop-cap mt-7 font-serif text-[1.15rem] leading-[1.6] text-[var(--color-gray-900)] sm:text-[1.25rem] sm:leading-[1.7]">
              We are based in Luxor. We arrange private days at Karnak and the
              Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu
              Simbel, and Red Sea finales. We work in small numbers, with
              trusted guides, on WhatsApp time. Everything else is negotiable.
            </p>
            <div className="mt-8 h-px w-20 bg-[var(--color-gold)]" />
            {/* Stack on mobile to avoid an awkward mid-phrase wrap caused by
                uppercase + 0.22em tracking in a narrow column; inline on sm+. */}
            <p className="mt-5 flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.22em] text-[var(--color-navy)] sm:flex-row sm:items-baseline sm:gap-2">
              <span>Jack Egypt Tour</span>
              <span className="font-medium text-[var(--color-gray-600)]">
                <span aria-hidden className="mr-1 hidden sm:inline">/</span>
                Luxor, Upper Egypt
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ============================================================
          5 · DESTINATIONS MARQUEE — auto-scrolling cinematic strip.
      ============================================================ */}
      <section className="relative order-2 overflow-hidden bg-[var(--color-ivory)] py-14 text-[var(--color-navy)] sm:py-20">
        <div className="container-premium reveal-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-[var(--color-gold-dark)]">
                Where we travel
              </p>
              <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.08] sm:text-[2.25rem] md:text-[2.625rem]">
                From the Nile,
                <span className="font-accent-serif italic text-[var(--color-gold-dark)]">
                  {" "}
                  outward.
                </span>
              </h2>
            </div>
            <Link
              href="/destinations"
              className="self-start text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)] sm:self-auto"
            >
              All destinations →
            </Link>
          </div>
        </div>

        <DestinationCarousel items={destinationCities} />
      </section>

      {/* ============================================================
          6 · EDITORIAL PAUSE — pure navy, one italic line.
      ============================================================ */}
      <section className="cartouche-pause hidden bg-[var(--color-navy)] text-white">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-light)]">Method</p>
          <p className="mt-6 font-serif text-[2rem] font-medium leading-[1.18] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.4rem]">
            Begin in Luxor.
            <span className="block italic text-[var(--color-gold-light)]">
              The rest follows.
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================
          7 · WHY JACK — editorial split, no boxy cards.
      ============================================================ */}
      <section className="order-4 bg-[var(--color-ivory)] py-14 sm:py-20">
        <div className="container-premium grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="reveal-up max-w-md">
            <p className="eyebrow">Why Jack Egypt Tour</p>
            <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.06] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
              Private Egypt travel
              <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                with local intelligence.
              </span>
            </h2>
            <p className="mt-6 text-base leading-7 text-[var(--color-gray-600)] sm:text-lg sm:leading-8">
              Send a short brief. Receive considered guidance. Travel with a
              Luxor team that understands both the monuments and the small
              details around them.
            </p>
          </div>

          <ul className="reveal-up flex flex-col">
            {whyPoints.map((item, idx) => (
              <li
                key={item.title}
                className={`grid grid-cols-[auto_1fr] gap-x-6 gap-y-2 py-6 sm:gap-x-10 sm:py-8 ${
                  idx === 0
                    ? "border-y border-[rgb(214_173_84_/_30%)]"
                    : "border-b border-[rgb(214_173_84_/_30%)]"
                }`}
              >
                <p className="font-serif text-3xl font-medium text-[var(--color-gold-dark)] sm:text-4xl">
                  {item.eyebrow}
                </p>
                <div>
                  <h3 className="font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)] sm:text-[1.85rem]">
                    {item.title}
                  </h3>
                  <p className="mt-3 max-w-md text-sm leading-7 text-[var(--color-gray-600)] sm:text-base sm:leading-7">
                    {item.text}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          9 · FULL-BLEED STATS — single photograph + corner stats.
      ============================================================ */}
      <section className="relative isolate order-6 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={statsImage}
            alt="Felucca on the Nile in late-afternoon light"
            fill
            sizes="100vw"
            className="object-cover opacity-70"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-[rgba(6,17,31,0.65)] via-[rgba(6,17,31,0.35)] to-[rgba(6,17,31,0.85)]"
        />
        <div className="container-premium relative grid min-h-[70vh] grid-cols-2 content-between gap-6 py-14 sm:min-h-[80vh] sm:py-20 lg:grid-cols-4">
          {stats.map(([value, label], idx) => (
            <div
              key={label}
              className={`reveal-up flex flex-col ${
                idx % 2 === 0 ? "items-start text-left" : "items-end text-right"
              } lg:items-start lg:text-left ${
                idx >= 2 ? "self-end" : "self-start"
              } lg:self-start`}
            >
              <p className="font-serif text-[3.2rem] font-medium leading-none text-[var(--color-gold-light)] sm:text-[4.5rem] lg:text-[5.5rem]">
                {value}
              </p>
              <div className="mt-2 h-px w-10 bg-[var(--color-gold-light)] opacity-70" />
              <p className="mt-3 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-white/80 sm:text-xs">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ============================================================
         10 · EDITORIAL PAUSE — pure ivory.
      ============================================================ */}
      <section className="cartouche-pause order-7 bg-[var(--color-ivory)]">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-dark)]">Travelers</p>
          <p className="mt-6 font-serif text-[1.9rem] font-bold leading-[1.18] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
            Loved quietly,
            <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
              from everywhere.
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================
         11 · PHOTOGRAPHIC TESTIMONIAL — full bleed, quote overlay.
      ============================================================ */}
      <section className="relative isolate order-8 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={testimonialImage}
            alt="Hatshepsut temple colonnade in warm late-afternoon light"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.55)] to-[rgba(6,17,31,0.15)]"
        />
        <div className="container-premium relative flex min-h-[78vh] flex-col justify-end py-16 sm:min-h-[88vh] sm:py-20 lg:min-h-[92vh] lg:py-24">
          <div className="reveal-up max-w-3xl">
            <p
              aria-hidden
              className="font-serif text-[5rem] leading-none text-[var(--color-gold-light)]/80 sm:text-[7rem]"
            >
              &ldquo;
            </p>
            <blockquote className="-mt-3 font-serif text-[1.6rem] font-medium leading-[1.18] text-white sm:text-[2.2rem] md:text-[2.8rem] lg:text-[3.2rem]">
              {testimonial.quote}
            </blockquote>
            <div className="mt-7 flex items-center gap-4">
              <span className="h-px w-12 bg-[var(--color-gold-light)]" />
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)] sm:text-xs">
                {testimonial.name}
                <span className="ml-2 text-white/65">
                  / {testimonial.origin}
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         12 · FINAL CTA — immersive Nile sunset, single ask.
      ============================================================ */}
      <section className="relative isolate order-9 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={finalCtaImage}
            alt="Felucca on the Nile at sunset between Luxor and Aswan"
            fill
            sizes="100vw"
            className="ken-burns object-cover opacity-65"
          />
        </div>
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.65)] to-[rgba(6,17,31,0.25)]"
        />
        <div className="container-premium relative flex min-h-[72vh] flex-col justify-end pt-16 pb-32 sm:min-h-[80vh] sm:py-20 md:py-28">
          <div className="reveal-up max-w-2xl">
            <p className="eyebrow text-[var(--color-gold-light)]">
              Start your booking
            </p>
            <h2 className="mt-4 font-serif text-[2rem] font-bold leading-[1.04] sm:text-[2.5rem] md:text-[2.625rem]">
              Ready when
              <span className="font-accent-serif block italic text-[var(--color-gold-light)]">
                you are.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:mt-7 sm:text-lg sm:leading-8">
              Share dates, group size, and the places you have in mind. The
              Luxor team will reply with a calm, considered plan.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link
                className="btn-primary"
                href="/trip-planner"
              >
                Book Now
              </Link>
              <Link
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85"
                href="/trip-planner"
              >
                <span className="h-px w-8 bg-[var(--color-gold-light)] transition-all duration-300 group-hover:w-12" />
                Or open the trip planner
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================
         STICKY MOBILE CTA — toned-down navy bar (replaces the global
         FloatingWhatsApp chip on this page via the [data-mobile-cta]
         marker + a :has() rule in globals.css).
      ============================================================ */}
      <div
        className="hidden"
        style={{
          paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <a
          href="/trip-planner"
          className="mx-3 my-2 flex h-11 items-center justify-between gap-3 rounded-sm border border-[rgb(214_173_84_/_30%)] bg-transparent px-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white"
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold-light)]"
            />
            Book Now
          </span>
          <span aria-hidden className="text-[var(--color-gold-light)]">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
