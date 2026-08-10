import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminTestimonialSchema } from "@/lib/validations";
export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "testimonials", action: "create" }); if (!guard.ok) return guard.response;
  const parsed = adminTestimonialSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid review." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Review was not saved." }, { status: 503 });
  try { const testimonial = await prisma.testimonial.create({ data: { ...parsed.data, avatarImage: parsed.data.avatarImage || null, country: parsed.data.country || null, nationality: parsed.data.nationality || null, source: parsed.data.source || null }, select: { id: true } }); revalidatePath("/"); return NextResponse.json({ ok: true, id: testimonial.id }); } catch (error) { console.error("Failed to create review", error); return NextResponse.json({ ok: false, message: "Unable to save review." }, { status: 500 }); }
}