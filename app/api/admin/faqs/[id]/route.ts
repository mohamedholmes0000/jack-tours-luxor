import { NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminFaqSchema } from "@/lib/validations";

type Props = { params: Promise<{ id: string }> };

export async function PUT(request: Request, { params }: Props) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  const parsed = adminFaqSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ ok: false, message: "Invalid FAQ." }, { status: 400 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. FAQ was not saved." }, { status: 503 });
  const { id } = await params;
  await prisma.fAQ.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: Props) {
  if (!(await isAdminRequest())) return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  if (!hasConfiguredDatabase()) return NextResponse.json({ ok: false, message: "Database is not configured. FAQ was not deleted." }, { status: 503 });
  const { id } = await params;
  await prisma.fAQ.delete({ where: { id } });
  return NextResponse.json({ ok: true });
}
