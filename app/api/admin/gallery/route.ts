import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const parsed = adminGalleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid gallery image." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not saved." }, { status: 503 });
  await prisma.galleryImage.create({ data: { ...parsed.data, relatedTourSlug: parsed.data.relatedTourSlug || null } });
  return NextResponse.json({ ok: true });
}
