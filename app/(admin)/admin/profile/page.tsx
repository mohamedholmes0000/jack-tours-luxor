import { redirect } from "next/navigation";
import { AdminProfileForm } from "@/components/admin/admin-profile-form";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { roleLabels } from "@/lib/admin/permissions";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

export default async function AdminProfilePage() {
  const currentUser = await getCurrentAdminUser();

  if (!currentUser?.email) {
    redirect("/admin/login");
  }

  const email = currentUser.email.toLowerCase().trim();
  const user = await tryDatabase(
    async () =>
      prisma.adminUser.findUnique({
        where: { email },
        select: {
          email: true,
          name: true,
          role: true,
          createdAt: true,
        },
      }),
    null,
  );

  const displayName = user?.name || currentUser.name || "Admin user";
  const role = user?.role || currentUser.role;
  const canEdit = Boolean(user);

  return (
    <div className="mx-auto grid max-w-4xl gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-dark)]">My Account</p>
        <h1 className="mt-2 font-serif text-4xl font-semibold text-[var(--color-navy)]">Profile</h1>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-gray-600)]">
          Manage your own admin name and password. Email and role changes are reserved for the users management phase.
        </p>
      </div>

      <section className="grid gap-4 rounded-2xl border border-[rgb(214_173_84_/_22%)] bg-white p-5 shadow-sm md:grid-cols-3 md:p-7">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Name</p>
          <p className="mt-2 text-base font-semibold text-[var(--color-navy)]">{displayName}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Email</p>
          <p className="mt-2 break-all text-base font-semibold text-[var(--color-navy)]">{email}</p>
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Role</p>
          <p className="mt-2 inline-flex rounded-full border border-[rgb(214_173_84_/_28%)] px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
            {roleLabels[role]}
          </p>
        </div>
      </section>

      <AdminProfileForm initialName={displayName} email={email} canEdit={canEdit} />
    </div>
  );
}
