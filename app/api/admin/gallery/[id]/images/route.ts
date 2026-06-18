import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryImageSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

const imageListSchema = z.object({
  images: z.array(adminGalleryImageSchema),
});

async function getAlbum(id: string) {
  return prisma.galleryAlbum.findUnique({ where: { id }, select: { id: true, slug: true } });
}

function revalidateAlbum(slug: string) {
  revalidatePath("/gallery");
  revalidatePath(`/gallery/${slug}`);
}

export async function POST(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
  if (!guard.ok) return guard.response;

  const parsed = imageListSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid gallery images." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Images were not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const album = await getAlbum(id);
  if (!album) return NextResponse.json({ ok: false, message: "Album not found." }, { status: 404 });

  const maxOrder = await prisma.galleryImage.aggregate({
    where: { albumId: id },
    _max: { order: true },
  });
  const startOrder = (maxOrder._max.order ?? -1) + 1;

  const created = await prisma.$transaction(
    parsed.data.images.map((image, index) =>
      prisma.galleryImage.create({
        data: {
          active: image.active ?? true,
          albumId: id,
          alt: image.alt || image.title || "Gallery image",
          caption: image.caption || null,
          description: image.description || null,
          order: startOrder + index,
          publicId: image.publicId || null,
          title: image.title || image.alt || "Gallery image",
          url: image.url,
        },
        select: { id: true },
      }),
    ),
  );

  revalidateAlbum(album.slug);
  return NextResponse.json({ ok: true, ids: created.map((image) => image.id) });
}

export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "gallery", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = z
    .object({
      images: z.array(
        adminGalleryImageSchema.extend({
          id: z.string().trim().min(1),
        }),
      ),
    })
    .safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid gallery images." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Images were not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;
  const album = await getAlbum(id);
  if (!album) return NextResponse.json({ ok: false, message: "Album not found." }, { status: 404 });

  await prisma.$transaction(
    parsed.data.images.map((image) =>
      prisma.galleryImage.updateMany({
        where: { id: image.id, albumId: id },
        data: {
          active: image.active ?? true,
          alt: image.alt || image.title || "Gallery image",
          caption: image.caption || null,
          description: image.description || null,
          order: image.order,
          publicId: image.publicId || null,
          title: image.title || image.alt || "Gallery image",
          url: image.url,
        },
      }),
    ),
  );

  revalidateAlbum(album.slug);
  return NextResponse.json({ ok: true });
}
