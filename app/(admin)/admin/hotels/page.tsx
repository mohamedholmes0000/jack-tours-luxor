import Link from "next/link";
import { AdminToursGrid, type AdminToursGridTour } from "@/components/admin/admin-tours-grid";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTours } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Hotels",
};

export default async function AdminHotelsPage() {
  const hotels = await getAdminTours("HOTEL");
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canCreate = canWriteAdminResource(role, "tours", "create");
  const canEdit = canWriteAdminResource(role, "tours", "update");
  const canDelete = canWriteAdminResource(role, "tours", "delete");
  const cards: AdminToursGridTour[] = hotels.map((hotel) => ({
    id: hotel.id,
    contentType: hotel.contentType,
    slug: hotel.slug,
    title: hotel.title,
    category: hotel.category || "Hotel",
    shortDescription: hotel.shortDescription || "Egypt hotel option.",
    duration: hotel.duration || "",
    city: hotel.city || "Egypt",
    rating: hotel.rating || 0,
    reviewCount: hotel.reviewCount || 0,
    groupSize: hotel.groupSize || "",
    priceFrom: hotel.priceFrom,
    priceCurrency: hotel.priceCurrency || "$",
    heroImage: hotel.heroImage,
    published: hotel.published,
    featured: hotel.featured,
    createdAt: hotel.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
            Hotels
          </h1>
          <p className="mt-2 text-sm text-[var(--color-navy)]/60">
            {hotels.length} {hotels.length === 1 ? "hotel" : "hotels"} in your catalog
          </p>
        </div>
        {canCreate ? (
          <Link
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
            href="/admin/hotels/new"
          >
            + Add New Hotel
          </Link>
        ) : null}
      </div>

      <div className="mt-6 h-px w-full bg-[rgb(214_173_84_/_35%)]" />

      <AdminToursGrid
        tours={cards}
        canCreate={canCreate}
        canDelete={canDelete}
        canEdit={canEdit}
        createHref="/admin/hotels/new"
        emptyTitle="No hotels found"
        singularLabel="Hotel"
      />
    </div>
  );
}
