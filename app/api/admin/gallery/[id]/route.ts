import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

async function resolveCategory(categoryId?: string, fallback?: string) {
  if (!categoryId) return fallback || "Experiences";
  const category = await prisma.galleryCategory.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  });
  return category?.name || fallback || "Experiences";
}

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "update" });
  if (!guard.ok) return guard.response;
  const parsed = adminGalleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid gallery image." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not saved." }, { status: 503 });
  const { id } = await params;
  const category = await resolveCategory(parsed.data.categoryId, parsed.data.category);
  await prisma.galleryImage.update({
    where: { id },
    data: {
      url: parsed.data.url,
      alt: parsed.data.alt,
      title: parsed.data.title || parsed.data.alt,
      caption: parsed.data.caption || null,
      description: parsed.data.description || parsed.data.caption || null,
      category,
      categoryId: parsed.data.categoryId || null,
      relatedTourSlug: parsed.data.relatedTourSlug || null,
      order: parsed.data.order,
      active: parsed.data.active ?? true,
    },
  });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "delete" });
  if (!guard.ok) return guard.response;
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not deleted." }, { status: 503 });
  const { id } = await params;
  await prisma.galleryImage.delete({ where: { id } });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
