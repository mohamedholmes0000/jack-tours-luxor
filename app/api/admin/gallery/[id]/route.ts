import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryAlbumSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

function revalidateGalleryPaths(slug?: string | null) {
  revalidatePath("/gallery");
  if (slug) revalidatePath(`/gallery/${slug}`);
}

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = adminGalleryAlbumSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid gallery album." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Album was not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;

  try {
    const previous = await prisma.galleryAlbum.findUnique({ where: { id }, select: { slug: true } });
    const album = await prisma.galleryAlbum.update({
      where: { id },
      data: {
        active: parsed.data.active,
        categoryId: parsed.data.categoryId || null,
        coverImage: parsed.data.coverImage,
        coverImagePublicId: parsed.data.coverImagePublicId || null,
        description: parsed.data.description || null,
        displayOrder: parsed.data.displayOrder,
        slug: parsed.data.slug,
        title: parsed.data.title,
      },
      select: { id: true, slug: true },
    });

    revalidateGalleryPaths(previous?.slug);
    revalidateGalleryPaths(album.slug);
    return NextResponse.json({ ok: true, id: album.id });
  } catch (error) {
    console.error("Failed to update gallery album", error);
    return NextResponse.json({ ok: false, message: "Unable to save album." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "delete" });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Album was not deleted." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, select: { slug: true } });
  await prisma.galleryAlbum.delete({ where: { id } });

  revalidateGalleryPaths(album?.slug);
  return NextResponse.json({ ok: true });
}
