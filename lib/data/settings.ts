import type { AdminSettingsValues } from "@/lib/validations";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

export const defaultSettings: AdminSettingsValues = {
  companyName: "Jack Egypt Tour",
  phone: "+20XXXXXXXXXX",
  whatsappNumber: "+20XXXXXXXXXX",
  email: "info@jackegypttour.com",
  address: "Luxor, Egypt",
  facebookUrl: "",
  instagramUrl: "",
  tripAdvisorUrl: "",
  defaultSeoTitle: "Jack Egypt Tour | Luxury Egypt Private Tours",
  defaultSeoDescription:
    "Private tailor-made Egypt tours and DMC services from Luxor-based experts.",
  homepageHeroEyebrow: "Private Egypt · est. Luxor",
  homepageHeroHeadline: "Egypt, privately",
  homepageHeroHeadlineAccent: "composed.",
  homepageHeroSubheadline:
    "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.",
  homepageHeroPrimaryCtaLabel: "Plan My Egypt Journey",
  homepageHeroPrimaryCtaHref: "/trip-planner",
  homepageHeroImage: "/photos/karnak.jpg",
  homepageTrustItem1: "Local Egypt Travel Experts",
  homepageTrustItem2: "Private Tailor-Made Tours",
  homepageTrustItem3: "WhatsApp Support 24/7",
};

export async function getPublicSettings() {
  return tryDatabase(
    async () => {
      const rows = await prisma.siteSetting.findMany();
      return rows.reduce<AdminSettingsValues>(
        (settings, row) => ({ ...settings, [row.key]: row.value }),
        defaultSettings,
      );
    },
    defaultSettings,
  );
}
