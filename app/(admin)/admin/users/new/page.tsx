import { AdminAccessDenied } from "@/components/admin/admin-access-denied";
import { AdminUserForm } from "@/components/admin/admin-user-form";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";

export const metadata = { title: "Add Admin User" };

export default async function NewAdminUserPage() {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser || currentUser.role !== "SUPER_ADMIN") {
    return <AdminAccessDenied />;
  }

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Users</p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Add user</h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Create a new admin account with a role and login password.
        </p>
      </div>
      <AdminUserForm mode="create" />
    </div>
  );
}
