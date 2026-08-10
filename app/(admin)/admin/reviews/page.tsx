import Link from "next/link";
import { AdminTestimonialsList } from "@/components/admin/admin-testimonials-list";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTestimonials } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
export const metadata = { title: "Admin Reviews" };
export default async function AdminReviewsPage() {
  const [testimonials, currentUser] = await Promise.all([getAdminTestimonials(), getCurrentAdminUser()]);
  const canWrite = canWriteAdminResource(currentUser?.role || "VIEWER", "testimonials", "update");
  return <div><div className="flex flex-col justify-between gap-5 md:flex-row md:items-end"><div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Reviews</p><h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Traveler reviews</h1><p className="mt-3 max-w-2xl text-sm leading-6 text-[var(--color-gray-600)]">Manage selected real traveler feedback. These are manual records; no external review service is connected.</p></div>{canWrite ? <Link className="btn-primary" href="/admin/reviews/new">Add review</Link> : null}</div>{!hasConfiguredDatabase() ? <div className="mt-6"><DatabaseNotice /></div> : null}<AdminTestimonialsList canWrite={canWrite} testimonials={testimonials} /></div>;
}