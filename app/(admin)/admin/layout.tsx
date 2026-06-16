import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-[var(--color-gray-50)] lg:grid lg:grid-cols-[280px_1fr]">
      <AdminSidebar
        user={{
          name: session.user?.name,
          email: session.user?.email,
        }}
      />
      <main className="min-w-0 p-5 md:p-8">{children}</main>
    </div>
  );
}
