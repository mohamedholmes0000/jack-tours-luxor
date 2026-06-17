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

export type HomepageEditorValues = z.infer<typeof homepageEditorSchema>;

const serviceItemSchema = z.object({
  icon: z.string().trim().min(1),
  label: z.string().trim().min(1),
});

export const homepageEditorSchema = z.object({
  heroVisible: z.boolean(),
  heroBackgroundImage: optionalAdminImageSource,
  heroEyebrow: z.string().trim().optional(),
  heroHeadline: z.string().trim().optional(),
  heroHeadlineAccent: z.string().trim().optional(),
  heroSubheadline: z.string().trim().optional(),
  heroPrimaryCtaLabel: z.string().trim().optional(),
  heroPrimaryCtaHref: z.string().trim().optional(),
  heroSecondaryLinkLabel: z.string().trim().optional(),
  heroSecondaryLinkHref: z.string().trim().optional(),
  heroTrustBadges: z.array(z.string().trim()).length(3),
  whyVisible: z.boolean(),
  whyEyebrow: z.string().trim().optional(),
  whyHeading: z.string().trim().optional(),
  whyHeadingAccent: z.string().trim().optional(),
  whyDescription: z.string().trim().optional(),
  whyCtaLabel: z.string().trim().optional(),
  whyCtaHref: z.string().trim().optional(),
  whyCollageImage1: optionalAdminImageSource,
  whyCollageImage2: optionalAdminImageSource,
  whyCollageImage3: optionalAdminImageSource,
  whyIncludedHeading: z.string().trim().optional(),
  whyServices: z.array(serviceItemSchema).length(6),
  finalCtaVisible: z.boolean(),
  finalCtaBackgroundImage: optionalAdminImageSource,
  finalCtaEyebrow: z.string().trim().optional(),
  finalCtaHeading: z.string().trim().optional(),
  finalCtaHeadingAccent: z.string().trim().optional(),
  finalCtaDescription: z.string().trim().optional(),
  finalCtaPrimaryButtonLabel: z.string().trim().optional(),
  finalCtaPrimaryButtonHref: z.string().trim().optional(),
  finalCtaSecondaryLinkLabel: z.string().trim().optional(),
  finalCtaSecondaryLinkHref: z.string().trim().optional(),
});

export const defaultHomepageEditorValues: HomepageEditorValues = {
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
  heroHeadline: "Egypt, privately",
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
  whyCollageImage1: "/photos/karnak.jpg",
  whyCollageImage2: "/photos/hatshepsut.jpg",
  whyCollageImage3: "/photos/felucca.jpg",
  whyCtaHref: "/trip-planner",
  whyCtaLabel: "Plan Your Journey",
  whyDescription:
    "From private guides to seamless logistics, we handle every detail of your Egypt experience so you can focus on the wonder.",
  whyEyebrow: "Why Jack Egypt Tour",
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

export function mapHomepageSettingsToEditorValues(
  settings: Partial<Record<keyof HomepageEditorValues, unknown>> | null | undefined,
): HomepageEditorValues {
  if (!settings) return defaultHomepageEditorValues;

  return {
    ...defaultHomepageEditorValues,
    ...settings,
    finalCtaVisible: settings.finalCtaVisible ?? defaultHomepageEditorValues.finalCtaVisible,
    heroTrustBadges: normalizeTrustBadges(settings.heroTrustBadges),
    heroVisible: settings.heroVisible ?? defaultHomepageEditorValues.heroVisible,
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
