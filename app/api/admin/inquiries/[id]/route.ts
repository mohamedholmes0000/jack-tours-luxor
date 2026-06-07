import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "@/lib/auth";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { inquiryStatusSchema } from "@/lib/validations";

type InquiryApiProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: InquiryApiProps) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const payload = await request.json().catch(() => null);
  const parsed = inquiryStatusSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid status.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Status was not saved." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    await prisma.inquiry.update({
      where: { id },
      data: { status: parsed.data.status },
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to update inquiry", error);
    return NextResponse.json({ ok: false, message: "Unable to update inquiry." }, { status: 500 });
  }
}
