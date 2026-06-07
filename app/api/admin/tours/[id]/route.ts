import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminTourSchema } from "@/lib/validations";

type TourApiProps = {
  params: Promise<{ id: string }>;
};

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

async function findTourId(id: string) {
  const tour = await prisma.tour.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    select: { id: true },
  });
  return tour?.id;
}

export async function PUT(request: Request, { params }: TourApiProps) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

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
    const tourId = await findTourId(id);

    if (!tourId) {
      return NextResponse.json({ ok: false, message: "Tour not found." }, { status: 404 });
    }

    await prisma.tour.update({
      where: { id: tourId },
      data: {
        ...parsed.data,
        priceFrom: parsed.data.priceFrom || null,
        heroImage: parsed.data.heroImage || null,
        departurePoint: parsed.data.departurePoint || null,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
        itinerary: parsed.data.itinerary,
      },
    });

    return NextResponse.json({ ok: true, id: tourId });
  } catch (error) {
    console.error("Failed to update tour", error);
    return NextResponse.json({ ok: false, message: "Unable to update tour." }, { status: 500 });
  }
}

export async function DELETE(_request: Request, { params }: TourApiProps) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Tour was not deleted." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const tourId = await findTourId(id);

    if (!tourId) {
      return NextResponse.json({ ok: false, message: "Tour not found." }, { status: 404 });
    }

    await prisma.tour.delete({ where: { id: tourId } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete tour", error);
    return NextResponse.json({ ok: false, message: "Unable to delete tour." }, { status: 500 });
  }
}
