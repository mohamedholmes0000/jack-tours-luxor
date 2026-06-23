import Link from "next/link";
import { AdminToursGrid, type AdminToursGridTour } from "@/components/admin/admin-tours-grid";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTours } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Activities",
};

export default async function AdminActivitiesPage() {
  const activities = await getAdminTours("ACTIVITY");
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canCreate = canWriteAdminResource(role, "tours", "create");
  const canEdit = canWriteAdminResource(role, "tours", "update");
  const canDelete = canWriteAdminResource(role, "tours", "delete");
  const cards: AdminToursGridTour[] = activities.map((activity) => ({
    id: activity.id,
    contentType: activity.contentType,
    slug: activity.slug,
    title: activity.title,
    category: activity.category || "Activity",
    shortDescription: activity.shortDescription || "Private Egypt activity.",
    duration: activity.duration || "",
    city: activity.city || "Egypt",
    rating: activity.rating || 0,
    reviewCount: activity.reviewCount || 0,
    groupSize: activity.groupSize || "",
    priceFrom: activity.priceFrom,
    priceCurrency: activity.priceCurrency || "$",
    heroImage: activity.heroImage,
    published: activity.published,
    featured: activity.featured,
    createdAt: activity.createdAt.toISOString(),
  }));

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
            Activities
          </h1>
          <p className="mt-2 text-sm text-[var(--color-navy)]/60">
            {activities.length} {activities.length === 1 ? "activity" : "activities"} in your catalog
          </p>
        </div>
        {canCreate ? (
          <Link
            className="inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
            href="/admin/activities/new"
          >
            + Add New Activity
          </Link>
        ) : null}
      </div>

      <div className="mt-6 h-px w-full bg-[rgb(214_173_84_/_35%)]" />

      <AdminToursGrid
        tours={cards}
        canCreate={canCreate}
        canDelete={canDelete}
        canEdit={canEdit}
        createHref="/admin/activities/new"
        emptyTitle="No activities found"
        singularLabel="Activity"
      />
    </div>
  );
}
