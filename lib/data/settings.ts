import type {
  AdminContactMapValues,
  AdminFooterSettingsValues,
  AdminGlobalSettingsValues,
  AdminHeaderSettingsValues,
  AdminSettingsValues,
} from "@/lib/validations";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

export type FooterLink = {
  label: string;
  url: string;
};

export type PublicHeaderFooterSettings = AdminHeaderSettingsValues &
  AdminFooterSettingsValues & {
    bookNowHref: string;
  };

export type PublicSettings = AdminSettingsValues &
  AdminGlobalSettingsValues &
  PublicHeaderFooterSettings &
  AdminContactMapValues;

const defaultFooterLinks: FooterLink[] = [
  { label: "Home", url: "/" },
  { label: "Tours", url: "/tours" },
  { label: "Activities", url: "/activities" },
  { label: "Hotels", url: "/hotels" },
  { label: "Gallery", url: "/gallery" },
  { label: "Blog", url: "/blog" },
  { label: "Trip Planner", url: "/trip-planner" },
  { label: "Contact", url: "/contact" },
  { label: "FAQ", url: "/faq" },
];

const REAL_PHONE_DISPLAY = "+20 1096586292";
const REAL_WHATSAPP_NUMBER = "201096586292";

function isPlaceholderContact(value: string | null | undefined) {
  if (!value) return true;
  const normalized = value.toLowerCase().trim();
  const digits = normalized.replace(/[^\d]/g, "");

  return (
    normalized.includes("xxxx") ||
    normalized.includes("xxx") ||
    normalized.includes("placeholder") ||
    digits.length < 8
  );
}

function realOrConfigured(value: string | null | undefined, fallback: string) {
  const configured = isPlaceholderContact(value) ? fallback : value!.trim();
  const digits = configured.replace(/[^\d]/g, "");

  return digits === "201096586292" || digits === "01096586292"
    ? REAL_PHONE_DISPLAY
    : configured;
}

export const defaultSettings: PublicSettings = {
  address: "Luxor, Egypt",
  bookNowHref: "/trip-planner",
  bookNowLabel: "Book Now",
  companyName: "Jack Egypt Tour",
  contactMapLocation: "Luxor, Egypt",
  contactMapVisible: true,
  contactMapZoom: 12,
  defaultSeoDescription:
    "Private tailor-made Egypt tours and DMC services from Luxor-based experts.",
  defaultSeoTitle: "Jack Egypt Tour | Luxury Egypt Private Tours",
  email: "info@jackegypttour.com",
  facebookUrl: "",
  footerCol1Heading: "Explore",
  footerCol1Links: defaultFooterLinks,
  footerCol2Heading: "Contact",
  footerCopyright: "© 2026 Jack Egypt Tour. All rights reserved.",
  footerDescription:
    "Luxury Egypt tours, Nile cruise planning, and practical DMC support from a Luxor-based team.",
  footerTagline: "Luxor-based luxury tours",
  globalEmail: "info@jackegypttour.com",
  globalPhoneNumber: REAL_PHONE_DISPLAY,
  globalWhatsappNumber: REAL_WHATSAPP_NUMBER,
  homepageHeroEyebrow: "Private Egypt · est. Luxor",
  homepageHeroHeadline: "Egypt, privately",
  homepageHeroHeadlineAccent: "composed.",
  homepageHeroImage: "/photos/karnak.jpg",
  homepageHeroPrimaryCtaHref: "/trip-planner",
  homepageHeroPrimaryCtaLabel: "Plan My Egypt Journey",
  homepageHeroSubheadline:
    "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.",
  homepageTrustItem1: "Local Egypt Travel Experts",
  homepageTrustItem2: "Private Tailor-Made Tours",
  homepageTrustItem3: "WhatsApp Support 24/7",
  instagramUrl: "",
  logoLine1: "JACK",
  logoLine2: "EGYPT TOUR",
  navLink1Label: "Tours",
  navLink1Url: "/tours",
  navLink2Label: "Activities",
  navLink2Url: "/activities",
  navLink3Label: "Gallery",
  navLink3Url: "/gallery",
  navLink4Label: "About",
  navLink4Url: "/about",
  phone: REAL_PHONE_DISPLAY,
  socialFacebook: "",
  socialInstagram: "",
  socialTripadvisor: "",
  socialTwitter: "",
  socialYoutube: "",
  tripAdvisorUrl: "",
  whatsappNumber: REAL_WHATSAPP_NUMBER,
};

function parseFooterLinks(value: unknown): FooterLink[] {
  if (!Array.isArray(value)) return defaultFooterLinks;

  const links = value
    .map((item) => {
      if (!item || typeof item !== "object") return null;
      const record = item as Record<string, unknown>;
      const label = typeof record.label === "string" ? record.label : "";
      const url =
        typeof record.url === "string"
          ? record.url
          : typeof record.href === "string"
            ? record.href
            : "";
      return label && url ? { label, url } : null;
    })
    .filter(Boolean) as FooterLink[];

  if (!links.length) return defaultFooterLinks;

  const normalizedLinks = links.map((link) =>
    link.label.trim().toLowerCase() === "destinations"
      ? { label: "Activities", url: "/activities" }
      : link,
  );
  const withoutHome = normalizedLinks.filter(
    (link) => link.url !== "/" && link.label.trim().toLowerCase() !== "home",
  );
  const withoutPrimaryServices = withoutHome.filter(
    (link) =>
      link.url !== "/activities" &&
      link.label.trim().toLowerCase() !== "activities" &&
      link.url !== "/hotels" &&
      link.label.trim().toLowerCase() !== "hotels",
  );
  const toursIndex = withoutPrimaryServices.findIndex(
    (link) => link.url === "/tours" || link.label.trim().toLowerCase() === "tours",
  );
  const insertIndex = toursIndex >= 0 ? toursIndex + 1 : Math.min(1, withoutPrimaryServices.length);

  return [
    { label: "Home", url: "/" },
    ...withoutPrimaryServices.slice(0, insertIndex),
    { label: "Activities", url: "/activities" },
    { label: "Hotels", url: "/hotels" },
    ...withoutPrimaryServices.slice(insertIndex),
  ];
}

function mapSiteSettings(rows: Array<{ key: string; value: string }>) {
  return rows.reduce<Partial<PublicSettings>>(
    (settings, row) => ({ ...settings, [row.key]: row.value }),
    {},
  );
}

export async function getPublicSettings(): Promise<PublicSettings> {
  return tryDatabase(
    async () => {
      const [rows, globalSettings, headerFooter, contactPage] = await Promise.all([
        prisma.siteSetting.findMany(),
        prisma.globalSettings.findUnique({ where: { id: "global" } }),
        prisma.headerFooter.findUnique({ where: { id: "header-footer" } }),
        prisma.contactPage.findUnique({ where: { id: "contact" } }),
      ]);

      const legacySettings = mapSiteSettings(rows);
      const whatsappNumber = realOrConfigured(
        globalSettings?.globalWhatsappNumber ||
          globalSettings?.whatsappNumber ||
          legacySettings.whatsappNumber,
        REAL_WHATSAPP_NUMBER,
      );
      const phone = realOrConfigured(
        globalSettings?.globalPhoneNumber || globalSettings?.phone || legacySettings.phone,
        REAL_PHONE_DISPLAY,
      );
      const email =
        globalSettings?.globalEmail ||
        globalSettings?.email ||
        legacySettings.email ||
        defaultSettings.email;

      return {
        ...defaultSettings,
        ...legacySettings,
        address: globalSettings?.address || legacySettings.address || defaultSettings.address,
        bookNowHref: headerFooter?.bookNowHref || defaultSettings.bookNowHref,
        bookNowLabel: headerFooter?.bookNowLabel || defaultSettings.bookNowLabel,
        companyName: globalSettings?.companyName || legacySettings.companyName || defaultSettings.companyName,
        contactMapLocation: contactPage?.contactMapLocation || defaultSettings.contactMapLocation,
        contactMapVisible: contactPage?.contactMapVisible ?? defaultSettings.contactMapVisible,
        contactMapZoom: contactPage?.contactMapZoom || defaultSettings.contactMapZoom,
        email,
        facebookUrl: globalSettings?.socialFacebook || globalSettings?.facebookUrl || legacySettings.facebookUrl || "",
        footerCol1Heading: headerFooter?.footerCol1Heading || defaultSettings.footerCol1Heading,
        footerCol1Links: parseFooterLinks(headerFooter?.footerCol1Links || headerFooter?.footerExploreLinks),
        footerCol2Heading: headerFooter?.footerCol2Heading || defaultSettings.footerCol2Heading,
        footerCopyright:
          headerFooter?.footerCopyright ||
          headerFooter?.footerCopyrightText ||
          defaultSettings.footerCopyright,
        footerDescription: headerFooter?.footerDescription || defaultSettings.footerDescription,
        footerTagline: headerFooter?.footerTagline || defaultSettings.footerTagline,
        globalEmail: email,
        globalPhoneNumber: phone,
        globalWhatsappNumber: whatsappNumber,
        instagramUrl: globalSettings?.socialInstagram || globalSettings?.instagramUrl || legacySettings.instagramUrl || "",
        logoLine1: headerFooter?.logoLine1 || headerFooter?.logoText || defaultSettings.logoLine1,
        logoLine2: headerFooter?.logoLine2 || headerFooter?.logoSubtitle || defaultSettings.logoLine2,
        navLink1Label: headerFooter?.navLink1Label || defaultSettings.navLink1Label,
        navLink1Url: headerFooter?.navLink1Url || defaultSettings.navLink1Url,
        navLink2Label: headerFooter?.navLink2Label || defaultSettings.navLink2Label,
        navLink2Url: headerFooter?.navLink2Url || defaultSettings.navLink2Url,
        navLink3Label: headerFooter?.navLink3Label || defaultSettings.navLink3Label,
        navLink3Url: headerFooter?.navLink3Url || defaultSettings.navLink3Url,
        navLink4Label: headerFooter?.navLink4Label || defaultSettings.navLink4Label,
        navLink4Url: headerFooter?.navLink4Url || defaultSettings.navLink4Url,
        phone,
        socialFacebook: globalSettings?.socialFacebook || globalSettings?.facebookUrl || legacySettings.facebookUrl || "",
        socialInstagram: globalSettings?.socialInstagram || globalSettings?.instagramUrl || legacySettings.instagramUrl || "",
        socialTripadvisor: globalSettings?.socialTripadvisor || globalSettings?.tripAdvisorUrl || legacySettings.tripAdvisorUrl || "",
        socialTwitter: globalSettings?.socialTwitter || "",
        socialYoutube: globalSettings?.socialYoutube || "",
        tripAdvisorUrl:
          globalSettings?.socialTripadvisor || globalSettings?.tripAdvisorUrl || legacySettings.tripAdvisorUrl || "",
        whatsappNumber,
      };
    },
    defaultSettings,
  );
}

export async function getGlobalSettingsSafe(): Promise<AdminGlobalSettingsValues> {
  const settings = await getPublicSettings();
  return {
    globalEmail: settings.globalEmail,
    globalPhoneNumber: settings.globalPhoneNumber,
    globalWhatsappNumber: settings.globalWhatsappNumber,
    socialFacebook: settings.socialFacebook,
    socialInstagram: settings.socialInstagram,
    socialTripadvisor: settings.socialTripadvisor,
    socialTwitter: settings.socialTwitter,
    socialYoutube: settings.socialYoutube,
  };
}

export async function getHeaderFooterSafe(): Promise<PublicHeaderFooterSettings> {
  const settings = await getPublicSettings();
  return {
    bookNowHref: settings.bookNowHref,
    bookNowLabel: settings.bookNowLabel,
    footerCol1Heading: settings.footerCol1Heading,
    footerCol1Links: settings.footerCol1Links,
    footerCol2Heading: settings.footerCol2Heading,
    footerCopyright: settings.footerCopyright,
    footerDescription: settings.footerDescription,
    footerTagline: settings.footerTagline,
    logoLine1: settings.logoLine1,
    logoLine2: settings.logoLine2,
    navLink1Label: settings.navLink1Label,
    navLink1Url: settings.navLink1Url,
    navLink2Label: settings.navLink2Label,
    navLink2Url: settings.navLink2Url,
    navLink3Label: settings.navLink3Label,
    navLink3Url: settings.navLink3Url,
    navLink4Label: settings.navLink4Label,
    navLink4Url: settings.navLink4Url,
  };
}

export async function getContactMapSettingsSafe(): Promise<AdminContactMapValues> {
  const settings = await getPublicSettings();
  return {
    contactMapLocation: settings.contactMapLocation,
    contactMapVisible: settings.contactMapVisible,
    contactMapZoom: settings.contactMapZoom,
  };
}
