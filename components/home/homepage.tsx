import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ConciergeBell,
  Handshake,
  Headphones,
  MessageCircle,
  Pyramid,
  Star,
} from "lucide-react";
import { DestinationCarousel } from "@/components/home/destination-carousel";
import { HomeFaq } from "@/components/home/home-faq";
import { HowItWorks } from "@/components/home/how-it-works";
import { JourneyDiscovery } from "@/components/home/journey-discovery";
import { PromotionalToursCarousel } from "@/components/home/promotional-tours-carousel";
import { TripFinder } from "@/components/home/trip-finder";
import { HeroImageSlider, type HeroSlide } from "@/components/home/hero-image-slider";
import {
  getFaqsSafe,
  getHomepageCityDestinationsSafe,
  getHomepageSettingsSafe,
  getTestimonialsSafe,
  getToursSafe,
} from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";
import { safeImageSrc } from "@/lib/images";
import { getTourJourneyType } from "@/lib/tour-journey-type";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

// ============================================================================
// Editorial Cartouche homepage — mobile-first, photography-led, magazine grammar.
// All imagery is sourced from Wikimedia Commons and stored locally in
// public/photos/ (downloaded 2026-06). Swap when real shoots arrive.
// ============================================================================

const fallbackHeroImage = "/photos/karnak.jpg";

const brandStoryImage = "/photos/hatshepsut.jpg";

const statsImage = "/photos/felucca.jpg";

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

function normalizeInquiryCtaLabel(value: string | undefined, fallback = "Plan Your Trip") {
  const label = cleanSettingText(value);
  return !label || label.toLowerCase() === "book now" ? fallback : label;
}

const whyReasons = [
  {
    description: "Deep local knowledge and on-the-ground insight bring Egypt to life.",
    icon: Pyramid,
    title: "Local Expertise",
  },
  {
    description: "Tailor-made itineraries designed around your interests and travel style.",
    icon: ConciergeBell,
    title: "Private Planning",
  },
  {
    description: "Carefully selected partners and seamless logistics for total peace of mind.",
    icon: Handshake,
    title: "Trusted Coordination",
  },
  {
    description: "We are with you every step of the way: before, during, and after your journey.",
    icon: Headphones,
    title: "Support Throughout",
  },
];
// Temporary preview fallback for homepage layout review only. These records are
// never persisted and disappear automatically once three CMS reviews exist.
const previewTestimonials = [
  {
    id: "preview-sofia-martinez",
    location: "Spain",
    name: "Sofia Martinez",
    rating: 5,
    source: null,
    text: "Jack Egypt Tour made Egypt feel effortless. Every transfer, temple visit, and local experience was handled with care.",
  },
  {
    id: "preview-marco-bellini",
    location: "Italy",
    name: "Marco Bellini",
    rating: 5,
    source: null,
    text: "Fast WhatsApp replies, a superb private guide, and a Nile journey planned perfectly around our pace.",
  },
  {
    id: "preview-amelia-carter",
    location: "United Kingdom",
    name: "Amelia Carter",
    rating: 5,
    source: null,
    text: "Our Luxor experience felt personal, calm, and beautifully organised from beginning to end.",
  },
];

function TestimonialRating({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div
      className="flex items-center gap-1 text-[var(--color-gold)]"
      role="img"
      aria-label={`${normalizedRating} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className="size-3.5"
          fill={index < normalizedRating ? "currentColor" : "none"}
          strokeWidth={1.7}
        />
      ))}
    </div>
  );
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

// ============================================================================

export async function Homepage() {
  const [
    safeTours,
    settings,
    homepageSettings,
    topDestinations,
    faqs,
    testimonials,
  ] = await Promise.all([
    getToursSafe("TOUR"),
    getPublicSettings(),
    getHomepageSettingsSafe(),
    getHomepageCityDestinationsSafe(),
    getFaqsSafe(),
    getTestimonialsSafe(),
  ]);
  const realTestimonialText = new Set(testimonials.map((item) => item.text.trim().toLowerCase()));
  const previewFill = previewTestimonials.filter(
    (item) => !realTestimonialText.has(item.text.trim().toLowerCase()),
  );
  const isTestimonialPreview = testimonials.length < 3;
  const homepageTestimonials = isTestimonialPreview
    ? [...testimonials, ...previewFill].slice(0, 3)
    : testimonials.slice(0, 3);
  const oneDayTour = safeTours.find(
    (tour) => getTourJourneyType(tour) === "one-day",
  );
  const multiDayTour = safeTours.find(
    (tour) => getTourJourneyType(tour) === "multi-day",
  );
  const discoveryFallbackImage =
    topDestinations[0]?.image || safeTours[0]?.heroImage || fallbackHeroImage;
  const legacyHeroText = cleanHeroText(settings);
  const heroImage = safeImageSrc(homepageSettings.heroBackgroundImage, fallbackHeroImage);
  const configuredHeroCtaLabel = normalizeInquiryCtaLabel(homepageSettings.heroPrimaryCtaLabel);
  const heroCtaLabel =
    configuredHeroCtaLabel.toLowerCase() === "plan my egypt journey"
      ? "Plan Your Trip"
      : configuredHeroCtaLabel;
  const heroCtaHref = homepageSettings.heroPrimaryCtaHref || "/trip-planner";
  const configuredHeroSecondaryLabel = cleanSettingText(homepageSettings.heroSecondaryLinkLabel);
  const heroSecondaryCtaLabel = configuredHeroSecondaryLabel.toLowerCase().includes("whatsapp")
    ? configuredHeroSecondaryLabel.replace(/^or\s+/i, "")
    : "Chat on WhatsApp";
  const heroSecondaryCtaHref = buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber);
  const heroTrustBadges = homepageSettings.heroTrustBadges
    .map((badge) => cleanSettingText(badge))
    .filter(Boolean)
    .slice(0, 3);
  const rawHeroHeadline = cleanSettingText(homepageSettings.heroHeadline || legacyHeroText.headline);
  const rawHeroSubheadline = cleanSettingText(homepageSettings.heroSubheadline || legacyHeroText.subheadline);
  const rawHeroEyebrow = cleanSettingText(homepageSettings.heroEyebrow || legacyHeroText.eyebrow);
  const heroText = {
    eyebrow: rawHeroEyebrow || simplifiedHeroEyebrow,
    headline: rawHeroHeadline || simplifiedHeroHeadline,
    subheadline: rawHeroSubheadline || simplifiedHeroSubheadline,
  };
  const heroHeading = splitAccentText(heroText.headline, homepageSettings.heroHeadlineAccent || legacyHeroText.accent);
  const destinationHeroSlides = topDestinations
    .filter(
      (destination, index, items) =>
        destination.image !== heroImage &&
        items.findIndex((candidate) => candidate.image === destination.image) === index,
    )
    .slice(0, 3)
    .map<HeroSlide>((destination) => ({
      alt: `${destination.name} in Egypt`,
      eyebrow: `Private Egypt · ${destination.name}`,
      headline: {
        before: `Discover ${destination.name}, `,
        accent: "privately.",
        after: "",
        showAccent: true,
      },
      image: destination.image,
      primaryCta: {
        href: destination.href,
        label: `Explore ${destination.name}`,
      },
      secondaryCta: {
        href: heroSecondaryCtaHref,
        label: heroSecondaryCtaLabel,
      },
      subheadline: `${destination.subtitle}. Explore ${destination.name} with a private route shaped around your pace and interests.`,
    }));
  const heroSlides: HeroSlide[] = [
    {
      alt: "Luxor temple columns in warm Egypt light",
      eyebrow: heroText.eyebrow,
      headline: heroHeading,
      image: heroImage,
      primaryCta: {
        href: heroCtaHref,
        label: heroCtaLabel,
      },
      secondaryCta: {
        href: heroSecondaryCtaHref,
        label: heroSecondaryCtaLabel,
      },
      subheadline: heroText.subheadline,
    },
    ...destinationHeroSlides,
  ];
  const legacyWhyHeading = "Everything you need for a";
  const legacyWhyAccent = "perfect Egypt journey";
  const legacyWhyDescription =
    "From private guides to seamless logistics, we handle every detail of your Egypt experience so you can focus on the wonder.";
  const normalizedWhyDescription = cleanSettingText(homepageSettings.whyDescription)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const normalizedLegacyWhyDescription = legacyWhyDescription
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
  const usesLegacyWhyCopy =
    cleanSettingText(homepageSettings.whyHeading) === legacyWhyHeading &&
    cleanSettingText(homepageSettings.whyHeadingAccent) === legacyWhyAccent;

  const whyUs = {
    ctaHref: homepageSettings.whyCtaHref || "/trip-planner",
    ctaLabel: homepageSettings.whyCtaLabel || "Plan Your Journey",
    description:
      !normalizedWhyDescription || normalizedWhyDescription === normalizedLegacyWhyDescription
        ? "Egypt is extraordinary. Its people, places, and stories stay with you forever. We combine local insight with personal service to design journeys that are meaningful and entirely your own."
        : homepageSettings.whyDescription,
    eyebrow: homepageSettings.whyEyebrow || "Why Jack Egypt Tour",
    image1: safeImageSrc(homepageSettings.whyCollageImage1, "/photos/karnak.jpg"),
    visible: homepageSettings.whyVisible,
  };
  const legacyCustomizeDescription =
    "Share your dates, interests, budget, preferred places, and travel style. Jack Egypt Tour will help shape a private Egypt route with local care, flexible pacing, and easy WhatsApp support from first idea to final detail.";
  const customizeTrip = {
    ctaHref: homepageSettings.customizeTripCtaHref || "/trip-planner",
    ctaLabel: homepageSettings.customizeTripCtaLabel || "Plan Your Trip",
    description:
      !homepageSettings.customizeTripDescription || homepageSettings.customizeTripDescription === legacyCustomizeDescription
        ? "Tell us where you want to go, when you are traveling, and what matters most. We turn those details into a clear route, then confirm the stays, guides, and transport with you."
        : homepageSettings.customizeTripDescription,
    eyebrow: homepageSettings.customizeTripEyebrow || "Private planning",
    heading: homepageSettings.customizeTripHeading || "Customize Your Egypt Trip, Your Way",
    image: whyUs.image1,
  };
  const customizeWhatsAppHref = buildWhatsAppUrlForNumber(
    "Hello Jack Egypt Tour, I would like help planning a private Egypt trip.",
    settings.whatsappNumber,
  );

  const whyUsHeading = splitAccentText(
    usesLegacyWhyCopy ? "Local knowledge," : homepageSettings.whyHeading || legacyWhyHeading,
    usesLegacyWhyCopy ? "handled properly." : homepageSettings.whyHeadingAccent,
    { appendMissingAccent: true },
  );
  const finalCta = {
    description:
      homepageSettings.finalCtaDescription ||
      "Share dates, group size, and the places you have in mind. The Luxor team will reply with a calm, considered plan.",
    eyebrow: homepageSettings.finalCtaEyebrow || "Start planning",
    primaryHref: homepageSettings.finalCtaPrimaryButtonHref || "/trip-planner",
    primaryLabel: normalizeInquiryCtaLabel(homepageSettings.finalCtaPrimaryButtonLabel),
    whatsappHref: buildWhatsAppUrlForNumber(
      "Hello Jack Egypt Tour, I would like to start planning a private Egypt trip.",
      settings.whatsappNumber,
    ),
    visible: homepageSettings.finalCtaVisible,
  };
  const finalCtaHeading = splitAccentText(
    homepageSettings.finalCtaHeading || "Ready when",
    homepageSettings.finalCtaHeadingAccent,
    { appendMissingAccent: true },
  );
  const destinationsVisible = homepageSettings.destinationsVisible;
  const configuredDestinationsEyebrow = cleanSettingText(homepageSettings.destinationsEyebrow);
  const destinationsHeader = {
    eyebrow: configuredDestinationsEyebrow === "." ? "" : configuredDestinationsEyebrow,
    linkHref: homepageSettings.destinationsViewAllHref || "/destinations",
    linkLabel: homepageSettings.destinationsViewAllLabel || "All destinations →",
  };
  const destinationsHeading = splitAccentText(
    homepageSettings.destinationsHeading || "Top destinations",
    homepageSettings.destinationsHeadingAccent,
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
    <div className="flex flex-col overflow-x-hidden">
      {/* ============================================================
          1 · HERO — full-bleed photography, slow Ken Burns, type in
          a margin (does not cover the temple subject). Single CTA.
      ============================================================ */}
      {homepageSettings.heroVisible ? (
        <HeroImageSlider slides={heroSlides} trustBadges={heroTrustBadges} />
      ) : null}
      {/* ============================================================
          2 · DESTINATIONS MARQUEE — auto-scrolling cinematic strip.
      ============================================================ */}
      {destinationsVisible ? (
      <section className="relative order-2 bg-[var(--color-ivory)] pb-6 text-[var(--color-navy)] sm:pb-8">
        <TripFinder destinations={topDestinations.map((destination) => destination.name)} />
        <JourneyDiscovery
          oneDayImage={oneDayTour?.heroImage || discoveryFallbackImage}
          multiDayImage={multiDayTour?.heroImage || discoveryFallbackImage}
        />
      </section>
      ) : null}
      {destinationsVisible ? (
      <section className="order-3 bg-white py-8 text-[var(--color-navy)] sm:py-10 lg:py-12">
        <div className="container-premium text-center">
          {destinationsHeader.eyebrow ? (
            <p className="eyebrow text-[var(--color-gold-dark)]">{destinationsHeader.eyebrow}</p>
          ) : null}
          <h2 className="mt-3 font-serif text-[2.2rem] font-semibold leading-none text-[var(--color-navy)] sm:text-[2.6rem]">
            {destinationsHeading.before}
            {destinationsHeading.showAccent ? (
              <span className="font-accent-serif ml-2 italic text-[var(--color-gold-dark)]">
                {destinationsHeading.accent}
              </span>
            ) : null}
            {destinationsHeading.after}
          </h2>
          <Link
            className="mt-4 inline-flex text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)]"
            href={destinationsHeader.linkHref}
          >
            {destinationsHeader.linkLabel}
          </Link>
        </div>
        <DestinationCarousel items={topDestinations} />
      </section>
      ) : null}

      <PromotionalToursCarousel tours={safeTours} />

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
          4 · WHY JACK — editorial split, no boxy cards.
      ============================================================ */}
      <section className="order-5 overflow-hidden bg-white py-8 text-[var(--color-navy)] sm:py-10 lg:py-12">
        <div className="container-premium grid overflow-hidden rounded-[1.5rem] border border-[rgb(6_17_31_/_9%)] bg-[var(--color-ivory)] lg:grid-cols-[1.02fr_0.98fr] lg:items-stretch">
          <div className="reveal-up flex flex-col justify-center px-6 py-7 sm:p-8 lg:px-12 lg:py-10">
            <p className="eyebrow text-[var(--color-gold-dark)]">{customizeTrip.eyebrow}</p>
            <h2 className="mt-3 max-w-xl font-serif text-[clamp(2rem,4vw,2.75rem)] font-semibold leading-[1.08] text-[var(--color-navy)]">
              {customizeTrip.heading}
            </h2>
            <p className="mt-4 max-w-lg font-sans text-[0.94rem] leading-7 text-[var(--color-navy)]/68">
              {customizeTrip.description}
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <Link
                href={customizeTrip.ctaHref}
                className="inline-flex min-h-11 items-center justify-center rounded-md bg-[var(--color-gold)] px-6 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition duration-300 hover:-translate-y-0.5 hover:bg-[var(--color-gold-light)] motion-reduce:transform-none"
              >
                {customizeTrip.ctaLabel}
              </Link>
              <a
                href={customizeWhatsAppHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[rgb(6_17_31_/_28%)] bg-white px-6 font-sans text-[0.74rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-navy)] transition duration-300 hover:-translate-y-0.5 hover:border-[var(--color-gold-dark)] hover:text-[var(--color-gold-dark)] motion-reduce:transform-none"
              >
                <MessageCircle aria-hidden="true" className="size-[1.05rem]" strokeWidth={1.8} />
                Chat on WhatsApp
              </a>
            </div>
          </div>

          <div className="reveal-up h-full w-full">
            <figure className="relative aspect-[16/10] h-full overflow-hidden bg-[var(--color-sand)] sm:aspect-[16/9] lg:min-h-[310px] lg:aspect-auto">
              <Image
                src={customizeTrip.image}
                alt="Private Egypt journey planned by Jack Egypt Tour"
                fill
                unoptimized={customizeTrip.image.startsWith("/uploads/") || customizeTrip.image.startsWith("/api/uploads/")}
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover transition duration-700 hover:scale-[1.025] motion-reduce:transform-none"
              />
              <div aria-hidden="true" className="absolute inset-0 bg-[rgb(6_17_31_/_10%)]" />
            </figure>
          </div>
        </div>
      </section>

      <HowItWorks />

      {whyUs.visible ? (
        <section className="relative isolate order-7 overflow-hidden bg-[var(--color-navy)] text-white lg:min-h-[48rem]">
          <div aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-full lg:w-[68%]">
            <Image
              src="/photos/why-jack-pyramids-night.png"
              alt=""
              fill
              sizes="(min-width: 1024px) 68vw, 100vw"
              className="object-contain object-left-bottom"
            />
          </div>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgb(6_17_31_/_8%)_0%,rgb(6_17_31_/_28%)_34%,rgb(6_17_31_/_88%)_63%,rgb(6_17_31)_100%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgb(6_17_31_/_88%)_0%,rgb(6_17_31_/_30%)_45%,rgb(6_17_31_/_18%)_100%)]"
          />

          <div className="container-premium relative flex items-stretch py-12 sm:py-14 lg:min-h-[48rem] lg:py-12">
            <div className="mx-auto grid w-full max-w-[96rem] gap-12 lg:grid-cols-[minmax(0,0.94fr)_minmax(0,1.06fr)] lg:items-stretch lg:gap-14 xl:gap-20">
              <div className="flex max-w-[43rem] flex-col justify-center lg:justify-start lg:py-2">
                <div className="flex items-center gap-4 text-[var(--color-gold-light)]">
                  <Image
                    src="/icons/egyptian-lotus-gold.png"
                    alt=""
                    width={38}
                    height={38}
                    className="size-8 object-contain sm:size-9"
                  />
                  <p className="text-[0.78rem] font-semibold uppercase tracking-[0.22em] sm:text-[0.9rem]">
                    {whyUs.eyebrow}
                  </p>
                </div>

                <h2 className="font-accent-serif mt-14 !text-[clamp(3.8rem,5vw,5.25rem)] font-medium !leading-[0.93] !tracking-[-0.035em] text-[#f7eddd] sm:mt-16">
                  {usesLegacyWhyCopy ? (
                    <>
                      <span className="block">Local knowledge.</span>
                      <span className="block">Personal care.</span>
                      <span className="block pb-2 italic leading-[1.08] text-[var(--color-gold-light)]">
                        Every detail handled.
                      </span>
                    </>
                  ) : (
                    <>
                      {whyUsHeading.before}
                      {whyUsHeading.showAccent ? (
                        <span className="italic leading-[1.08] text-[var(--color-gold-light)]">
                          {whyUsHeading.accent}
                        </span>
                      ) : null}
                      {whyUsHeading.after}
                    </>
                  )}
                </h2>

                <div aria-hidden="true" className="mt-8 h-0.5 w-20 bg-[var(--color-gold-light)]" />

                <p className="mt-9 max-w-[34rem] text-[0.98rem] leading-8 text-[rgb(247_237_221_/_82%)] sm:text-[1.08rem] sm:leading-9">
                  {whyUs.description}
                </p>

                <Link
                  href={whyUs.ctaHref}
                  className="group mt-11 inline-flex min-h-11 items-center gap-5 border-b border-[var(--color-gold-light)] pb-2 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-gold-light)] outline-none transition-colors hover:text-[#f7eddd] focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)] focus-visible:ring-offset-4 focus-visible:ring-offset-[var(--color-navy)] motion-reduce:transition-none sm:text-[0.78rem]"
                >
                  {whyUs.ctaLabel}
                  <ArrowRight
                    aria-hidden="true"
                    className="size-[1.1rem] transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
                    strokeWidth={1.4}
                  />
                </Link>
              </div>

              <ol className="grid grid-rows-4 border-t border-[rgb(214_173_84_/_30%)] lg:border-t-0">
                {whyReasons.map((reason, index) => {
                  const ReasonIcon = reason.icon;

                  return (
                    <li
                      key={reason.title}
                      className="grid min-h-[8.75rem] grid-cols-[3.25rem_4rem_minmax(0,1fr)] items-center gap-4 border-b border-[rgb(214_173_84_/_30%)] py-5 sm:min-h-[9.5rem] sm:grid-cols-[4.5rem_5.25rem_minmax(0,1fr)] sm:gap-5 lg:min-h-[10.2rem] lg:grid-cols-[6rem_6.5rem_minmax(0,1fr)] lg:gap-6 lg:py-5"
                    >
                      <span
                        aria-hidden="true"
                        className="font-accent-serif flex h-[4.5rem] items-center border-r border-[rgb(214_173_84_/_30%)] text-[2.5rem] font-medium leading-none text-[var(--color-gold-light)] sm:h-[5.8rem] sm:text-[3.5rem] lg:h-[6.5rem] lg:text-[4.4rem]"
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <span className="inline-flex size-14 items-center justify-center rounded-full border-[1.5px] border-[var(--color-gold-light)] text-[var(--color-gold-light)] sm:size-[4.75rem]">
                        <ReasonIcon
                          aria-hidden="true"
                          className="size-6 sm:size-9"
                          strokeWidth={1.25}
                        />
                      </span>

                      <div className="min-w-0">
                        <h3 className="font-accent-serif !text-[1.12rem] font-semibold uppercase !leading-tight !tracking-[0.08em] text-[#f7eddd] sm:!text-[1.4rem] lg:!text-[1.55rem]">
                          {reason.title}
                        </h3>
                        <p className="mt-2.5 max-w-[29rem] text-[0.78rem] leading-5 text-[rgb(247_237_221_/_72%)] sm:text-[0.9rem] sm:leading-6">
                          {reason.description}
                        </p>
                      </div>
                    </li>
                  );
                })}
              </ol>
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
         8 · TRAVELER REVIEWS - CMS reviews with temporary layout previews.
      ============================================================ */}
      {testimonialsHeader.visible && homepageTestimonials.length ? (
        <section className="order-8 bg-white py-10 sm:py-12 lg:py-14">
          <div className="container-premium">
            <div className="mx-auto max-w-6xl">
              <div className="grid gap-5 border-b border-[rgb(6_17_31_/_14%)] pb-6 md:grid-cols-[1fr_auto] md:items-end md:gap-10">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
                      {testimonialsHeader.eyebrow}
                    </p>
                    {isTestimonialPreview ? (
                      <span className="border border-[rgb(183_137_43_/_36%)] px-2 py-1 text-[0.62rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold-dark)]">
                        Layout preview
                      </span>
                    ) : null}
                  </div>
                  <h2 className="mt-3 max-w-3xl font-serif text-[clamp(2rem,3.5vw,3.15rem)] font-semibold leading-[1.03] text-[var(--color-navy)]">
                    {testimonialsHeading.before}
                    {testimonialsHeading.showAccent ? (
                      <span className="font-accent-serif italic text-[var(--color-gold-dark)]">
                        {testimonialsHeading.accent}
                      </span>
                    ) : null}
                    {testimonialsHeading.after}
                  </h2>
                </div>
                <p className="max-w-sm text-sm leading-6 text-[var(--color-navy)]/58 md:text-right">
                  A closer look at the care, pacing, and local coordination behind each journey.
                </p>
              </div>

              <div className="mt-6 grid gap-4 lg:grid-cols-12">
                <article className="flex flex-col justify-between bg-[var(--color-navy)] p-6 text-white sm:p-7 lg:col-span-5 lg:min-h-[18rem]">
                  <div>
                    <TestimonialRating rating={homepageTestimonials[0].rating} />
                    <blockquote className="mt-5 border-l border-[var(--color-gold)] pl-5 font-serif text-[clamp(1.35rem,2.1vw,1.8rem)] leading-[1.35]">
                      {homepageTestimonials[0].text}
                    </blockquote>
                  </div>
                  <footer className="mt-7 flex flex-wrap items-end justify-between gap-3 border-t border-white/16 pt-4">
                    <div>
                      <p className="text-sm font-semibold">{homepageTestimonials[0].name}</p>
                      {homepageTestimonials[0].location ? (
                        <p className="mt-1 text-xs text-white/58">{homepageTestimonials[0].location}</p>
                      ) : null}
                    </div>
                    {homepageTestimonials[0].source ? (
                      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-light)]">
                        {homepageTestimonials[0].source}
                      </p>
                    ) : null}
                  </footer>
                </article>

                <div className="grid gap-4 sm:grid-cols-2 lg:col-span-7">
                  {homepageTestimonials.slice(1, 3).map((review) => (
                    <article
                      key={review.id}
                      className="flex h-full flex-col justify-between border border-[rgb(6_17_31_/_12%)] bg-[var(--color-ivory)] p-6 sm:p-7"
                    >
                      <div>
                        <TestimonialRating rating={review.rating} />
                        <blockquote className="mt-5 font-serif text-[1.25rem] leading-[1.42] text-[var(--color-navy)] sm:text-[1.35rem]">
                          {review.text}
                        </blockquote>
                      </div>
                      <footer className="mt-7 border-t border-[rgb(6_17_31_/_12%)] pt-4">
                        <p className="text-sm font-semibold text-[var(--color-navy)]">{review.name}</p>
                        <div className="mt-1 flex flex-wrap gap-x-3 gap-y-1 text-xs">
                          {review.location ? <span className="text-[var(--color-navy)]/52">{review.location}</span> : null}
                          {review.source ? <span className="text-[var(--color-gold-dark)]">{review.source}</span> : null}
                        </div>
                      </footer>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================
         9 · FAQ - controlled accessible accordion.
      ============================================================ */}
      {faqs.length ? (
        <section className="order-9 border-y border-[rgb(6_17_31_/_8%)] bg-[var(--color-ivory)] py-10 sm:py-12 lg:py-14">
          <div className="container-premium">
            <div className="mx-auto grid max-w-6xl gap-9 lg:grid-cols-[0.82fr_1.18fr] lg:gap-16 xl:gap-20">
              <div className="max-w-lg lg:self-start">
                <p className="text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
                  FAQ
                </p>
                <h2 className="mt-3 font-serif text-[clamp(2.1rem,3.8vw,3.4rem)] font-semibold leading-[1.02] text-[var(--color-navy)]">
                  Clear answers,
                  <span className="font-accent-serif block italic text-[var(--color-gold-dark)]">
                    before you travel.
                  </span>
                </h2>
                <p className="mt-5 max-w-md text-sm leading-7 text-[var(--color-navy)]/64 sm:text-base">
                  Practical details on private tours, planning, payments, and custom Egypt itineraries.
                </p>
                <Link
                  href="/faq"
                  className="mt-6 inline-flex min-h-11 items-center border-b border-[var(--color-gold-dark)] pb-1 text-xs font-semibold uppercase tracking-[0.1em] text-[var(--color-navy)] outline-none transition-colors hover:text-[var(--color-gold-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 motion-reduce:transition-none"
                >
                  View all FAQs
                </Link>
              </div>
              <HomeFaq items={faqs.slice(0, 6)} />
            </div>
          </div>
        </section>
      ) : null}

      {/* ============================================================
         10 · FINAL CTA — one clear planning action and direct WhatsApp.
      ============================================================ */}
      {finalCta.visible ? (
        <section className="order-10 border-t border-[rgb(214_173_84_/_36%)] bg-[var(--color-navy)] py-10 text-white sm:py-12 lg:py-14">
          <div className="container-premium grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end lg:gap-12">
            <div className="max-w-3xl">
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-light)]">
                {finalCta.eyebrow}
              </p>
              <h2 className="mt-3 font-serif text-[clamp(2rem,3.8vw,3.25rem)] font-semibold leading-[1.05] text-white">
                {finalCtaHeading.before}
                {finalCtaHeading.showAccent ? (
                  <span className="font-accent-serif italic text-[var(--color-gold-light)]">
                    {finalCtaHeading.accent}
                  </span>
                ) : null}
                {finalCtaHeading.after}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/72 sm:text-base">
                {finalCta.description}
              </p>
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row lg:justify-end">
              <Link
                href={finalCta.primaryHref}
                className="inline-flex min-h-12 items-center justify-center rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-semibold text-[var(--color-navy)] outline-none transition-colors hover:bg-[var(--color-gold-light)] focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy)] motion-reduce:transition-none"
              >
                {finalCta.primaryLabel}
              </Link>
              <a
                href={finalCta.whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-md border border-white/48 px-6 py-3 text-sm font-semibold text-white outline-none transition-colors hover:border-[var(--color-gold-light)] hover:text-[var(--color-gold-light)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy)] motion-reduce:transition-none"
              >
                <MessageCircle aria-hidden="true" className="size-4" strokeWidth={1.8} />
                Chat on WhatsApp
              </a>
            </div>
          </div>
        </section>
      ) : null}

    </div>
  );
}
