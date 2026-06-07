import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminFaqSchema } from "@/lib/validations";

export async function POST(request: Request) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const parsed = adminFaqSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid FAQ." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. FAQ was not saved." }, { status: 503 });
  await prisma.fAQ.create({ data: parsed.data });
  return NextResponse.json({ ok: true });
}
