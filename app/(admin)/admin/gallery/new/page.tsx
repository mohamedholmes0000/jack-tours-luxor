import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminGalleryAlbumForm } from "@/components/admin/admin-gallery-album-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminGalleryCategories } from "@/lib/data/admin";

export const metadata = { title: "Add Gallery Album" };

export default async function NewGalleryAlbumPage() {
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canCreateGallery = canWriteAdminResource(role, "gallery", "create");

  if (!canCreateGallery) redirect("/admin/gallery");

  const categories = await getAdminGalleryCategories();

  return (
    <div>
      <div className="mb-6">
        <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/gallery">
          ← Back to Gallery
        </Link>
        <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
          Add New Album
        </h1>
        <p className="mt-2 text-sm text-[var(--color-navy)]/60">
          Create an album first, then add multiple photos from the edit page.
        </p>
      </div>

      <AdminGalleryAlbumForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        mode="create"
      />
    </div>
  );
}
