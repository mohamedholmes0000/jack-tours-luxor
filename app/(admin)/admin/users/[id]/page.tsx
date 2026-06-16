import { redirect } from "next/navigation";
import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { prisma } from "@/lib/data/safe-db";

export const metadata = { title: "Edit Admin User" };

type EditAdminUserPageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditAdminUserPage({ params }: EditAdminUserPageProps) {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return <AdminAccessDenied />;
  }

  const { id } = await params;
  if (id === currentUser.id) redirect("/admin/profile");

  const user = await prisma.adminUser.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (!user) {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-[var(--color-gray-100)] bg-white p-8 shadow-sm">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Users</p>
        <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">User not found</h1>
      </div>
    );
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Users</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Edit user</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Update this user&apos;s role, status, or password.
        </p>
      </div>
      <AdminUserForm
        mode="edit"
        id={user.id}
        initialValues={{
          name: user.name,
          email: user.email,
          role: user.role,
          active: user.active,
          createdAt: user.createdAt.toISOString(),
          lastLoginAt: user.lastLoginAt?.toISOString() || null,
        }}
      />
    </div>
  );
}
