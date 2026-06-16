import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
  if (!guard.ok) return guard.response;
  const parsed = adminGalleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid gallery image." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not saved." }, { status: 503 });
  await prisma.galleryImage.create({ data: { ...parsed.data, relatedTourSlug: parsed.data.relatedTourSlug || null } });
  return NextResponse.json({ ok: true });
}
