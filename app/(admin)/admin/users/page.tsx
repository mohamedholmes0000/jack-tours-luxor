import Link from "next/link";
import type { AdminRole } from "@prisma/client";
import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminUsersTable, type AdminUsersTableUser } from "@/components/admin/admin-users-table";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { prisma } from "@/lib/data/safe-db";

export const metadata = { title: "Admin Users" };

type UsersPageProps = {
  searchParams: Promise<{ q?: string; role?: string }>;
};

const roles: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"];

export default async function AdminUsersPage({ searchParams }: UsersPageProps) {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return <AdminAccessDenied />;
  }

  const filters = await searchParams;
  const q = filters.q?.trim() || "";
  const role = roles.includes(filters.role as AdminRole) ? (filters.role as AdminRole) : "";
  const users = await prisma.adminUser.findMany({
    where: {
      ...(q
        ? {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { email: { contains: q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(role ? { role } : {}),
    },
    orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
      createdAt: true,
    },
  });

  const tableUsers: AdminUsersTableUser[] = users.map((user) => ({
    ...user,
    createdAt: user.createdAt.toISOString(),
    lastLoginAt: user.lastLoginAt?.toISOString() || null,
  }));

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Users</p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">User management</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
            Manage admin users, roles, account status, and passwords.
          </p>
        </div>
        <Link className="btn-primary" href="/admin/users/new">
          Add User
        </Link>
      </div>

      <form className="mt-8 grid gap-3 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm md:grid-cols-[1fr_220px_auto]" action="/admin/users">
        <input
          className="min-h-12 border border-[rgb(214_173_84_/_28%)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
          defaultValue={q}
          name="q"
          placeholder="Search by name or email"
          type="search"
        />
        <select
          className="min-h-12 border border-[rgb(214_173_84_/_28%)] px-4 py-3 text-sm outline-none focus:border-[var(--color-gold)]"
          defaultValue={role}
          name="role"
        >
          <option value="">All roles</option>
          <option value="SUPER_ADMIN">Super Admin</option>
          <option value="ADMIN">Admin</option>
          <option value="EDITOR">Editor</option>
          <option value="VIEWER">Viewer</option>
        </select>
        <button className="btn-secondary" type="submit">
          Filter
        </button>
      </form>

      <section className="mt-6">
        <AdminUsersTable users={tableUsers} currentUserId={currentUser.id} />
      </section>
    </div>
  );
}
