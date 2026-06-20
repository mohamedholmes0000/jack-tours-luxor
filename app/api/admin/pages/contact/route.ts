import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminContactMapSchema } from "@/lib/validations";

export async function PUT(request: Request) {
  const guard = await requireAdminApi({ resource: "pages", action: "update" });
  if (!guard.ok) return guard.response;

  const parsed = adminContactMapSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ ok: false, message: "Invalid contact map settings." }, { status: 400 });
  }

  if (!hasConfiguredDatabase()) {
    return NextResponse.json({ ok: false, message: "Database is not configured." }, { status: 503 });
  }

  await prisma.contactPage.upsert({
    where: { id: "contact" },
    update: parsed.data,
    create: {
      id: "contact",
      ...parsed.data,
    },
  });

  revalidatePath("/contact");
  return NextResponse.json({ ok: true });
}
