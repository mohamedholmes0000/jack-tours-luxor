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

  await prisma.headerFooter.upsert({
    where: { id: "header-footer" },
    update: {
      ...parsed.data,
      footerCol1Links: parsed.data.footerCol1Links,
      footerExploreLinks: parsed.data.footerCol1Links,
      footerCopyrightText: parsed.data.footerCopyright || null,
      headerNavLinks: [
        { label: parsed.data.navLink1Label, url: parsed.data.navLink1Url },
        { label: parsed.data.navLink2Label, url: parsed.data.navLink2Url },
        { label: parsed.data.navLink3Label, url: parsed.data.navLink3Url },
        { label: parsed.data.navLink4Label, url: parsed.data.navLink4Url },
      ],
      logoSubtitle: parsed.data.logoLine2,
      logoText: parsed.data.logoLine1,
    },
    create: {
      id: "header-footer",
      ...parsed.data,
      bookNowHref: "/trip-planner",
      footerCol1Links: parsed.data.footerCol1Links,
      footerExploreLinks: parsed.data.footerCol1Links,
      footerCopyrightText: parsed.data.footerCopyright || null,
      headerNavLinks: [
        { label: parsed.data.navLink1Label, url: parsed.data.navLink1Url },
        { label: parsed.data.navLink2Label, url: parsed.data.navLink2Url },
        { label: parsed.data.navLink3Label, url: parsed.data.navLink3Url },
        { label: parsed.data.navLink4Label, url: parsed.data.navLink4Url },
      ],
      logoSubtitle: parsed.data.logoLine2,
      logoText: parsed.data.logoLine1,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/");
  return NextResponse.json({ ok: true });
}
