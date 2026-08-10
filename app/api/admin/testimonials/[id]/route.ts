import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminTestimonialSchema } from "@/lib/validations";
type Props = { params: Promise<{ id: string }> };
export async function PUT(request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "testimonials", action: "update" }); if (!guard.ok) return guard.response;
  const parsed = adminTestimonialSchema.safeParse(await request.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid review." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Review was not saved." }, { status: 503 });
  const { id } = await params;
  try { const existing = await prisma.testimonial.findUnique({ where: { id }, select: { id: true } }); if (!existing) return NextResponse.json({ ok: false, message: "Review not found." }, { status: 404 }); await prisma.testimonial.update({ where: { id }, data: { ...parsed.data, avatarImage: parsed.data.avatarImage || null, country: parsed.data.country || null, nationality: parsed.data.nationality || null, source: parsed.data.source || null } }); revalidatePath("/"); return NextResponse.json({ ok: true, id }); } catch (error) { console.error("Failed to update review", error); return NextResponse.json({ ok: false, message: "Unable to update review." }, { status: 500 }); }
}
export async function DELETE(_request: Request, { params }: Props) {
  const guard = await requireAdminApi({ resource: "testimonials", action: "delete" }); if (!guard.ok) return guard.response;
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. Review was not deleted." }, { status: 503 });
  const { id } = await params;
  try { const existing = await prisma.testimonial.findUnique({ where: { id }, select: { id: true } }); if (!existing) return NextResponse.json({ ok: false, message: "Review not found." }, { status: 404 }); await prisma.testimonial.delete({ where: { id } }); revalidatePath("/"); return NextResponse.json({ ok: true }); } catch (error) { console.error("Failed to delete review", error); return NextResponse.json({ ok: false, message: "Unable to delete review." }, { status: 500 }); }
}