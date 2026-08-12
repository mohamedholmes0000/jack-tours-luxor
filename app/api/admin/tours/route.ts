import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { revalidateTourPublicPaths } from "@/lib/admin/tour-revalidation";
import { prisma } from "@/lib/data/safe-db";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
import { adminTourSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "tours", action: "create" });
  if (!guard.ok) return guard.response;

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
    const tour = await prisma.tour.create({
      data: {
        ...parsed.data,
        priceFrom: parsed.data.priceFrom || null,
        heroImage: parsed.data.heroImage || null,
        departurePoint: parsed.data.departurePoint || null,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
        itinerary: parsed.data.itinerary,
        languages: parsed.data.languages.length ? parsed.data.languages : ["English", "Arabic"],
        priceCurrency: "USD",
      },
    });

    revalidateTourPublicPaths(tour.slug);

    return NextResponse.json({ ok: true, id: tour.id });
  } catch (error) {
    console.error("Failed to create tour", error);
    return NextResponse.json({ ok: false, message: "Unable to save tour." }, { status: 500 });
  }
}
