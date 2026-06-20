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

  await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: parsed.data,
    create: {
      id: "global",
      ...parsed.data,
      email: parsed.data.globalEmail || null,
      facebookUrl: parsed.data.socialFacebook || null,
      instagramUrl: parsed.data.socialInstagram || null,
      phone: parsed.data.globalPhoneNumber || null,
      tripAdvisorUrl: parsed.data.socialTripadvisor || null,
      whatsappNumber: parsed.data.globalWhatsappNumber || null,
    },
  });

  revalidatePath("/", "layout");
  revalidatePath("/contact");
  revalidatePath("/trip-planner");
  revalidatePath("/tours");
  return NextResponse.json({ ok: true });
}
