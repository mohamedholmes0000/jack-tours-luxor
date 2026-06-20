import Image from "next/image";
import Link from "next/link";
import { createElement } from "react";
import { DestinationCarousel } from "@/components/home/destination-carousel";
import { HeroImageSlider } from "@/components/home/hero-image-slider";
import { formatPrice, type Tour } from "@/lib/content";
import {
  getHomepageCityDestinationsSafe,
  getHomepageSettingsSafe,
  getToursSafe,
} from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";
import { getLucideIcon } from "@/lib/icons";
import { safeImageSrc } from "@/lib/images";

// ============================================================================
// Editorial Cartouche homepage — mobile-first, photography-led, magazine grammar.
// All imagery is sourced from Wikimedia Commons and stored locally in
// public/photos/ (downloaded 2026-06). Swap when real shoots arrive.
// ============================================================================

const fallbackHeroImage = "/photos/karnak.jpg";

const defaultHeroSliderImages = [
  "/photos/karnak.jpg",
  "/photos/hatshepsut.jpg",
  "/photos/felucca.jpg",
  "/photos/luxor-temple.jpg",
];

const brandStoryImage = "/photos/hatshepsut.jpg";

const statsImage = "/photos/felucca.jpg";

const testimonialImage = "/photos/hatshepsut.jpg";

const finalCtaImage = "/photos/felucca.jpg";

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

const testimonial = {
  quote:
    "An unforgettable journey from beginning to end. The guides were exceptional, the pacing felt considered, and every small detail was handled with care.",
  name: "Sarah M.",
  origin: "United States",
};

const approvedHeroEyebrow = "Private Egypt · est. Luxor";
const approvedHeroHeadline = "Egypt, privately";
const approvedHeroHeadlineAccent = "composed.";
const approvedHeroSubheadline =
  "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.";

function cleanSettingText(value: string | undefined) {
  return (value ?? "")
    .replaceAll("آ·", "·")
    .replace(/\s+/g, " ")
    .trim();
}

function cleanHeroText(settings: Awaited<ReturnType<typeof getPublicSettings>>) {
  const headline = cleanSettingText(settings.homepageHeroHeadline);
  const accent = cleanSettingText(settings.homepageHeroHeadlineAccent);
  const subheadline = cleanSettingText(settings.homepageHeroSubheadline);
  const hasComposedInHeadline =
    headline.includes("privatelycomposed") || headline.includes("privately composed");

  return {
    eyebrow: approvedHeroEyebrow,
    headline: hasComposedInHeadline ? approvedHeroHeadline : headline || approvedHeroHeadline,
    accent: hasComposedInHeadline ? approvedHeroHeadlineAccent : accent || approvedHeroHeadlineAccent,
    subheadline:
      subheadline.includes("Luxury private Egypt tours") || !subheadline
        ? approvedHeroSubheadline
        : subheadline,
  };
}

function splitAccentText(
  headline: string | undefined,
  accent: string | undefined,
  {
    appendMissingAccent = false,
    fallbackHeadline = "",
  }: { appendMissingAccent?: boolean; fallbackHeadline?: string } = {},
) {
  let cleanHeadline = cleanSettingText(headline) || fallbackHeadline;
  const cleanAccent = cleanSettingText(accent);

  if (!cleanAccent) {
    return {
      accent: "",
      after: "",
      before: cleanHeadline,
      showAccent: false,
    };
  }

  const headlineContainsAccent = cleanHeadline.toLowerCase().includes(cleanAccent.toLowerCase());
  if (
    !headlineContainsAccent &&
    appendMissingAccent
  ) {
    cleanHeadline = `${cleanHeadline} ${cleanAccent}`.trim();
  } else if (
    !headlineContainsAccent &&
    cleanHeadline === approvedHeroHeadline &&
    cleanAccent === approvedHeroHeadlineAccent
  ) {
    cleanHeadline = `${cleanHeadline} ${cleanAccent}`;
  }

  const accentIndex = cleanHeadline.toLowerCase().indexOf(cleanAccent.toLowerCase());

  if (accentIndex === -1) {
    return {
      accent: "",
      after: "",
      before: cleanHeadline,
      showAccent: false,
    };
  }

  return {
    accent: cleanHeadline.slice(accentIndex, accentIndex + cleanAccent.length).trim(),
    after: cleanHeadline.slice(accentIndex + cleanAccent.length),
    before: cleanHeadline.slice(0, accentIndex),
    showAccent: true,
  };
}

function splitHeroHeadline(headline: string, accent: string | undefined) {
  return splitAccentText(headline, accent, {
    fallbackHeadline: `${approvedHeroHeadline} ${approvedHeroHeadlineAccent}`,
  });
}

function normalizeHeroTrustBadges(value: string[]) {
  const fallback = [
    "Local Egypt Travel Experts",
    "Private Tailor-Made Tours",
    "WhatsApp Support 24/7",
  ];

  return [0, 1, 2].map((index) => cleanSettingText(value[index]) || fallback[index]);
}

function HeroTrustIcon({ index }: { index: number }) {
  const paths = [
    "M12 4l2.2 5.2 5.3.4-4 3.5 1.2 5.2L12 15.6 7.3 18.3l1.2-5.2-4-3.5 5.3-.4L12 4Z",
    "M5 16c4.8-7.4 9.2-7.4 14 0M7 16h10M12 5v13M8.5 8.5 12 5l3.5 3.5",
    "M12 4a7 7 0 0 1 7 7c0 5-7 9-7 9s-7-4-7-9a7 7 0 0 1 7-7Zm0 4v4l3 2",
  ];

  return (
    <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="none">
      <path
        d={paths[index] || paths[0]}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.45"
      />
    </svg>
  );
}

function primaryCategoryLabel(category: string) {
  return category.replace(/\s*·\s*Custom$/i, "").replace(/\s*\/\s*Custom$/i, "").trim();
}

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
        <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-light)]">
          {primaryCategoryLabel(tour.category)}
        </p>
        <h3 className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.02] text-white sm:text-[2.2rem]">
          {tour.title}
        </h3>
        <div className="mt-5 flex items-center justify-between">
          <span className="text-xs text-white/74">{formatPrice(tour)}</span>
          <span className="inline-flex items-center gap-2 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-light)]">
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
  const [safeTours, settings, homepageSettings] = await Promise.all([
    getToursSafe(),
    getPublicSettings(),
    getHomepageSettingsSafe(),
  ]);
  const destinationCities = await getHomepageCityDestinationsSafe();
  const featuredTours = safeTours.filter((tour) => tour.featured).slice(0, 3);
  const legacyHeroText = cleanHeroText(settings);
  const heroImage = safeImageSrc(homepageSettings.heroBackgroundImage, fallbackHeroImage);
  const heroCtaLabel = homepageSettings.heroPrimaryCtaLabel || "Plan My Egypt Journey";
  const heroCtaHref = homepageSettings.heroPrimaryCtaHref || "/trip-planner";
  const heroSecondaryLabel = homepageSettings.heroSecondaryLinkLabel || "Or Book Now";
  const heroSecondaryHref = homepageSettings.heroSecondaryLinkHref || "/trip-planner";
  const heroSlides = Array.from(new Set([heroImage, ...defaultHeroSliderImages]))
    .filter(Boolean)
    .map((src, index) => ({
      alt: [
        "Karnak temple columns at first light in Luxor",
        "Hatshepsut Temple terraces on the West Bank",
        "A felucca sailing on the Nile",
        "Luxor Temple at golden hour",
      ][index] || "Private Egypt travel scene",
      src,
    }));
  const heroHeadline = splitHeroHeadline(
    homepageSettings.heroHeadline || `${legacyHeroText.headline} ${legacyHeroText.accent}`,
    homepageSettings.heroHeadlineAccent,
  );
  const heroText = {
    eyebrow: cleanSettingText(homepageSettings.heroEyebrow) || legacyHeroText.eyebrow,
    subheadline:
      cleanSettingText(homepageSettings.heroSubheadline) || legacyHeroText.subheadline,
  };
  const microTrustLine = normalizeHeroTrustBadges(homepageSettings.heroTrustBadges);
  const whyUs = {
    ctaHref: homepageSettings.whyCtaHref || "/trip-planner",
    ctaLabel: homepageSettings.whyCtaLabel || "Plan Your Journey",
    description:
      homepageSettings.whyDescription ||
      "From private guides to seamless logistics, we handle every detail of your Egypt experience so you can focus on the wonder.",
    eyebrow: homepageSettings.whyEyebrow || "Why Jack Egypt Tour",
    image1: safeImageSrc(homepageSettings.whyCollageImage1, "/photos/karnak.jpg"),
    image2: safeImageSrc(homepageSettings.whyCollageImage2, "/photos/hatshepsut.jpg"),
    image3: safeImageSrc(homepageSettings.whyCollageImage3, "/photos/felucca.jpg"),
    includedHeading: homepageSettings.whyIncludedHeading || "What's included in every journey",
    services: homepageSettings.whyServices,
    visible: homepageSettings.whyVisible,
  };
  const whyUsHeading = splitAccentText(
    homepageSettings.whyHeading || "Everything you need for a",
    homepageSettings.whyHeadingAccent,
    { appendMissingAccent: true },
  );
  const finalCta = {
    backgroundImage: safeImageSrc(homepageSettings.finalCtaBackgroundImage, finalCtaImage),
    description:
      homepageSettings.finalCtaDescription ||
      "Share dates, group size, and the places you have in mind. The Luxor team will reply with a calm, considered plan.",
    eyebrow: homepageSettings.finalCtaEyebrow || "Start your booking",
    primaryHref: homepageSettings.finalCtaPrimaryButtonHref || "/trip-planner",
    primaryLabel: homepageSettings.finalCtaPrimaryButtonLabel || "Book Now",
    secondaryHref: homepageSettings.finalCtaSecondaryLinkHref || "/trip-planner",
    secondaryLabel: homepageSettings.finalCtaSecondaryLinkLabel || "Or open the trip planner",
    visible: homepageSettings.finalCtaVisible,
  };
  const finalCtaHeading = splitAccentText(
    homepageSettings.finalCtaHeading || "Ready when",
    homepageSettings.finalCtaHeadingAccent,
    { appendMissingAccent: true },
  );
  const destinations = {
    eyebrow: homepageSettings.destinationsEyebrow || "Where we travel",
    linkHref: homepageSettings.destinationsViewAllHref || "/destinations",
    linkLabel: homepageSettings.destinationsViewAllLabel || "All destinations →",
    visible: homepageSettings.destinationsVisible,
  };
  const destinationsHeading = splitAccentText(
    homepageSettings.destinationsHeading || "From the Nile,",
    homepageSettings.destinationsHeadingAccent,
    { appendMissingAccent: true },
  );
  const featured = {
    description: cleanSettingText(homepageSettings.featuredDescription),
    eyebrow: homepageSettings.featuredEyebrow || "Featured journeys",
    linkHref: homepageSettings.featuredViewAllHref || "/tours",
    linkLabel: homepageSettings.featuredViewAllLabel || "View all tours",
    visible: homepageSettings.featuredVisible,
  };
  const featuredHeading = splitAccentText(
    homepageSettings.featuredHeading || "Polished private experiences,",
    homepageSettings.featuredHeadingAccent,
    { appendMissingAccent: true },
  );
  const ourWorld = {
    body:
      homepageSettings.ourWorldBody ||
      "We are based in Luxor. We arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. We work in small numbers, with trusted guides, on WhatsApp time. Everything else is negotiable.",
    eyebrow: homepageSettings.ourWorldEyebrow || "Our world",
    image: safeImageSrc(homepageSettings.ourWorldImage, brandStoryImage),
    location: homepageSettings.ourWorldReadMoreHref || "Luxor, Upper Egypt",
    signature: homepageSettings.ourWorldReadMoreLabel || "Jack Egypt Tour",
    visible: homepageSettings.ourWorldVisible,
  };
  const ourWorldHeading = splitAccentText(
    homepageSettings.ourWorldHeading || "A small team,",
    homepageSettings.ourWorldHeadingAccent,
    { appendMissingAccent: true },
  );
  const homepageStats = {
    backgroundImage: safeImageSrc(homepageSettings.statsBackgroundImage, statsImage),
    items: homepageSettings.statsItems,
    visible: homepageSettings.statsVisible,
  };
  const testimonialsHeader = {
    eyebrow: homepageSettings.testimonialsEyebrow || "Travelers",
    visible: homepageSettings.testimonialsVisible,
  };
  const testimonialsHeading = splitAccentText(
    homepageSettings.testimonialsHeading || "Loved quietly,",
    homepageSettings.testimonialsHeadingAccent,
    { appendMissingAccent: true },
  );

  return (
    <div data-mobile-cta="true" className="flex flex-col">
      {/* ============================================================
          1 · HERO — full-bleed photography, slow Ken Burns, type in
          a margin (does not cover the temple subject). Single CTA.
      ============================================================ */}
      {homepageSettings.heroVisible ? (
        <section data-home-hero="true" className="relative isolate order-1 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <HeroImageSlider images={heroSlides} />
        </div>
        {/* Bottom-only legibility scrim — keep the photo breathing. */}
        <div
          aria-hidden
          className="absolute inset-x-0 bottom-0 h-[86%] bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.72)] to-transparent sm:h-[66%] sm:via-[rgba(6,17,31,0.54)]"
        />
        {/* Top eyebrow strip — tiny, restrained. */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_55%_18%,rgba(255,223,166,0.2),transparent_34%),linear-gradient(90deg,rgba(6,17,31,0.5),rgba(6,17,31,0.12)_48%,rgba(6,17,31,0.38))]" />
        <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(6,17,31,0.5)] to-transparent sm:h-32" />

        <div className="container-premium relative flex min-h-[100svh] flex-col justify-end pb-7 pt-44 sm:pb-12 md:pb-16 lg:pb-20">
          <div className="max-w-[21.5rem] sm:max-w-md lg:max-w-3xl">
            <p className="eyebrow mb-4 text-[var(--color-gold-light)] sm:mb-5">
              {heroText.eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(3.05rem,14vw,6.35rem)] font-semibold leading-[0.98] text-white drop-shadow-[0_10px_30px_rgb(0_0_0_/_38%)] sm:text-[clamp(3.4rem,8vw,6.5rem)]">
              {heroHeadline.before}
              {heroHeadline.showAccent ? (
                <span className="font-accent-serif italic text-[var(--color-gold-light)] drop-shadow-[0_10px_28px_rgb(0_0_0_/_34%)]">
                  {heroHeadline.accent}
                </span>
              ) : null}
              {heroHeadline.after}
            </h1>
            <p className="mt-4 max-w-md text-[0.98rem] leading-7 text-white/86 sm:mt-7 sm:text-lg sm:leading-8 lg:max-w-lg">
              {heroText.subheadline}
            </p>
            <div className="mt-6 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link className="btn-primary hero-primary-cta" href={heroCtaHref}>
                <span>{heroCtaLabel}</span>
              </Link>
              <Link
                className="group hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85 sm:inline-flex"
                href={heroSecondaryHref}
              >
                <span className="h-px w-8 bg-[var(--color-gold-light)] transition-all duration-300 group-hover:w-12" />
                {heroSecondaryLabel}
              </Link>
            </div>

            {/* Compact reassurance row directly below the CTAs. */}
            <ul className="hero-trust-list mt-7 divide-y divide-white/18 border-y border-white/18 text-white/86 sm:mt-8 lg:max-w-2xl">
              {microTrustLine.map((item, index) => (
                <li key={item} className="hero-trust-row flex items-center gap-4 py-3.5 sm:py-4">
                  <span className="hero-trust-icon grid size-12 shrink-0 place-items-center rounded-2xl border border-white/18 bg-white/8 text-[var(--color-gold-light)] shadow-[inset_0_1px_0_rgb(255_255_255_/_14%)] backdrop-blur-sm">
                    <HeroTrustIcon index={index} />
                  </span>
                  <span className="hero-trust-label min-w-0 flex-1 font-sans text-[0.83rem] font-medium uppercase tracking-[0.18em] text-white">
                    {cleanSettingText(item)}
                  </span>
                  <span aria-hidden className="hero-trust-arrow text-2xl leading-none text-[var(--color-gold-light)]">
                    →
                  </span>
                  {false ? (
                    <span
                      aria-hidden
                      className="text-[var(--color-gold-light)]"
                      style={{ whiteSpace: "nowrap" }}
                    >
                      {" · "}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>

          {/* Tiny scroll cue, desktop-only — corner detail. */}
          <div className="absolute bottom-8 right-6 hidden flex-col items-center gap-2 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/60 lg:flex">
            <span>Scroll</span>
            <span aria-hidden className="scroll-cue h-7 w-px bg-white/50" />
          </div>
        </div>
        </section>
      ) : null}

      {/* ============================================================
          2 · DESTINATIONS MARQUEE — auto-scrolling cinematic strip.
      ============================================================ */}
      {destinations.visible ? (
      <section className="relative order-2 overflow-hidden bg-[var(--color-ivory)] py-14 text-[var(--color-navy)] sm:py-20">
        <div className="container-premium reveal-up">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div className="max-w-xl">
              <p className="eyebrow text-[var(--color-gold-dark)]">
                {destinations.eyebrow}
              </p>
              <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.08] sm:text-[2.25rem] md:text-[2.625rem]">
                {destinationsHeading.before}
                {destinationsHeading.showAccent ? (
                  <span className="font-accent-serif italic text-[var(--color-gold-dark)]">
                    {destinationsHeading.accent}
                  </span>
                ) : null}
                {destinationsHeading.after}
              </h2>
            </div>
            <Link
              href={destinations.linkHref}
              className="self-start text-[0.8125rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)] sm:self-auto"
            >
              {destinations.linkLabel}
            </Link>
          </div>
        </div>

        <DestinationCarousel items={destinationCities} />
      </section>
      ) : null}

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
      {featured.visible ? (
      <section className="order-3 bg-[var(--color-ivory)] py-14 sm:py-20">
        <div className="container-premium">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="reveal-up max-w-xl">
              <p className="eyebrow">{featured.eyebrow}</p>
              <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.06] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
                {featuredHeading.before}
                {featuredHeading.showAccent ? (
                  <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                    {featuredHeading.accent}
                  </span>
                ) : null}
                {featuredHeading.after}
              </h2>
              {featured.description ? (
                <p className="mt-5 max-w-xl text-base leading-7 text-[var(--color-gray-700)]">
                  {featured.description}
                </p>
              ) : null}
            </div>
            <Link className="btn-secondary self-start sm:self-auto" href={featured.linkHref}>
              {featured.linkLabel}
            </Link>
          </div>

          <div className="mt-10 grid gap-5 sm:mt-14 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
            {featuredTours.map((tour, idx) => (
              <JourneyCard key={tour.slug} tour={tour} eager={idx === 0} />
            ))}
          </div>
        </div>
      </section>
      ) : null}

      {/* ============================================================
          4 · WHY JACK — editorial split, no boxy cards.
      ============================================================ */}
      {whyUs.visible ? (
      <section className="order-4 bg-[var(--color-ivory)] py-14 lg:py-20">
        <div className="container-premium">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center lg:gap-16">
            <div className="reveal-up max-w-xl">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                {whyUs.eyebrow}
              </p>
              <h2 className="mt-4 max-w-xl text-[clamp(2rem,3.5vw,2.8rem)] font-semibold leading-[1.15] text-[var(--color-navy)]">
                {whyUsHeading.before}
                {whyUsHeading.showAccent ? (
                  <span className="font-accent-serif italic text-[var(--color-gold)]">
                    {whyUsHeading.accent}
                  </span>
                ) : null}
                {whyUsHeading.after}
              </h2>
              <p className="mt-5 max-w-[480px] text-base font-normal leading-[1.7] text-[var(--color-navy)]/70">
                {whyUs.description}
              </p>
              <Link
                href={whyUs.ctaHref}
                className="mt-6 inline-flex rounded-md bg-[var(--color-gold)] px-7 py-3.5 text-[13px] font-semibold uppercase tracking-[0.05em] text-[var(--color-navy)] shadow-[0_12px_30px_rgb(201_168_76_/_22%)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)]"
              >
                {whyUs.ctaLabel}
              </Link>
            </div>

            <div className="reveal-up relative isolate mx-auto w-full max-w-[300px] h-[300px] lg:h-[440px] lg:max-w-[560px]">
              <svg
                aria-hidden="true"
                viewBox="0 0 560 440"
                className="pointer-events-none absolute inset-0 z-0 hidden h-full w-full lg:block"
              >
                <path
                  d="M246 92 C 322 92 332 154 390 164 C 470 178 470 250 386 272 C 316 290 280 332 234 366"
                  fill="none"
                  stroke="rgb(201 168 76 / 0.6)"
                  strokeWidth="2"
                  strokeDasharray="7 9"
                  strokeLinecap="round"
                />
              </svg>
              <svg
                aria-hidden="true"
                viewBox="0 0 32 32"
                className="pointer-events-none absolute left-[288px] top-12 z-20 hidden h-8 w-8 text-[var(--color-gold)] lg:block"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 15 29 5l-9 25-5-11-12-4Z" />
                <path d="m15 19-6 9" />
              </svg>

              <div
                className="absolute z-10 overflow-hidden shadow-[0_14px_34px_rgb(0_0_0_/_14%)] ring-1 ring-[rgb(201_168_76_/_35%)]
                  max-lg:top-0 max-lg:left-0 max-lg:size-[140px] max-lg:rounded-full
                  lg:left-6 lg:top-0 lg:h-[190px] lg:w-[260px] lg:rounded-2xl"
              >
                <Image
                  src={whyUs.image1}
                  alt="Karnak temple columns in Luxor"
                  fill
                  sizes="(min-width: 1024px) 260px, 140px"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute z-10 overflow-hidden shadow-[0_14px_34px_rgb(0_0_0_/_14%)] ring-1 ring-[rgb(201_168_76_/_35%)]
                  max-lg:top-[-10px] max-lg:right-0 max-lg:size-[140px] max-lg:rounded-full
                  lg:right-8 lg:top-16 lg:h-[300px] lg:w-[238px] lg:rounded-2xl"
              >
                <Image
                  src={whyUs.image2}
                  alt="Hatshepsut temple facade"
                  fill
                  sizes="(min-width: 1024px) 238px, 140px"
                  className="object-cover"
                />
              </div>
              <div
                className="absolute z-10 overflow-hidden shadow-[0_14px_34px_rgb(0_0_0_/_14%)] ring-1 ring-[rgb(201_168_76_/_35%)]
                  max-lg:bottom-0 max-lg:left-1/2 max-lg:-translate-x-1/2 max-lg:size-[140px] max-lg:rounded-full
                  lg:bottom-0 lg:left-24 lg:h-[190px] lg:w-[250px] lg:rounded-2xl lg:translate-x-0"
              >
                <Image
                  src={whyUs.image3}
                  alt="Felucca sailing on the Nile"
                  fill
                  sizes="(min-width: 1024px) 250px, 140px"
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          <div className="mt-12 lg:mt-16">
            <h3 className="mb-8 text-center text-sm font-medium uppercase tracking-[0.1em] text-[var(--color-navy)]/50">
              {whyUs.includedHeading}
            </h3>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-6">
              {whyUs.services.map((service) => (
                  <div
                    key={`${service.icon}-${service.label}`}
                    className="min-h-[140px] rounded-xl bg-white px-4 py-6 text-center shadow-[0_2px_8px_rgb(0_0_0_/_4%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_8%)]"
                  >
                    {createElement(getLucideIcon(service.icon), {
                      "aria-hidden": true,
                      className: "mx-auto h-9 w-9 text-[var(--color-gold)]",
                      strokeWidth: 2.4,
                    })}
                    <p className="mt-3 text-sm font-semibold leading-[1.3] text-[var(--color-navy)]">
                      {service.label}
                    </p>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      ) : null}

      {/* ============================================================
          5 · BRAND STORY — image left, drop-capped paragraph right.
      ============================================================ */}
      {ourWorld.visible ? (
      <section className="order-5 bg-[var(--color-ivory)] py-14 sm:py-20">
        <div className="container-premium grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-stretch lg:gap-16">
          <figure className="reveal-up relative aspect-[4/5] w-full overflow-hidden shadow-[0_28px_80px_rgb(87_59_22_/_20%)] sm:aspect-[3/4] lg:aspect-auto lg:min-h-[36rem]">
            <Image
              src={ourWorld.image}
              alt="Hatshepsut mortuary temple in warm afternoon light"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover"
            />
          </figure>

          <div className="reveal-up flex flex-col justify-center">
            <p className="eyebrow">{ourWorld.eyebrow}</p>
            <h2 className="mt-4 font-serif text-[1.9rem] font-bold leading-[1.08] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
              {ourWorldHeading.before}
              {ourWorldHeading.showAccent ? (
                <span className="font-accent-serif italic text-[var(--color-gold-dark)]">
                  {ourWorldHeading.accent}
                </span>
              ) : null}
              {ourWorldHeading.after}
            </h2>
            <p className="drop-cap mt-7 font-serif text-[1.15rem] leading-[1.6] text-[var(--color-gray-900)] sm:text-[1.25rem] sm:leading-[1.7]">
              {ourWorld.body}
            </p>
            <div className="mt-8 h-px w-20 bg-[var(--color-gold)]" />
            {/* Stack on mobile to avoid an awkward mid-phrase wrap caused by
                uppercase + 0.22em tracking in a narrow column; inline on sm+. */}
            <p className="mt-5 flex flex-col gap-1 text-sm font-bold uppercase tracking-[0.22em] text-[var(--color-navy)] sm:flex-row sm:items-baseline sm:gap-2">
              <span>{ourWorld.signature}</span>
              <span className="font-medium text-[var(--color-gray-600)]">
                <span aria-hidden className="mr-1 hidden sm:inline">/</span>
                {ourWorld.location}
              </span>
            </p>
          </div>
        </div>
      </section>
      ) : null}

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
          9 · FULL-BLEED STATS — single photograph + corner stats.
      ============================================================ */}
      {homepageStats.visible ? (
      <section className="relative isolate order-6 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={homepageStats.backgroundImage}
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
        <div className="container-premium relative grid min-h-[70vh] grid-cols-2 content-between gap-8 py-16 sm:min-h-[80vh] sm:py-16 lg:min-h-0 lg:grid-cols-4 lg:content-center lg:items-center lg:gap-x-16 lg:py-20">
          {homepageStats.items.map((item, idx) => (
            <div
              key={`${item.value}-${item.label}`}
              className={`reveal-up flex flex-col ${
                idx % 2 === 0 ? "items-start text-left" : "items-end text-right"
              } lg:items-center lg:text-center ${
                idx >= 2 ? "self-end" : "self-start"
              } lg:self-center`}
            >
              <p className="font-serif text-[clamp(2.5rem,5vw,3.5rem)] font-semibold leading-none text-[var(--color-gold-light)]">
                {item.value}
              </p>
              <div className="mt-2 h-px w-10 bg-[var(--color-gold-light)] opacity-70" />
              <p className="mt-3 text-[0.72rem] font-medium uppercase tracking-[0.12em] text-white/80">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>
      ) : null}

      {/* ============================================================
         10 · EDITORIAL PAUSE — pure ivory.
      ============================================================ */}
      {testimonialsHeader.visible ? (
      <section className="cartouche-pause order-7 bg-[var(--color-ivory)]">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-dark)]">{testimonialsHeader.eyebrow}</p>
          <p className="mt-6 font-serif text-[1.9rem] font-bold leading-[1.18] text-[var(--color-navy)] sm:text-[2.25rem] md:text-[2.625rem]">
            {testimonialsHeading.before}
            {testimonialsHeading.showAccent ? (
              <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                {testimonialsHeading.accent}
              </span>
            ) : null}
            {testimonialsHeading.after}
          </p>
        </div>
      </section>
      ) : null}

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
        <div className="container-premium relative flex min-h-[78vh] flex-col justify-end py-20 sm:min-h-[88vh] sm:py-20 lg:min-h-0 lg:items-center lg:justify-center lg:py-20">
          <div className="reveal-up max-w-3xl lg:mx-auto lg:space-y-6 lg:text-center">
            <p
              aria-hidden
              className="font-serif text-[5rem] leading-none text-[var(--color-gold-light)]/80 sm:text-[7rem] lg:text-[5rem]"
            >
              &ldquo;
            </p>
            <blockquote className="-mt-3 font-serif text-[clamp(1.4rem,2.5vw,1.8rem)] font-normal leading-[1.5] text-white lg:mt-0">
              {testimonial.quote}
            </blockquote>
            <div className="mt-7 flex items-center gap-4 lg:mt-0 lg:justify-center">
              <span className="h-px w-12 bg-[var(--color-gold-light)]" />
              <p className="text-[0.72rem] font-medium uppercase tracking-[0.12em] text-[var(--color-gold-light)]">
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
      {finalCta.visible ? (
      <section className="relative isolate order-9 overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="absolute inset-0">
          <Image
            src={finalCta.backgroundImage}
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
        <div className="container-premium relative flex min-h-[72vh] flex-col justify-end py-20 sm:min-h-[80vh] sm:py-20">
          <div className="reveal-up max-w-2xl">
            <p className="eyebrow text-[var(--color-gold-light)]">
              {finalCta.eyebrow}
            </p>
            <h2 className="mt-4 font-serif text-[2rem] font-bold leading-[1.04] sm:text-[2.5rem] md:text-[2.625rem]">
              {finalCtaHeading.before}
              {finalCtaHeading.showAccent ? (
                <span className="font-accent-serif block italic text-[var(--color-gold-light)]">
                  {finalCtaHeading.accent}
                </span>
              ) : null}
              {finalCtaHeading.after}
            </h2>
            <p className="mt-5 max-w-xl text-base leading-7 text-white/80 sm:mt-7 sm:text-lg sm:leading-8">
              {finalCta.description}
            </p>
            <div className="mt-7 flex flex-col items-start gap-4 sm:mt-9 sm:flex-row sm:items-center">
              <Link
                className="btn-primary"
                href={finalCta.primaryHref}
              >
                {finalCta.primaryLabel}
              </Link>
              <Link
                className="group inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.18em] text-white/85"
                href={finalCta.secondaryHref}
              >
                <span className="h-px w-8 bg-[var(--color-gold-light)] transition-all duration-300 group-hover:w-12" />
                {finalCta.secondaryLabel}
              </Link>
            </div>
          </div>
        </div>
      </section>
      ) : null}

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
