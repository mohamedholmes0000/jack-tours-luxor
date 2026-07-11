import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { inquiryStatusSchema } from "@/lib/validations";

type InquiryApiProps = {
  params: Promise<{ id: string }>;
};

export async function PUT(request: Request, { params }: InquiryApiProps) {
  const guard = await requireAdminApi({ resource: "inquiries", action: "update" });
  if (!guard.ok) return guard.response;

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

export async function DELETE(_request: Request, { params }: InquiryApiProps) {
  const guard = await requireAdminApi({ resource: "inquiries", action: "delete" });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. Inquiry was not deleted." },
      { status: 503 },
    );
  }

  try {
    const { id } = await params;
    const result = await prisma.inquiry.deleteMany({ where: { id } });

    if (!result.count) {
      return NextResponse.json({ ok: false, message: "Inquiry was not found." }, { status: 404 });
    }

    revalidatePath("/admin/inquiries");
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Failed to delete inquiry", error);
    return NextResponse.json({ ok: false, message: "Unable to delete inquiry." }, { status: 500 });
  }
}
