import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminFaqSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ resource: "faqs", action: "create" });
  if (!guard.ok) return guard.response;
  const parsed = adminFaqSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid FAQ." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. FAQ was not saved." }, { status: 503 });
  await prisma.fAQ.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
