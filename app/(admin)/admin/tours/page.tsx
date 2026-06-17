import Link from "next/link";
import { AdminToursGrid, type AdminToursGridTour } from "@/components/admin/admin-tours-grid";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTours } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Tours",
};

export default async function AdminToursPage() {
  const tours = await getAdminTours();
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canCreateTours = canWriteAdminResource(role, "tours", "create");
  const canEditTours = canWriteAdminResource(role, "tours", "update");
  const canDeleteTours = canWriteAdminResource(role, "tours", "delete");
  const tourCards: AdminToursGridTour[] = tours.map((tour) => ({
    id: tour.id,
    slug: tour.slug,
    title: tour.title,
    category: tour.category || "Custom",
    shortDescription: tour.shortDescription || "Private Egypt journey.",
    duration: tour.duration || "",
    city: tour.city || "Egypt",
    rating: tour.rating || 0,
    reviewCount: tour.reviewCount || 0,
    groupSize: tour.groupSize || "",
    priceFrom: tour.priceFrom,
    priceCurrency: tour.priceCurrency || "$",
    heroImage: tour.heroImage,
    published: tour.published,
    featured: tour.featured,
    createdAt: tour.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
            Tours
          </h1>
          <p className="mt-2 text-sm text-[var(--color-navy)]/60">
            {tours.length} {tours.length === 1 ? "tour" : "tours"} in your catalog
          </p>
        </div>
        {canCreateTours ? (
          <Link
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
            href="/admin/tours/new"
          >
            + Add New Tour
          </Link>
        ) : null}
      </div>

      <div className="mt-6 h-px w-full bg-[rgb(214_173_84_/_35%)]" />

      <AdminToursGrid tours={tourCards} canCreate={canCreateTours} canDelete={canDeleteTours} canEdit={canEditTours} />
    </div>
  );
}
