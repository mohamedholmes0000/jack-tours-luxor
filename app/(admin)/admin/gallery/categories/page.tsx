import Link from "next/link";
import { AdminGalleryCategoriesManager, type AdminGalleryCategoryRow } from "@/components/admin/admin-gallery-categories-manager";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminGalleryCategories } from "@/lib/data/admin";

export const metadata = { title: "Gallery Categories" };

export default async function GalleryCategoriesPage() {
  const [currentUser, categories] = await Promise.all([getCurrentAdminUser(), getAdminGalleryCategories()]);
  const role = currentUser?.role || "VIEWER";
  const canEditGallery = canWriteAdminResource(role, "gallery", "update");
  const canDeleteGallery = canWriteAdminResource(role, "gallery", "delete");
  const rows: AdminGalleryCategoryRow[] = categories.map((category) => ({
    active: category.active,
    id: category.id,
    imageCount: category._count.albums,
    name: category.name,
    order: category.order,
    slug: category.slug,
  }));

  return (
    <div>
      <div className="mb-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/gallery">
            ← Back to Gallery
          </Link>
          <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
            Gallery Categories
          </h1>
          <p className="mt-2 text-sm text-[var(--color-navy)]/60">
            {categories.length} {categories.length === 1 ? "category" : "categories"} available for gallery filtering
          </p>
        </div>
      </div>

      <div className="mb-6 h-px w-full bg-[rgb(214_173_84_/_35%)]" />

      <AdminGalleryCategoriesManager canDelete={canDeleteGallery} canEdit={canEditGallery} categories={rows} />
    </div>
  );
}
