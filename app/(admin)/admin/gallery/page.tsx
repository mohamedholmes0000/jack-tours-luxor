import Link from "next/link";
import { AdminGalleryGrid, type AdminGalleryCard } from "@/components/admin/admin-gallery-grid";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminGalleryCategories, getAdminGalleryImages } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = { title: "Admin Gallery" };

export default async function AdminGalleryPage() {
  const [images, categories] = await Promise.all([getAdminGalleryImages(), getAdminGalleryCategories()]);
  const hasDb = hasConfiguredDatabase();
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canCreateGallery = canWriteAdminResource(role, "gallery", "create");
  const canEditGallery = canWriteAdminResource(role, "gallery", "update");
  const canDeleteGallery = canWriteAdminResource(role, "gallery", "delete");
  const cards: AdminGalleryCard[] = images.map((image) => ({
    active: image.active,
    alt: image.alt,
    caption: image.caption,
    category: image.categoryRef?.name || image.category,
    createdAt: image.createdAt.toISOString(),
    id: image.id,
    order: image.order,
    title: image.title,
    url: image.url,
  }));
  const categoryNames = Array.from(
    new Set([
      ...categories.map((category) => category.name),
      ...images.map((image) => image.categoryRef?.name || image.category).filter(Boolean),
    ]),
  ) as string[];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <h1 className="font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
            Gallery
          </h1>
          <p className="mt-2 text-sm text-[var(--color-navy)]/60">
            {images.length} {images.length === 1 ? "image" : "images"} in your gallery
          </p>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link
            className="inline-flex items-center justify-center rounded-md border border-[rgb(214_173_84_/_45%)] px-5 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-white"
            href="/admin/gallery/categories"
          >
            Manage Categories
          </Link>
          {canCreateGallery ? (
            <Link
              className="inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-6 py-3 text-sm font-bold uppercase tracking-[0.1em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
              href="/admin/gallery/new"
            >
              + Add New Image
            </Link>
          ) : null}
        </div>
      </div>

      <div className="mt-6 h-px w-full bg-[rgb(214_173_84_/_35%)]" />
      <div className="mt-6">{!hasDb ? <DatabaseNotice /> : null}</div>

      <AdminGalleryGrid
        canCreate={canCreateGallery}
        canDelete={canDeleteGallery}
        canEdit={canEditGallery}
        categories={categoryNames}
        images={cards}
      />
    </div>
  );
}
