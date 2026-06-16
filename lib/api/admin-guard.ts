import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import type { AdminRole } from "@prisma/client";
import { canWriteAdminResource, type AdminResource } from "@/lib/admin/permissions";
import { authOptions } from "@/lib/auth";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

export type CurrentAdminUser = {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  active: boolean;
};

export async function getCurrentAdminUser(): Promise<CurrentAdminUser | null> {
  const session = await getServerSession(authOptions);
  const email = session?.user?.email?.toLowerCase().trim();

  if (!email) return null;

  const user = await tryDatabase(
    async () =>
      prisma.adminUser.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
        },
      }),
    null,
  );

  if (user) return user.active ? user : null;

  if (process.env.NODE_ENV !== "production" && email === "admin@jacktoursluxor.com") {
    return {
      id: "dev-admin",
      email,
      name: session?.user?.name || "Jack Egypt Tour Admin",
      role: "SUPER_ADMIN",
      active: true,
    };
  }

  return null;
}

export async function isAdminRequest() {
  return Boolean(await getCurrentAdminUser());
}

export async function requireAdminApi(options?: {
  resource?: AdminResource;
  action?: "create" | "update" | "delete";
  roles?: AdminRole[];
}) {
  const user = await getCurrentAdminUser();

  if (!user) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 }),
    };
  }

  if (options?.roles && !options.roles.includes(user.role)) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Access denied." }, { status: 403 }),
    };
  }

  if (options?.resource && !canWriteAdminResource(user.role, options.resource, options.action)) {
    return {
      ok: false as const,
      response: NextResponse.json({ ok: false, message: "Access denied." }, { status: 403 }),
    };
  }

  return { ok: true as const, user };
}
