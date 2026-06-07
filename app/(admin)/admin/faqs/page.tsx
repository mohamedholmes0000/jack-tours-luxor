import { FaqForm } from "@/components/admin/simple-cms-forms";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { getAdminFaqs } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = { title: "Admin FAQs" };

export default async function AdminFaqsPage() {
  const faqs = await getAdminFaqs();
  const hasDb = hasConfiguredDatabase();
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">FAQs</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">FAQ manager</h1>
      <div className="mt-6">{!hasDb ? <DatabaseNotice /> : null}</div>
      <div className="mt-8 grid gap-6">
        <FaqForm />
        {faqs.length ? faqs.map((faq) => <FaqForm key={faq.id} id={faq.id} initialValues={faq} />) : <p className="border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">No database FAQs found. The public page still uses static fallback content.</p>}
      </div>
    </div>
  );
}
