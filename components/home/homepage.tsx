import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Tour } from "@/lib/content";
import { getToursSafe } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

// ============================================================================
// Editorial Cartouche homepage — mobile-first, photography-led, magazine grammar.
// All imagery is sourced from Wikimedia Commons and stored locally in
// public/photos/ (downloaded 2026-06). Swap when real shoots arrive.
// ============================================================================

const heroImage = "/photos/karnak.jpg";

const brandStoryImage = "/photos/hatshepsut.jpg";

const statsImage = "/photos/felucca.jpg";

const testimonialImage = "/photos/hatshepsut.jpg";

const finalCtaImage = "/photos/felucca.jpg";

const trustLine = [
  "Licensed operator",
  "TripAdvisor 5.0",
  "Google 5.0",
  "Luxor local team",
  "24/7 WhatsApp",
];

// Sprint 1 — hero conversion chips. Each links into the existing /tours page
// with the matching category filter where one exists; "Red Sea Escapes" falls
// back to the unfiltered tours index (no DB category matches it yet).
const heroCategories: ReadonlyArray<{ label: string; href: string }> = [
  { label: "Day Tours", href: "/tours?category=Day%20Tours" },
  { label: "Nile Cruises", href: "/tours?category=Nile%20Cruises" },
  { label: "Multi-Day Tours", href: "/tours?category=Multi-Day%20Packages" },
  { label: "Private Egypt Trips", href: "/tours?category=Custom%20Egypt%20Tours" },
  { label: "Red Sea Escapes", href: "/tours" },
];

const destinationsMarquee = [
  {
    name: "Luxor",
    label: "West Bank · East Bank",
    image: "/photos/luxor-temple.jpg",
  },
  {
    name: "Karnak",
    label: "Largest temple complex",
    image: "/photos/karnak.jpg",
  },
  {
    name: "Valley of the Kings",
    label: "Royal Theban necropolis",
    image: "/photos/valley-of-kings.jpg",
  },
  {
    name: "Nile",
    label: "Luxor → Aswan",
    image: "/photos/nile.jpg",
  },
  {
    name: "Aswan",
    label: "Nubian south",
    image: "/photos/aswan.jpg",
  },
  {
    name: "Abu Simbel",
    label: "Ramesses II",
    image: "/photos/abu-simbel.jpg",
  },
  {
    name: "Red Sea",
    label: "Coastal finale",
    image: "/photos/red-sea.jpg",
  },
];

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
  const safeTours = await getToursSafe();
  const featuredTours = safeTours.filter((tour) => tour.featured).slice(0, 3);
  const marqueeItems = [...destinationsMarquee, ...destinationsMarquee];

  return (
    <div data-mobile-cta="true">
      {/* ============================================================
          1 · HERO — full-bleed photography, slow Ken Burns, type in
          a margin (does not cover the temple subject). Single CTA.
      ============================================================ */}
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] text-white">
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
          className="absolute inset-x-0 bottom-0 h-[60%] bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.55)] to-transparent sm:h-[55%]"
        />
        {/* Top eyebrow strip — tiny, restrained. */}
        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[rgba(6,17,31,0.55)] to-transparent sm:h-20" />

        <div className="container-premium relative flex min-h-[92vh] flex-col justify-between pb-12 pt-7 sm:min-h-[95vh] sm:pb-16 sm:pt-9 lg:min-h-[100vh] lg:pb-24 lg:pt-12">
          <p className="eyebrow text-[var(--color-gold-light)]">
            Private Egypt · est. Luxor
          </p>

          <div className="max-w-[20rem] sm:max-w-md lg:max-w-3xl">
            <h1 className="font-serif font-semibold leading-[0.92] text-white text-[clamp(3rem,12.5vw,9.5rem)]">
              Egypt,
              <span className="block italic text-[var(--color-gold-light)]">
                unhurried.
              </span>
            </h1>
            <p className="mt-5 max-w-md text-base leading-7 text-white/82 sm:mt-7 sm:text-lg sm:leading-8 lg:max-w-lg">
              Luxury private Egypt tours — day trips, Nile cruises, and
              tailor-made multi-day packages, quietly arranged by a Luxor-based
              team.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link className="btn-primary" href="/tours">
                Explore tours
              </Link>
              <a
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                <span className="h-px w-8 bg-[var(--color-gold-light)] transition-all duration-300 group-hover:w-12" />
                Or message on WhatsApp
              </a>
            </div>

            {/* Sprint 1 — elegant category chip row directly below the CTAs.
                Mobile: horizontal snap-scroll (no wrap, no clipping).
                Desktop: same chips wrap naturally. Each chip is a real link
                into /tours with a category filter where one exists. */}
            <nav
              aria-label="Tour categories"
              className="mt-6 mb-20 sm:mt-8 sm:mb-0 -mx-[var(--container-edge,1.25rem)] sm:mx-0"
            >
              <ul className="flex snap-x snap-mandatory items-center gap-2 overflow-x-auto px-[var(--container-edge,1.25rem)] pb-1 sm:flex-wrap sm:gap-3 sm:overflow-visible sm:px-0">
                {heroCategories.map((cat) => (
                  <li key={cat.label} className="shrink-0 snap-start">
                    <Link
                      href={cat.href}
                      className="inline-flex items-center rounded-sm border border-[rgb(214_173_84_/_38%)] bg-[rgba(214,173,84,0.06)] px-3 py-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)] backdrop-blur-[2px] transition hover:border-[var(--color-gold-light)] hover:bg-[rgba(214,173,84,0.16)] hover:text-white sm:px-4 sm:text-[0.66rem]"
                    >
                      {cat.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Tiny scroll cue, desktop-only — corner detail. */}
          <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 text-[0.6rem] font-bold uppercase tracking-[0.22em] text-white/60 lg:flex">
            <span>Scroll</span>
            <span aria-hidden className="scroll-cue h-7 w-px bg-white/50" />
          </div>
        </div>
      </section>

      {/* ============================================================
          2 · RESTRAINED TRUST LINE — single quiet line, navy on ivory.
      ============================================================ */}
      <section className="border-y border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)]">
        <div className="container-premium">
          <ul className="flex snap-x snap-mandatory items-center gap-x-8 overflow-x-auto py-4 text-[0.62rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gray-600)] sm:justify-center sm:py-5">
            {trustLine.map((item, idx) => (
              <li
                key={item}
                className="flex shrink-0 snap-start items-center gap-x-8"
              >
                <span className="whitespace-nowrap">{item}</span>
                {idx < trustLine.length - 1 ? (
                  <span aria-hidden className="text-[var(--color-gold)]">
                    ✦
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ============================================================
          3 · EDITORIAL PAUSE — pure ivory wall, one serif sentence.
      ============================================================ */}
      <section className="cartouche-pause bg-[var(--color-ivory)]">
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
      <section className="bg-[var(--color-ivory)] pt-16 pb-20 sm:pt-20 sm:pb-24 md:pt-24 md:pb-32">
        <div className="container-premium">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-up max-w-xl">
              <p className="eyebrow">Featured journeys</p>
              <h2 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.06] text-[var(--color-navy)] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem]">
                Polished private experiences,
                <span className="block italic text-[var(--color-gold-dark)]">
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
      <section className="bg-[var(--color-ivory)] pb-20 sm:pb-24 md:pb-32">
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
            <h2 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.08] text-[var(--color-navy)] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem]">
              A small team,
              <span className="italic text-[var(--color-gold-dark)]">
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
      <section className="relative overflow-hidden bg-[var(--color-navy)] py-14 text-white sm:py-20">
        <div className="container-premium reveal-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-[var(--color-gold-light)]">
                Where we travel
              </p>
              <h2 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.08] sm:text-[2.6rem] md:text-[3rem]">
                From the Nile,
                <span className="italic text-[var(--color-gold-light)]">
                  {" "}
                  outward.
                </span>
              </h2>
            </div>
            <Link
              href="/destinations"
              className="self-start text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-light)] sm:self-auto"
            >
              All destinations →
            </Link>
          </div>
        </div>

        <div
          className="mt-10 overflow-hidden sm:mt-14"
          aria-label="Destinations marquee"
        >
          <div className="marquee-track flex w-max gap-4 sm:gap-6">
            {marqueeItems.map((item, idx) => (
              <figure
                key={`${item.name}-${idx}`}
                className="relative h-[16rem] w-[14rem] shrink-0 overflow-hidden sm:h-[22rem] sm:w-[18rem] md:h-[26rem] md:w-[21rem]"
              >
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 21rem, (min-width: 640px) 18rem, 14rem"
                  className="object-cover"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-transparent to-transparent"
                />
                <figcaption className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
                  <p className="font-serif text-2xl font-semibold leading-none text-white sm:text-3xl">
                    {item.name}
                  </p>
                  <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
                    {item.label}
                  </p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* ============================================================
          6 · EDITORIAL PAUSE — pure navy, one italic line.
      ============================================================ */}
      <section className="cartouche-pause bg-[var(--color-navy)] text-white">
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
      <section className="bg-[var(--color-ivory)] py-16 sm:py-24 md:py-32">
        <div className="container-premium grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="reveal-up max-w-md">
            <p className="eyebrow">Why Jack Egypt Tour</p>
            <h2 className="mt-4 font-serif text-[2rem] font-semibold leading-[1.06] text-[var(--color-navy)] sm:text-[2.6rem] md:text-[3rem] lg:text-[3.4rem]">
              Private Egypt travel
              <span className="block italic text-[var(--color-gold-dark)]">
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
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] text-white">
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
      <section className="cartouche-pause bg-[var(--color-ivory)]">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-dark)]">Travelers</p>
          <p className="mt-6 font-serif text-[2rem] font-medium leading-[1.18] text-[var(--color-navy)] sm:text-[3rem] md:text-[3.6rem] lg:text-[4.4rem]">
            Loved quietly,
            <span className="block italic text-[var(--color-gold-dark)]">
              from everywhere.
            </span>
          </p>
        </div>
      </section>

      {/* ============================================================
         11 · PHOTOGRAPHIC TESTIMONIAL — full bleed, quote overlay.
      ============================================================ */}
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] text-white">
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
      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] text-white">
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
              Start with WhatsApp
            </p>
            <h2 className="mt-4 font-serif text-[2.4rem] font-semibold leading-[1.02] sm:text-[3.4rem] md:text-[4.8rem] lg:text-[6rem]">
              Ready when
              <span className="block italic text-[var(--color-gold-light)]">
                you are.
              </span>
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:mt-7 sm:text-lg sm:leading-8">
              Share dates, group size, and the places you have in mind. The
              Luxor team will reply with a calm, considered plan.
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <a
                className="btn-primary"
                href={buildWhatsAppUrl()}
                target="_blank"
                rel="noreferrer"
              >
                WhatsApp us now
              </a>
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
        className="fixed inset-x-0 bottom-0 z-40 border-t border-[rgb(214_173_84_/_30%)] bg-[rgba(6,17,31,0.96)] backdrop-blur md:hidden"
        style={{
          paddingBottom: "calc(0.6rem + env(safe-area-inset-bottom, 0px))",
        }}
      >
        <a
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
          className="mx-3 my-2 flex h-11 items-center justify-between gap-3 rounded-sm border border-[rgb(214_173_84_/_30%)] bg-transparent px-4 text-[0.68rem] font-bold uppercase tracking-[0.16em] text-white"
        >
          <span className="flex items-center gap-2">
            <span
              aria-hidden
              className="inline-block h-1.5 w-1.5 rounded-full bg-[var(--color-gold-light)]"
            />
            Plan via WhatsApp
          </span>
          <span aria-hidden className="text-[var(--color-gold-light)]">
            →
          </span>
        </a>
      </div>
    </div>
  );
}
