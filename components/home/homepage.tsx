import Image from "next/image";
import Link from "next/link";
import { createElement } from "react";
import { DestinationCarousel } from "@/components/home/destination-carousel";
import { FeaturedJourneysTabs } from "@/components/home/featured-journeys-tabs";
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

const simplifiedHeroEyebrow = "Private Egypt Tours • Based in Luxor";
const simplifiedHeroHeadline = "Private Egypt Tours, Tailored from Luxor";
const simplifiedHeroSubheadline =
  "Plan calm, private journeys across Egypt with trusted local experts, elegant pacing, and seamless WhatsApp support.";

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

function isLegacyHeroHeadline(value: string) {
  const normalized = value.toLowerCase();

  return (
    !normalized ||
    normalized.includes("egypt, privately") ||
    normalized.includes("privatelycomposed") ||
    normalized.includes("privately composed")
  );
}

function isLegacyHeroEyebrow(value: string) {
  const normalized = value.toLowerCase();

  return !normalized || normalized.includes("est. luxor") || normalized.includes("est luxor");
}

function isLegacyHeroSubheadline(value: string) {
  const normalized = value.toLowerCase();

  return (
    !normalized ||
    normalized.includes("luxury private egypt tours") ||
    normalized.includes("tailor-made egypt journeys with private guides")
  );
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

function SearchField({
  label,
  name,
  options,
}: {
  label: string;
  name: string;
  options: string[];
}) {
  return (
    <label className="flex min-h-[58px] flex-col justify-center border-b border-[rgb(6_17_31_/_8%)] px-4 py-3 md:border-b-0 md:border-r md:px-5">
      <span className="font-sans text-[0.7rem] font-medium uppercase tracking-[0.1em] text-[var(--color-gold-dark)]">
        {label}
      </span>
      <select
        name={name}
        className="mt-1 w-full appearance-none bg-transparent font-sans text-sm font-medium text-[var(--color-navy)] outline-none"
        defaultValue=""
      >
        <option value="">Select</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </label>
  );
}

function HomeSearchPanel() {
  return (
    <div className="container-premium relative z-20 -mt-8 sm:-mt-10 lg:-mt-12">
      <div className="home-search-panel relative mx-auto max-w-6xl">
        <input className="home-search-radio" type="radio" id="home-search-tours" name="home-search-tab" defaultChecked />
        <input className="home-search-radio" type="radio" id="home-search-destinations" name="home-search-tab" />
        <input className="home-search-radio" type="radio" id="home-search-plan" name="home-search-tab" />

        <div className="home-search-tabs flex items-end gap-1 pl-0 sm:pl-3">
          <label htmlFor="home-search-tours">Tours</label>
          <label htmlFor="home-search-destinations">Destinations</label>
          <label htmlFor="home-search-plan">Plan Trip</label>
        </div>

        <div className="home-search-card overflow-hidden rounded-b-2xl rounded-tr-2xl border border-[rgb(214_173_84_/_18%)] bg-[rgba(255,252,244,0.98)] shadow-[0_18px_42px_rgb(6_17_31_/_12%)] backdrop-blur-sm">
          <form action="/tours" method="get" className="home-search-content home-search-content-tours md:grid-cols-[1fr_1fr_1fr_auto]">
            <SearchField label="Destination" name="destination" options={["Luxor", "Cairo", "Aswan", "Abu Simbel", "Red Sea"]} />
            <SearchField label="Travel Style" name="style" options={["Private Day Tour", "Nile Cruise", "Multi-Day Journey", "Luxury"]} />
            <SearchField label="Duration" name="duration" options={["Half Day", "Full Day", "2-3 Days", "4+ Days"]} />
            <button type="submit" className="home-search-button">Search</button>
          </form>

          <form action="/destinations" method="get" className="home-search-content home-search-content-destinations md:grid-cols-[1fr_1fr_auto]">
            <SearchField label="Choose Destination" name="destination" options={["Luxor", "Cairo", "Aswan", "Abu Simbel", "Hurghada"]} />
            <SearchField label="Experience Type" name="experience" options={["Temples & Tombs", "Nile & Nubia", "Pyramids", "Red Sea", "Culture"]} />
            <button type="submit" className="home-search-button">Search</button>
          </form>

          <form action="/trip-planner" method="get" className="home-search-content home-search-content-plan md:grid-cols-[1fr_1fr_auto]">
            <SearchField label="Destination" name="destination" options={["Luxor", "Cairo", "Aswan", "Classic Egypt", "Custom Route"]} />
            <SearchField label="Travelers" name="travelers" options={["1 Traveler", "2 Travelers", "3-4 Travelers", "5+ Travelers"]} />
            <button type="submit" className="home-search-button">Start Planning</button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ============================================================================

export async function Homepage() {
  const [safeTours, safeActivities, safeHotels, settings, homepageSettings, topDestinations] = await Promise.all([
    getToursSafe("TOUR"),
    getToursSafe("ACTIVITY"),
    getToursSafe("HOTEL"),
    getPublicSettings(),
    getHomepageSettingsSafe(),
    getHomepageCityDestinationsSafe(),
  ]);
  const featuredTours = safeTours.slice(0, 3);
  const featuredActivities = safeActivities.slice(0, 3);
  const featuredHotels = safeHotels.slice(0, 3);
  const legacyHeroText = cleanHeroText(settings);
  const heroImage = safeImageSrc(homepageSettings.heroBackgroundImage, fallbackHeroImage);
  const heroCtaLabel = homepageSettings.heroPrimaryCtaLabel || "Plan My Egypt Journey";
  const heroCtaHref = homepageSettings.heroPrimaryCtaHref || "/trip-planner";
  const rawHeroHeadline = cleanSettingText(homepageSettings.heroHeadline || legacyHeroText.headline);
  const rawHeroSubheadline = cleanSettingText(homepageSettings.heroSubheadline || legacyHeroText.subheadline);
  const rawHeroEyebrow = cleanSettingText(homepageSettings.heroEyebrow || legacyHeroText.eyebrow);
  const heroText = {
    eyebrow: isLegacyHeroEyebrow(rawHeroEyebrow) ? simplifiedHeroEyebrow : rawHeroEyebrow,
    headline: isLegacyHeroHeadline(rawHeroHeadline) ? simplifiedHeroHeadline : rawHeroHeadline,
    subheadline: isLegacyHeroSubheadline(rawHeroSubheadline)
      ? simplifiedHeroSubheadline
      : rawHeroSubheadline,
  };
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
  const destinationsVisible = homepageSettings.destinationsVisible;
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
          <Image
            src={heroImage}
            alt="Luxor temple columns in warm Egypt light"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
        {/* Bottom-only legibility scrim — keep the photo breathing. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,31,0.82),rgba(6,17,31,0.52)_46%,rgba(6,17,31,0.2)),linear-gradient(0deg,rgba(6,17,31,0.48),rgba(6,17,31,0.16))]"
        />
        {/* Top eyebrow strip — tiny, restrained. */}
        <div className="container-premium relative flex min-h-[500px] flex-col justify-center py-10 text-left md:min-h-[610px] md:items-center md:py-16 md:text-center">
          <div className="max-w-[38rem] md:mx-auto md:max-w-[48rem]">
            <p className="eyebrow mb-3 text-[var(--color-gold-light)] sm:mb-4">
              {heroText.eyebrow}
            </p>
            <h1 className="font-serif text-[clamp(2.2rem,8.2vw,3.3rem)] font-semibold leading-[1.04] text-white drop-shadow-[0_10px_30px_rgb(0_0_0_/_30%)] md:text-[clamp(3.25rem,4.2vw,3.875rem)]">
              {heroText.headline}
            </h1>
            <p className="hero-subheadline mt-3 max-w-[31rem] text-[0.96rem] leading-6 text-white/84 sm:text-base md:mx-auto md:mt-4 md:max-w-[36rem] md:text-[1.05rem] md:leading-7">
              {heroText.subheadline}
            </p>
            <div className="mt-5 flex flex-col items-stretch sm:mt-6 md:items-center">
              <Link className="btn-primary hero-primary-cta" href={heroCtaHref}>
                <span>{heroCtaLabel}</span>
              </Link>
            </div>

          </div>
        </div>
        </section>
      ) : null}

      {/* ============================================================
          2 · DESTINATIONS MARQUEE — auto-scrolling cinematic strip.
      ============================================================ */}
      {destinationsVisible ? (
      <section className="relative order-2 bg-[var(--color-ivory)] pb-8 text-[var(--color-navy)] sm:pb-10">
        <HomeSearchPanel />
      </section>
      ) : null}

      {destinationsVisible ? (
      <section className="order-3 bg-white py-10 text-[var(--color-navy)] sm:py-12 lg:py-14">
        <div className="container-premium text-center">
          <p className="eyebrow text-[var(--color-gold-dark)]">Where we travel</p>
          <h2 className="mt-3 font-serif text-[2.2rem] font-semibold leading-none text-[var(--color-navy)] sm:text-[2.6rem]">
            Top destinations
          </h2>
        </div>
        <DestinationCarousel items={topDestinations} />
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
      <section className="order-4 bg-[var(--color-ivory)] py-10 sm:py-12 lg:py-14">
        <div className="container-premium">
          <div className="reveal-up mx-auto max-w-3xl text-center">
            <p className="eyebrow">{featured.eyebrow}</p>
            <h2 className="mt-3 font-serif text-[2rem] font-semibold leading-[1.08] text-[var(--color-navy)] sm:text-[2.35rem] md:text-[2.65rem]">
                {featuredHeading.before}
                {featuredHeading.showAccent ? (
                  <span className="font-accent-serif ml-2 italic text-[var(--color-gold-dark)]">
                    {featuredHeading.accent}
                  </span>
                ) : null}
                {featuredHeading.after}
            </h2>
            {featured.description ? (
              <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-navy)]/65">
                {featured.description}
              </p>
            ) : null}
            <Link className="mt-5 inline-flex font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)]" href={featured.linkHref}>
              {featured.linkLabel}
            </Link>
          </div>

          <FeaturedJourneysTabs
            activities={featuredActivities}
            hotels={featuredHotels}
            tours={featuredTours}
          />
        </div>
      </section>
      ) : null}

      {/* ============================================================
          4 · WHY JACK — editorial split, no boxy cards.
      ============================================================ */}
      {whyUs.visible ? (
      <section className="order-5 bg-[var(--color-ivory)] py-10 lg:py-16">
        <div className="container-premium">
          <div className="reveal-up mx-auto max-w-3xl text-left sm:text-center">
              <p className="text-[12.5px] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold)]">
                {whyUs.eyebrow}
              </p>
              <h2 className="mt-3 text-[clamp(1.8rem,3vw,2.35rem)] font-semibold leading-[1.12] text-[var(--color-navy)]">
                {whyUsHeading.before}
                {whyUsHeading.showAccent ? (
                  <span className="font-accent-serif italic text-[var(--color-gold)]">
                    {whyUsHeading.accent}
                  </span>
                ) : null}
                {whyUsHeading.after}
              </h2>
              <p className="mx-auto mt-4 max-w-2xl text-sm font-normal leading-6 text-[var(--color-navy)]/68 sm:text-base">
                {whyUs.description}
              </p>
              <Link
                href={whyUs.ctaHref}
                className="mt-5 inline-flex rounded-md bg-[var(--color-gold)] px-5 py-3 text-[12px] font-semibold uppercase tracking-[0.05em] text-[var(--color-navy)] shadow-[0_10px_22px_rgb(201_168_76_/_18%)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)]"
              >
                {whyUs.ctaLabel}
              </Link>
          </div>

          <div className="mt-8 lg:mt-10">
            <h3 className="mb-5 text-center text-xs font-medium uppercase tracking-[0.1em] text-[var(--color-navy)]/50">
              {whyUs.includedHeading}
            </h3>
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3 lg:grid-cols-4">
              {whyUs.services.slice(0, 4).map((service) => (
                  <div
                    key={`${service.icon}-${service.label}`}
                    className="rounded-xl border border-[rgb(214_173_84_/_18%)] bg-white px-3 py-3 text-center shadow-[0_2px_8px_rgb(0_0_0_/_4%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_8%)] sm:px-4 sm:py-4"
                  >
                    {createElement(getLucideIcon(service.icon), {
                      "aria-hidden": true,
                      className: "mx-auto h-5 w-5 text-[var(--color-gold)] sm:h-6 sm:w-6",
                      strokeWidth: 2.2,
                    })}
                    <p className="mt-2 text-xs font-semibold leading-[1.3] text-[var(--color-navy)] sm:text-sm">
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
      {false && ourWorld.visible ? (
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
      {false && homepageStats.visible ? (
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
      <section className="order-7 bg-[var(--color-ivory)] py-10 sm:py-14 lg:py-16">
        <div className="container-premium reveal-up">
          <p className="eyebrow text-[var(--color-gold-dark)]">{testimonialsHeader.eyebrow}</p>
          <p className="mt-3 max-w-2xl font-serif text-[1.75rem] font-semibold leading-[1.12] text-[var(--color-navy)] sm:text-[2.15rem] md:text-[2.35rem]">
            {testimonialsHeading.before}
            {testimonialsHeading.showAccent ? (
              <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                {testimonialsHeading.accent}
              </span>
            ) : null}
            {testimonialsHeading.after}
          </p>
          <div className="mt-7 max-w-2xl rounded-xl border border-[rgb(214_173_84_/_18%)] bg-white px-5 py-5 shadow-[0_3px_14px_rgb(6_17_31_/_6%)] sm:px-6">
            <div aria-hidden className="mb-3 flex gap-1 text-sm text-[var(--color-gold)]">
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
              <span>★</span>
            </div>
            <blockquote className="font-sans text-sm leading-6 text-[var(--color-navy)]/75 sm:text-base">
              {testimonial.quote}
            </blockquote>
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-dark)]">
              {testimonial.name}
              <span className="ml-2 font-medium text-[var(--color-navy)]/45">
                {testimonial.origin}
              </span>
            </p>
          </div>
        </div>
      </section>
      ) : null}

      {/* ============================================================
         11 · PHOTOGRAPHIC TESTIMONIAL — full bleed, quote overlay.
      ============================================================ */}
      {false ? (
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
      ) : null}

      {/* ============================================================
         12 · FINAL CTA — immersive Nile sunset, single ask.
      ============================================================ */}
      {finalCta.visible ? (
      <section className="order-8 bg-[var(--color-navy)] py-12 text-white sm:py-16">
        <div className="container-premium">
          <div className="reveal-up mx-auto max-w-2xl text-left sm:text-center">
            <p className="eyebrow text-[var(--color-gold-light)]">
              {finalCta.eyebrow}
            </p>
            <h2 className="mt-3 font-serif text-[1.85rem] font-semibold leading-[1.08] sm:text-[2.25rem] md:text-[2.45rem]">
              {finalCtaHeading.before}
              {finalCtaHeading.showAccent ? (
                <span className="font-accent-serif block italic text-[var(--color-gold-light)]">
                  {finalCtaHeading.accent}
                </span>
              ) : null}
              {finalCtaHeading.after}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-white/75 sm:text-base">
              {finalCta.description}
            </p>
            <div className="mt-6 flex flex-col items-start sm:items-center">
              <Link
                className="btn-primary"
                href={finalCta.primaryHref}
              >
                {finalCta.primaryLabel}
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
