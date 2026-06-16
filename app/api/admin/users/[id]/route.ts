import bcrypt from "bcryptjs";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import type { AdminRole } from "@prisma/client";
import { requireAdminApi } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase, prisma } from "@/lib/data/safe-db";
import { adminUserUpdateSchema } from "@/lib/validations";

type UserApiProps = {
  params: Promise<{ id: string }>;
};

async function countSuperAdminsExcept(id?: string) {
  return prisma.adminUser.count({
    where: {
      role: "SUPER_ADMIN",
      active: true,
      ...(id ? { id: { not: id } } : {}),
    },
  });
}

async function assertCanChangeLastSuperAdmin(target: { id: string; role: AdminRole; active: boolean }, next?: { role?: AdminRole; active?: boolean }) {
  const nextRole = next?.role ?? target.role;
  const nextActive = next?.active ?? target.active;
  const wouldStopBeingActiveSuperAdmin =
    target.role === "SUPER_ADMIN" && target.active && (nextRole !== "SUPER_ADMIN" || nextActive === false);

  if (!wouldStopBeingActiveSuperAdmin) return null;

  const otherSuperAdmins = await countSuperAdminsExcept(target.id);
  if (otherSuperAdmins === 0) {
    return NextResponse.json({ ok: false, message: "You cannot remove the last active Super Admin." }, { status: 400 });
  }

  return null;
}

export async function PUT(request: Request, { params }: UserApiProps) {
  const guard = await requireAdminApi({ roles: ["SUPER_ADMIN"] });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. User was not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;
  if (id === guard.user.id) {
    return NextResponse.json({ ok: false, message: "Use My Profile to edit your own account." }, { status: 403 });
  }

  const parsed = adminUserUpdateSchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid user data.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, email: true, role: true, active: true },
  });

  if (!target) return NextResponse.json({ ok: false, message: "User not found." }, { status: 404 });

  if (parsed.data.email !== target.email) {
    const duplicateEmail = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
    if (duplicateEmail) {
      return NextResponse.json({ ok: false, message: "A user with this email already exists." }, { status: 409 });
    }
  }

  const lastSuperAdminError = await assertCanChangeLastSuperAdmin(target, {
    role: parsed.data.role,
    active: parsed.data.active,
  });
  if (lastSuperAdminError) return lastSuperAdminError;

  const data: {
    name: string;
    email: string;
    role: AdminRole;
    active: boolean;
    password?: string;
  } = {
    name: parsed.data.name,
    email: parsed.data.email,
    role: parsed.data.role,
    active: parsed.data.active,
  };

  if (parsed.data.password) {
    data.password = await bcrypt.hash(parsed.data.password, 12);
    console.log(`Admin password changed by ${guard.user.email} for ${parsed.data.email}`);
  }

  await prisma.adminUser.update({ where: { id }, data });

  revalidatePath("/admin/users");
  revalidatePath(`/admin/users/${id}`);

  return NextResponse.json({ ok: true, id });
}

export async function PATCH(request: Request, { params }: UserApiProps) {
  const guard = await requireAdminApi({ roles: ["SUPER_ADMIN"] });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. User status was not saved." },
      { status: 503 },
    );
  }

  const { id } = await params;
  if (id === guard.user.id) {
    return NextResponse.json({ ok: false, message: "You cannot disable yourself." }, { status: 403 });
  }

  const payload = (await request.json().catch(() => null)) as { active?: unknown } | null;
  if (!payload || typeof payload.active !== "boolean") {
    return NextResponse.json({ ok: false, message: "Invalid status." }, { status: 400 });
  }

  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, role: true, active: true },
  });

  if (!target) return NextResponse.json({ ok: false, message: "User not found." }, { status: 404 });

  const lastSuperAdminError = await assertCanChangeLastSuperAdmin(target, { active: payload.active });
  if (lastSuperAdminError) return lastSuperAdminError;

  await prisma.adminUser.update({ where: { id }, data: { active: payload.active } });
  revalidatePath("/admin/users");

  return NextResponse.json({ ok: true });
}

export async function DELETE(_request: Request, { params }: UserApiProps) {
  const guard = await requireAdminApi({ roles: ["SUPER_ADMIN"] });
  if (!guard.ok) return guard.response;

  if (!hasConfiguredDatabase()) {
    return NextResponse.json(
      { ok: false, message: "Database is not configured. User was not deleted." },
      { status: 503 },
    );
  }

  const { id } = await params;
  if (id === guard.user.id) {
    return NextResponse.json({ ok: false, message: "You cannot delete yourself." }, { status: 403 });
  }

  const target = await prisma.adminUser.findUnique({
    where: { id },
    select: { id: true, role: true, active: true },
  });

  if (!target) return NextResponse.json({ ok: false, message: "User not found." }, { status: 404 });

  const lastSuperAdminError = await assertCanChangeLastSuperAdmin(target, { active: false });
  if (lastSuperAdminError) return lastSuperAdminError;

  await prisma.adminUser.delete({ where: { id } });
  revalidatePath("/admin/users");

  return NextResponse.json({ ok: true });
}
