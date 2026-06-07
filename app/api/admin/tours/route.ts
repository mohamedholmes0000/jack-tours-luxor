import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/data/safe-db";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
import { adminTourSchema } from "@/lib/validations";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

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
        languages: ["English", "Arabic"],
        priceCurrency: "USD",
      },
    });

    return NextResponse.json({ ok: true, id: tour.id });
  } catch (error) {
    console.error("Failed to create tour", error);
    return NextResponse.json({ ok: false, message: "Unable to save tour." }, { status: 500 });
  }
}
