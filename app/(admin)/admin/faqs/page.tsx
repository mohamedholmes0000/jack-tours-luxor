import { AdminFaqsManager } from "@/components/admin/admin-faqs-manager";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminFaqs } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = { title: "Admin FAQs" };

export default async function AdminFaqsPage() {
  const [faqs, currentUser] = await Promise.all([getAdminFaqs(), getCurrentAdminUser()]);
  const hasDb = hasConfiguredDatabase();
  const canWriteFaqs = canWriteAdminResource(currentUser?.role || "VIEWER", "faqs", "update");

  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">FAQs</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">FAQ manager</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-gray-600)]">Search and organize only saved FAQ records. The public FAQ design remains unchanged.</p>
      <div className="mt-6">{!hasDb ? <DatabaseNotice /> : null}</div>
      <AdminFaqsManager canWrite={canWriteFaqs} faqs={faqs} />
    </div>
  );
}