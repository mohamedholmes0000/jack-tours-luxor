import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminUserCreateSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const guard = await requireAdminApi({ roles: ["SUPER_ADMIN"] });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. User was not saved." },
      { status: 503 },
    );
  }

  const parsed = adminUserCreateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid user data.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const existingUser = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (existingUser) {
    return NextResponse.json({ ok: false, message: "A user with this email already exists." }, { status: 409 });
  }

  const password = await bcrypt.hash(parsed.data.password, 12);
  const user = await prisma.adminUser.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      password,
      role: parsed.data.role,
      active: parsed.data.active,
    },
    select: { id: true },
  });

  revalidatePath("/admin/users");

  return NextResponse.json({ ok: true, id: user.id });
}
