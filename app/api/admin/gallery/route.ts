import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

async function resolveCategory(categoryId?: string, fallback?: string) {
  if (!categoryId) return fallback || "Experiences";
  const category = await prisma.galleryCategory.findUnique({
    where: { id: categoryId },
    select: { id: true, name: true },
  });
  return category?.name || fallback || "Experiences";
}

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
  if (!guard.ok) return guard.response;
  const parsed = adminGalleryImageSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid gallery image." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Image was not saved." }, { status: 503 });

  const category = await resolveCategory(parsed.data.categoryId, parsed.data.category);
  const image = await prisma.galleryImage.create({
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
    select: { id: true },
  });

  revalidatePath("/gallery");
  return NextResponse.json({ ok: true, id: image.id });
}
