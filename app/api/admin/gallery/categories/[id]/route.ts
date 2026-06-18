import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryCategorySchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = adminGalleryCategorySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid gallery category." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Category was not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;
  try {
    const category = await prisma.galleryCategory.update({
      where: { id },
      data: parsed.data,
      select: { id: true, name: true },
    });

    revalidatePath("/gallery");
    return NextResponse.json({ ok: true, id: category.id });
  } catch (error) {
    console.error("Failed to update gallery category", error);
    return NextResponse.json({ ok: false, message: "Unable to save category." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "delete" });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Category was not deleted." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const albumCount = await prisma.galleryAlbum.count({ where: { categoryId: id } });
  if (albumCount > 0) {
    return NextResponse.json(
      { ok: false, message: "Remove or reassign albums before deleting this category." },
      { status: 400 },
    );
  }

  await prisma.galleryCategory.delete({ where: { id } });
  revalidatePath("/gallery");
  return NextResponse.json({ ok: true });
}
