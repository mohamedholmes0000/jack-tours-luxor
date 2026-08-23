import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminFooterSettingsSchema, adminHeaderSettingsSchema } from "@/lib/validations";

const headerFooterSchema = adminHeaderSettingsSchema.merge(adminFooterSettingsSchema);

export async function PUT(request: Request) {
  const guard = await requireAdminApi({ resource: "settings", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = headerFooterSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid header/footer settings." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  const { mobileLogoImage, ...headerFooterValues } = parsed.data;

  await prisma.$transaction(async (transaction) => {
    await transaction.headerFooter.upsert({
      where: { id: "header-footer" },
      update: {
        ...headerFooterValues,
        footerCol1Links: headerFooterValues.footerCol1Links,
        footerExploreLinks: headerFooterValues.footerCol1Links,
        footerCopyrightText: headerFooterValues.footerCopyright || null,
        headerNavLinks: [
          { label: headerFooterValues.navLink1Label, url: headerFooterValues.navLink1Url },
          { label: headerFooterValues.navLink2Label, url: headerFooterValues.navLink2Url },
          { label: headerFooterValues.navLink3Label, url: headerFooterValues.navLink3Url },
          { label: headerFooterValues.navLink4Label, url: headerFooterValues.navLink4Url },
        ],
        logoSubtitle: headerFooterValues.logoLine2,
        logoText: headerFooterValues.logoLine1,
      },
      create: {
        id: "header-footer",
        ...headerFooterValues,
        bookNowHref: "/trip-planner",
        footerCol1Links: headerFooterValues.footerCol1Links,
        footerExploreLinks: headerFooterValues.footerCol1Links,
        footerCopyrightText: headerFooterValues.footerCopyright || null,
        headerNavLinks: [
          { label: headerFooterValues.navLink1Label, url: headerFooterValues.navLink1Url },
          { label: headerFooterValues.navLink2Label, url: headerFooterValues.navLink2Url },
          { label: headerFooterValues.navLink3Label, url: headerFooterValues.navLink3Url },
          { label: headerFooterValues.navLink4Label, url: headerFooterValues.navLink4Url },
        ],
        logoSubtitle: headerFooterValues.logoLine2,
        logoText: headerFooterValues.logoLine1,
      },
    });

    if (mobileLogoImage !== undefined) {
      await transaction.siteSetting.upsert({
        where: { key: "mobileLogoImage" },
        update: { value: mobileLogoImage },
        create: { key: "mobileLogoImage", value: mobileLogoImage },
      });
    }
  });

  revalidatePath("/", "layout");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
