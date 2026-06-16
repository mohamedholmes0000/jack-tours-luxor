import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await getCurrentAdminUser();

  if (!user) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar
        user={{
          name: user.name,
          email: user.email,
          role: user.role,
        }}
      />
      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  );
}
