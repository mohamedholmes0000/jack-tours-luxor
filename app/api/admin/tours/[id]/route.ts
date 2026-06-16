import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { revalidateTourPublicPaths } from "@/lib/admin/tour-revalidation";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminTourSchema } from "@/lib/validations";

type TourApiProps = {
  params: Promise<{ id: string }>;
};

async function findTourForRevalidation(id: string) {
  return prisma.tour.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    select: { id: true, slug: true },
  });
}

export async function PUT(request: Request, { params }: TourApiProps) {
  const guard = await requireAdminApi({ resource: "tours", action: "update" });
  if (!guard.ok) return guard.response;

  const { id } = await params;
  const payload = await request.json().catch(() => null);
  const parsed = adminTourSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid tour data.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Tour was not saved." },
      { status: 503 },
    );
  }

  try {
    const existingTour = await findTourForRevalidation(id);

    if (!existingTour) {
      return NextResponse.json({ ok: false, message: "Tour not found." }, { status: 404 });
    }

    const updatedTour = await prisma.tour.update({
      where: { id: existingTour.id },
      data: {
        ...parsed.data,
        priceFrom: parsed.data.priceFrom || null,
        heroImage: parsed.data.heroImage || null,
        departurePoint: parsed.data.departurePoint || null,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
        itinerary: parsed.data.itinerary,
      },
      select: { id: true, slug: true },
    });

    revalidateTourPublicPaths(existingTour.slug);
    revalidateTourPublicPaths(updatedTour.slug);

    return NextResponse.json({ ok: true, id: updatedTour.id });
  } catch (error) {
    console.error("Failed to update tour", error);
    return NextResponse.json({ ok: false, message: "Unable to update tour." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: TourApiProps) {
  const guard = await requireAdminApi({ resource: "tours", action: "delete" });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Tour was not deleted." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const existingTour = await findTourForRevalidation(id);

    if (!existingTour) {
      return NextResponse.json({ ok: false, message: "Tour not found." }, { status: 404 });
    }

    await prisma.tour.delete({ where: { id: existingTour.id } });
    revalidateTourPublicPaths(existingTour.slug);

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete tour", error);
    return NextResponse.json({ ok: false, message: "Unable to delete tour." }, { status: 500 });
  }
}
