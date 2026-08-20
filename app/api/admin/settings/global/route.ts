import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGlobalSettingsSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const guard = await requireAdminApi({ resource: "settings", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = adminGlobalSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid global settings." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  const {
    googleRating,
    googleReviewCount,
    socialGoogleBusiness,
    tripadvisorRating,
    tripadvisorReviewCount,
    ...globalSettings
  } = parsed.data;
  const reviewPlatformSettings = {
    googleRating,
    googleReviewCount,
    tripadvisorRating,
    tripadvisorReviewCount,
  };

  await prisma.$transaction([
    prisma.globalSettings.upsert({
      where: { id: "global" },
      update: globalSettings,
      create: {
        id: "global",
        ...globalSettings,
        email: globalSettings.globalEmail || null,
        facebookUrl: globalSettings.socialFacebook || null,
        instagramUrl: globalSettings.socialInstagram || null,
        phone: globalSettings.globalPhoneNumber || null,
        tripAdvisorUrl: globalSettings.socialTripadvisor || null,
        whatsappNumber: globalSettings.globalWhatsappNumber || null,
      },
    }),
    prisma.siteSetting.upsert({
      where: { key: "socialGoogleBusiness" },
      update: { value: socialGoogleBusiness || "" },
      create: { key: "socialGoogleBusiness", value: socialGoogleBusiness || "" },
    }),
    ...Object.entries(reviewPlatformSettings).map(([key, value]) =>
      prisma.siteSetting.upsert({
        where: { key },
        update: { value: value || "" },
        create: { key, value: value || "" },
      }),
    ),
  ]);

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/trip-planner");
  revalidatePath("/tours");
  return NextResponse.json({ ok: true });
}
