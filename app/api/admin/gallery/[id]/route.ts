import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "update" });
  if (!guard.ok) return guard.response;
  const parsed = adminGalleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid gallery image." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not saved." }, { status: 503 });
  const { id } = await params;
  await prisma.galleryImage.update({ where: { id }, data: { ...parsed.data, relatedTourSlug: parsed.data.relatedTourSlug || null } });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "delete" });
  if (!guard.ok) return guard.response;
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not deleted." }, { status: 503 });
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
