import Link from "next/link";
import { AdminTestimonialForm } from "@/components/admin/admin-testimonial-form";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
export const metadata = { title: "New Review" };
export default async function NewAdminReviewPage() {
  const currentUser = await getCurrentAdminUser(); const canWrite = canWriteAdminResource(currentUser?.role || "VIEWER", "testimonials", "create");
  return <div><Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/reviews">← Back to reviews</Link><h1 className="my-6 font-serif text-5xl font-semibold text-[var(--color-navy)]">Add traveler review</h1>{!hasConfiguredDatabase() ? <DatabaseNotice /> : null}{canWrite ? <AdminTestimonialForm mode="create" /> : <p className="mt-6 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">Your role can view reviews but cannot add one.</p>}</div>;
}