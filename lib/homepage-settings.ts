import { z } from "zod";
import { optionalAdminImageSource } from "@/lib/validations";

export const curatedHomepageIcons = [
  "UserCheck",
  "Users",
  "Hotel",
  "Car",
  "Plane",
  "Ship",
  "MessageCircle",
  "Mail",
  "Phone",
  "Map",
  "MapPin",
  "Compass",
  "Globe",
  "Sparkles",
  "Star",
  "Heart",
  "Award",
  "Shield",
  "Clock",
  "Calendar",
  "Camera",
  "Coffee",
  "Utensils",
  "Sun",
  "Moon",
  "Mountain",
  "TreePine",
  "Anchor",
  "Tent",
  "Sunrise",
] as const;

export type HomepageIconName = (typeof curatedHomepageIcons)[number];

export type HomepageServiceItem = {
  icon: string;
  label: string;
};

export type HomepageStatItem = {
  value: string;
  label: string;
};

export type HomepageEditorValues = z.infer<typeof homepageEditorSchema>;

export const customizeTripSiteSettingKeys = {
  customizeTripCtaHref: "homepage.customizeTrip.ctaHref",
  customizeTripCtaLabel: "homepage.customizeTrip.ctaLabel",
  customizeTripDescription: "homepage.customizeTrip.description",
  customizeTripEyebrow: "homepage.customizeTrip.eyebrow",
  customizeTripHeading: "homepage.customizeTrip.heading",
} as const;

const serviceItemSchema = z.object({
  icon: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const statItemSchema = z.object({
  value: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

const optionalHomepageText = z.preprocess(
  (value) => (value === null ? undefined : value),
  z.string().trim().optional(),
);

const optionalHomepageImageSource = z.preprocess(
  (value) => (value === null ? "" : value),
  optionalAdminImageSource,
);

export const homepageEditorSchema = z.object({
  customizeTripCtaHref: optionalHomepageText,
  customizeTripCtaLabel: optionalHomepageText,
  customizeTripDescription: optionalHomepageText,
  customizeTripEyebrow: optionalHomepageText,
  customizeTripHeading: optionalHomepageText,
  heroVisible: z.boolean(),
  heroBackgroundImage: optionalHomepageImageSource,
  heroEyebrow: optionalHomepageText,
  heroHeadline: optionalHomepageText,
  heroHeadlineAccent: optionalHomepageText,
  heroSubheadline: optionalHomepageText,
  heroPrimaryCtaLabel: optionalHomepageText,
  heroPrimaryCtaHref: optionalHomepageText,
  heroSecondaryLinkLabel: optionalHomepageText,
  heroSecondaryLinkHref: optionalHomepageText,
  heroTrustBadges: z.array(z.string().trim()).length(3),
  destinationsVisible: z.boolean(),
  destinationsEyebrow: optionalHomepageText,
  destinationsHeading: optionalHomepageText,
  destinationsHeadingAccent: optionalHomepageText,
  destinationsViewAllLabel: optionalHomepageText,
  destinationsViewAllHref: optionalHomepageText,
  featuredVisible: z.boolean(),
  featuredEyebrow: optionalHomepageText,
  featuredHeading: optionalHomepageText,
  featuredHeadingAccent: optionalHomepageText,
  featuredDescription: optionalHomepageText,
  featuredViewAllLabel: optionalHomepageText,
  featuredViewAllHref: optionalHomepageText,
  whyVisible: z.boolean(),
  whyEyebrow: optionalHomepageText,
  whyHeading: optionalHomepageText,
  whyHeadingAccent: optionalHomepageText,
  whyDescription: optionalHomepageText,
  whyCtaLabel: optionalHomepageText,
  whyCtaHref: optionalHomepageText,
  whyCollageImage1: optionalHomepageImageSource,
  whyCollageImage2: optionalHomepageImageSource,
  whyCollageImage3: optionalHomepageImageSource,
  whyIncludedHeading: optionalHomepageText,
  whyServices: z.array(serviceItemSchema).length(6),
  ourWorldVisible: z.boolean(),
  ourWorldEyebrow: optionalHomepageText,
  ourWorldHeading: optionalHomepageText,
  ourWorldHeadingAccent: optionalHomepageText,
  ourWorldBody: optionalHomepageText,
  ourWorldImage: optionalHomepageImageSource,
  ourWorldReadMoreLabel: optionalHomepageText,
  ourWorldReadMoreHref: optionalHomepageText,
  statsVisible: z.boolean(),
  statsItems: z.array(statItemSchema).length(4),
  statsBackgroundImage: optionalHomepageImageSource,
  testimonialsVisible: z.boolean(),
  testimonialsEyebrow: optionalHomepageText,
  testimonialsHeading: optionalHomepageText,
  testimonialsHeadingAccent: optionalHomepageText,
  finalCtaVisible: z.boolean(),
  finalCtaBackgroundImage: optionalHomepageImageSource,
  finalCtaEyebrow: optionalHomepageText,
  finalCtaHeading: optionalHomepageText,
  finalCtaHeadingAccent: optionalHomepageText,
  finalCtaDescription: optionalHomepageText,
  finalCtaPrimaryButtonLabel: optionalHomepageText,
  finalCtaPrimaryButtonHref: optionalHomepageText,
  finalCtaSecondaryLinkLabel: optionalHomepageText,
  finalCtaSecondaryLinkHref: optionalHomepageText,
});

export const homepageEditorPatchSchema = homepageEditorSchema.partial();

export const defaultHomepageEditorValues: HomepageEditorValues = {
  customizeTripCtaHref: "/trip-planner",
  customizeTripCtaLabel: "Plan Your Trip",
  customizeTripDescription:
    "Share your dates, interests, budget, preferred places, and travel style. Jack Luxor Tour will help shape a private Egypt route with local care, flexible pacing, and easy WhatsApp support from first idea to final detail.",
  customizeTripEyebrow: "Private planning",
  customizeTripHeading: "Customize Your Egypt Trip, Your Way",
  destinationsEyebrow: "Where we travel",
  destinationsHeading: "From the Nile,",
  destinationsHeadingAccent: "outward.",
  destinationsViewAllHref: "/destinations",
  destinationsViewAllLabel: "All destinations →",
  destinationsVisible: true,
  featuredDescription: "",
  featuredEyebrow: "Featured journeys",
  featuredHeading: "Polished private experiences,",
  featuredHeadingAccent: "ready to tailor.",
  featuredViewAllHref: "/tours",
  featuredViewAllLabel: "View all tours",
  featuredVisible: true,
  finalCtaBackgroundImage: "/photos/felucca.jpg",
  finalCtaDescription:
    "Tell us what you have in mind. We will shape the route, guide style, pacing, and logistics around you.",
  finalCtaEyebrow: "Ready?",
  finalCtaHeading: "Ready when",
  finalCtaHeadingAccent: "you are.",
  finalCtaPrimaryButtonHref: "/trip-planner",
  finalCtaPrimaryButtonLabel: "Plan My Egypt Journey",
  finalCtaSecondaryLinkHref: "/trip-planner",
  finalCtaSecondaryLinkLabel: "Or message on WhatsApp",
  finalCtaVisible: true,
  heroBackgroundImage: "/photos/karnak.jpg",
  heroEyebrow: "Private Egypt · est. Luxor",
  heroHeadline: "Egypt, privately composed.",
  heroHeadlineAccent: "composed.",
  heroPrimaryCtaHref: "/trip-planner",
  heroPrimaryCtaLabel: "Plan My Egypt Journey",
  heroSecondaryLinkHref: "/trip-planner",
  heroSecondaryLinkLabel: "Or message on WhatsApp",
  heroSubheadline:
    "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.",
  heroTrustBadges: [
    "Local Egypt Travel Experts",
    "Private Tailor-Made Tours",
    "WhatsApp Support 24/7",
  ],
  heroVisible: true,
  ourWorldBody:
    "We are based in Luxor. We arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. We work in small numbers, with trusted guides, on WhatsApp time. Everything else is negotiable.",
  ourWorldEyebrow: "Our world",
  ourWorldHeading: "A small team,",
  ourWorldHeadingAccent: "quietly capable.",
  ourWorldImage: "/photos/hatshepsut.jpg",
  ourWorldReadMoreHref: "Luxor, Upper Egypt",
  ourWorldReadMoreLabel: "Jack Luxor Tour",
  ourWorldVisible: true,
  statsBackgroundImage: "/photos/felucca.jpg",
  statsItems: [
    { value: "10+", label: "Years on the ground" },
    { value: "1,000+", label: "Travelers hosted" },
    { value: "50+", label: "Private routes" },
    { value: "24/7", label: "WhatsApp support" },
  ],
  statsVisible: true,
  testimonialsEyebrow: "Traveler stories",
  testimonialsHeading: "Loved quietly,",
  testimonialsHeadingAccent: "from everywhere.",
  testimonialsVisible: true,
  whyCollageImage1: "/photos/karnak.jpg",
  whyCollageImage2: "/photos/hatshepsut.jpg",
  whyCollageImage3: "/photos/felucca.jpg",
  whyCtaHref: "/trip-planner",
  whyCtaLabel: "Plan Your Journey",
  whyDescription:
    "From private guides to seamless logistics, we handle every detail of your Egypt experience so you can focus on the wonder.",
  whyEyebrow: "Why Jack Luxor Tour",
  whyHeading: "Everything you need for a",
  whyHeadingAccent: "perfect Egypt journey",
  whyIncludedHeading: "What's included in every journey",
  whyServices: [
    { icon: "UserCheck", label: "Private Guides" },
    { icon: "Hotel", label: "Hotel Bookings" },
    { icon: "Car", label: "Airport Transfers" },
    { icon: "Ship", label: "Nile Cruises" },
    { icon: "MessageCircle", label: "24/7 WhatsApp" },
    { icon: "Sparkles", label: "Tailor-Made" },
  ],
  whyVisible: true,
};

function normalizeTrustBadges(value: unknown) {
  if (!Array.isArray(value)) return defaultHomepageEditorValues.heroTrustBadges;
  return [0, 1, 2].map((index) => String(value[index] || defaultHomepageEditorValues.heroTrustBadges[index]));
}

function normalizeServices(value: unknown) {
  if (!Array.isArray(value)) return defaultHomepageEditorValues.whyServices;
  return defaultHomepageEditorValues.whyServices.map((fallback, index) => {
    const item = value[index] as Partial<HomepageServiceItem> | undefined;
    return {
      icon: normalizeHomepageIconName(item?.icon || fallback.icon),
      label: item?.label || fallback.label,
    };
  });
}

function normalizeStats(value: unknown) {
  if (!Array.isArray(value)) return defaultHomepageEditorValues.statsItems;
  return defaultHomepageEditorValues.statsItems.map((fallback, index) => {
    const item = value[index] as Partial<HomepageStatItem> | undefined;
    return {
      value: item?.value || fallback.value,
      label: item?.label || fallback.label,
    };
  });
}

export function mapHomepageSettingsToEditorValues(
  settings: Partial<Record<keyof HomepageEditorValues, unknown>> | null | undefined,
): HomepageEditorValues {
  if (!settings) return defaultHomepageEditorValues;

  return {
    ...defaultHomepageEditorValues,
    ...settings,
    destinationsVisible: settings.destinationsVisible ?? defaultHomepageEditorValues.destinationsVisible,
    finalCtaVisible: settings.finalCtaVisible ?? defaultHomepageEditorValues.finalCtaVisible,
    featuredVisible: settings.featuredVisible ?? defaultHomepageEditorValues.featuredVisible,
    heroTrustBadges: normalizeTrustBadges(settings.heroTrustBadges),
    heroVisible: settings.heroVisible ?? defaultHomepageEditorValues.heroVisible,
    ourWorldVisible: settings.ourWorldVisible ?? defaultHomepageEditorValues.ourWorldVisible,
    statsItems: normalizeStats(settings.statsItems),
    statsVisible: settings.statsVisible ?? defaultHomepageEditorValues.statsVisible,
    testimonialsVisible: settings.testimonialsVisible ?? defaultHomepageEditorValues.testimonialsVisible,
    whyServices: normalizeServices(settings.whyServices),
    whyVisible: settings.whyVisible ?? defaultHomepageEditorValues.whyVisible,
  } as HomepageEditorValues;
}

export function normalizeHomepageIconName(value: string) {
  const legacyMap: Record<string, HomepageIconName> = {
    car: "Car",
    hotel: "Hotel",
    message: "MessageCircle",
    ship: "Ship",
    sparkles: "Sparkles",
    "user-check": "UserCheck",
  };
  return legacyMap[value] || value;
}
