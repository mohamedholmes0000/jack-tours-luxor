import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { getAdminHomepageSettings } from "@/lib/data/admin";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import {
  customizeTripSiteSettingKeys,
  homepageEditorPatchSchema,
  homepageEditorSchema,
} from "@/lib/homepage-settings";

function omitUndefined<T extends Record<string, unknown>>(value: T) {
  return Object.fromEntries(Object.entries(value).filter(([, fieldValue]) => fieldValue !== undefined));
}

export async function GET() {
  const guard = await requireAdminApi();
  if (!guard.ok) return guard.response;

  const settings = await getAdminHomepageSettings();
  return NextResponse.json({ ok: true, settings });
}

export async function PUT(request: Request) {
  const guard = await requireAdminApi({ resource: "pages", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = homepageEditorPatchSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    console.error("Invalid homepage settings payload", parsed.error.flatten());
    return NextResponse.json(
      { ok: false, message: "Invalid homepage settings.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Homepage settings were not saved." },
      { status: 503 },
    );
  }

  const currentValues = await getAdminHomepageSettings();
  const values = homepageEditorSchema.parse({
    ...currentValues,
    ...omitUndefined(parsed.data),
  });
  const customizeTripSettings = {
    [customizeTripSiteSettingKeys.customizeTripCtaHref]: values.customizeTripCtaHref || "",
    [customizeTripSiteSettingKeys.customizeTripCtaLabel]: values.customizeTripCtaLabel || "",
    [customizeTripSiteSettingKeys.customizeTripDescription]: values.customizeTripDescription || "",
    [customizeTripSiteSettingKeys.customizeTripEyebrow]: values.customizeTripEyebrow || "",
    [customizeTripSiteSettingKeys.customizeTripHeading]: values.customizeTripHeading || "",
  };
  const updateData = {
    destinationsEyebrow: values.destinationsEyebrow || null,
    destinationsHeading: values.destinationsHeading || null,
    destinationsHeadingAccent: values.destinationsHeadingAccent || null,
    destinationsViewAllHref: values.destinationsViewAllHref || null,
    destinationsViewAllLabel: values.destinationsViewAllLabel || null,
    destinationsVisible: values.destinationsVisible,
    featuredDescription: values.featuredDescription || null,
    featuredEyebrow: values.featuredEyebrow || null,
    featuredHeading: values.featuredHeading || null,
    featuredHeadingAccent: values.featuredHeadingAccent || null,
    featuredViewAllHref: values.featuredViewAllHref || null,
    featuredViewAllLabel: values.featuredViewAllLabel || null,
    featuredVisible: values.featuredVisible,
    finalCtaBackgroundImage: values.finalCtaBackgroundImage || null,
    finalCtaDescription: values.finalCtaDescription || null,
    finalCtaEyebrow: values.finalCtaEyebrow || null,
    finalCtaHeading: values.finalCtaHeading || null,
    finalCtaHeadingAccent: values.finalCtaHeadingAccent || null,
    finalCtaPrimaryButtonHref: values.finalCtaPrimaryButtonHref || null,
    finalCtaPrimaryButtonLabel: values.finalCtaPrimaryButtonLabel || null,
    finalCtaSecondaryLinkHref: values.finalCtaSecondaryLinkHref || null,
    finalCtaSecondaryLinkLabel: values.finalCtaSecondaryLinkLabel || null,
    finalCtaVisible: values.finalCtaVisible,
    heroBackgroundImage: values.heroBackgroundImage || null,
    heroEyebrow: values.heroEyebrow || null,
    heroHeadline: values.heroHeadline || null,
    heroHeadlineAccent: values.heroHeadlineAccent || null,
    heroPrimaryCtaHref: values.heroPrimaryCtaHref || null,
    heroPrimaryCtaLabel: values.heroPrimaryCtaLabel || null,
    heroSecondaryLinkHref: values.heroSecondaryLinkHref || null,
    heroSecondaryLinkLabel: values.heroSecondaryLinkLabel || null,
    heroSubheadline: values.heroSubheadline || null,
    heroTrustBadges: values.heroTrustBadges,
    heroVisible: values.heroVisible,
    ourWorldBody: values.ourWorldBody || null,
    ourWorldEyebrow: values.ourWorldEyebrow || null,
    ourWorldHeading: values.ourWorldHeading || null,
    ourWorldHeadingAccent: values.ourWorldHeadingAccent || null,
    ourWorldImage: values.ourWorldImage || null,
    ourWorldReadMoreHref: values.ourWorldReadMoreHref || null,
    ourWorldReadMoreLabel: values.ourWorldReadMoreLabel || null,
    ourWorldVisible: values.ourWorldVisible,
    statsBackgroundImage: values.statsBackgroundImage || null,
    statsItems: values.statsItems,
    statsVisible: values.statsVisible,
    testimonialsEyebrow: values.testimonialsEyebrow || null,
    testimonialsHeading: values.testimonialsHeading || null,
    testimonialsHeadingAccent: values.testimonialsHeadingAccent || null,
    testimonialsVisible: values.testimonialsVisible,
    whyCollageImage1: values.whyCollageImage1 || null,
    whyCollageImage2: values.whyCollageImage2 || null,
    whyCollageImage3: values.whyCollageImage3 || null,
    whyCtaHref: values.whyCtaHref || null,
    whyCtaLabel: values.whyCtaLabel || null,
    whyDescription: values.whyDescription || null,
    whyEyebrow: values.whyEyebrow || null,
    whyHeading: values.whyHeading || null,
    whyHeadingAccent: values.whyHeadingAccent || null,
    whyIncludedHeading: values.whyIncludedHeading || null,
    whyServices: values.whyServices,
    whyVisible: values.whyVisible,
  };

  try {
    await prisma.$transaction([
      prisma.homepageSettings.upsert({
        where: { id: "homepage" },
        update: updateData,
        create: {
          id: "homepage",
          ...updateData,
        },
      }),
      ...Object.entries(customizeTripSettings).map(([key, value]) =>
        prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        }),
      ),
    ]);

    revalidatePath("/");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to save homepage settings", error);
    return NextResponse.json({ ok: false, message: "Unable to save homepage settings." }, { status: 500 });
  }
}
