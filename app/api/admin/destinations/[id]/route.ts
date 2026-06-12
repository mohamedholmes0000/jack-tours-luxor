import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminDestinationSchema } from "@/lib/validations";

type DestinationApiProps = {
  params: Promise<{ id: string }>;
};

async function findDestination(id: string) {
  return prisma.destination.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    select: { id: true, slug: true },
  });
}

export async function PUT(request: Request, { params }: DestinationApiProps) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const parsed = adminDestinationSchema.safeParse(await request.json().catch(() => null));

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid destination data.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Destination was not saved." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const existingDestination = await findDestination(id);

    if (!existingDestination) {
      return NextResponse.json({ ok: false, message: "Destination not found." }, { status: 404 });
    }

    const destination = await prisma.destination.update({
      where: { id: existingDestination.id },
      data: {
        ...parsed.data,
        subtitle: parsed.data.subtitle || null,
        heroImage: parsed.data.heroImage || null,
        metaTitle: parsed.data.metaTitle || null,
        metaDescription: parsed.data.metaDescription || null,
      },
      select: { id: true, slug: true },
    });

    revalidatePath("/destinations");
    revalidatePath(`/destinations/${existingDestination.slug}`);
    revalidatePath(`/destinations/${destination.slug}`);

    return NextResponse.json({ ok: true, id: destination.id });
  } catch (error) {
    console.error("Failed to update destination", error);
    return NextResponse.json({ ok: false, message: "Unable to update destination." }, { status: 500 });
  }
}
