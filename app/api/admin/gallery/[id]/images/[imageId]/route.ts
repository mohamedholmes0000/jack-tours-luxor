import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";

type Props = { params: Promise<{ id: string; imageId: string }> };

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "delete" });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Image was not deleted." },
      { status: 503 },
    );
  }

  const { id, imageId } = await params;
  const album = await prisma.galleryAlbum.findUnique({ where: { id }, select: { slug: true } });
  if (!album) return NextResponse.json({ ok: false, message: "Album not found." }, { status: 404 });

  await prisma.galleryImage.deleteMany({ where: { id: imageId, albumId: id } });

  revalidatePath("/gallery");
  revalidatePath(`/gallery/${album.slug}`);
  return NextResponse.json({ ok: true });
}
