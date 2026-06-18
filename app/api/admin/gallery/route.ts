import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryAlbumSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
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

  try {
    const album = await prisma.galleryAlbum.create({
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

    revalidatePath("/gallery");
    revalidatePath(`/gallery/${album.slug}`);
    return NextResponse.json({ ok: true, id: album.id });
  } catch (error) {
    console.error("Failed to create gallery album", error);
    return NextResponse.json({ ok: false, message: "Unable to save album." }, { status: 500 });
  }
}
