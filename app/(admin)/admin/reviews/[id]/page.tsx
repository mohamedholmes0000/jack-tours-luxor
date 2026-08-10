import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTestimonialForm } from "@/components/admin/admin-testimonial-form";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTestimonial } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
type Props = { params: Promise<{ id: string }> };
export const metadata = { title: "Edit Review" };
export default async function EditAdminReviewPage({ params }: Props) {
  const { id } = await params; const [testimonial, currentUser] = await Promise.all([getAdminTestimonial(id), getCurrentAdminUser()]); const canWrite = canWriteAdminResource(currentUser?.role || "VIEWER", "testimonials", "update"); if (!testimonial) notFound();
  return <div><Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/reviews">← Back to reviews</Link><h1 className="my-6 font-serif text-5xl font-semibold text-[var(--color-navy)]">Edit traveler review</h1>{!hasConfiguredDatabase() ? <DatabaseNotice /> : null}{canWrite ? <AdminTestimonialForm id={testimonial.id} initialValues={testimonial} mode="edit" /> : <p className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">Your role can view this review but cannot edit it.</p>}</div>;
}