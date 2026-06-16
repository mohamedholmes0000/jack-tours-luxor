import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminSettingsSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const guard = await requireAdminApi({ resource: "settings", action: "update" });
  if (!guard.ok) return guard.response;
  const parsed = adminSettingsSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid settings." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Settings were not saved." }, { status: 503 });
  await Promise.all(Object.entries(parsed.data).map(([key, value]) => prisma.siteSetting.upsert({ where: { key }, update: { value: value ?? "" }, create: { key, value: value ?? "" } })));
  revalidatePath("/", "layout");
  revalidatePath("/");
  revalidatePath("/contact");
  revalidatePath("/trip-planner");
  revalidatePath("/tours");
  return NextResponse.json({ ok: true });
}
