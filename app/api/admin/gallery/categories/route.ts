import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminGalleryCategorySchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "gallery", action: "create" });
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

  try {
    const category = await prisma.galleryCategory.create({
      data: parsed.data,
      select: { id: true },
    });
    revalidatePath("/gallery");
    return NextResponse.json({ ok: true, id: category.id });
  } catch (error) {
    console.error("Failed to create gallery category", error);
    return NextResponse.json({ ok: false, message: "Unable to save category." }, { status: 500 });
  }
}
