import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AdminGalleryAlbumForm } from "@/components/admin/admin-gallery-album-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminGalleryAlbum, getAdminGalleryCategories } from "@/lib/data/admin";

type GalleryAlbumEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Edit Gallery Album" };

export default async function GalleryAlbumEditPage({ params }: GalleryAlbumEditPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canEditGallery = canWriteAdminResource(role, "gallery", "update");

  if (!canEditGallery) redirect("/admin/gallery");

  const [album, categories] = await Promise.all([getAdminGalleryAlbum(id), getAdminGalleryCategories()]);
  if (!album) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/gallery">
          ← Back to Gallery
        </Link>
        <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
          Edit Gallery Album
        </h1>
        <p className="mt-2 text-sm text-[var(--color-navy)]/60">
          Update album details, add photos, set a cover image, and reorder the public album.
        </p>
      </div>

      <AdminGalleryAlbumForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        id={album.id}
        images={album.images.map((image) => ({
          active: image.active,
          alt: image.alt,
          caption: image.caption,
          description: image.description,
          id: image.id,
          order: image.order,
          publicId: image.publicId,
          title: image.title,
          url: image.url,
        }))}
        initialValues={{
          active: album.active,
          categoryId: album.categoryId || "",
          coverImage: album.coverImage,
          coverImagePublicId: album.coverImagePublicId || "",
          description: album.description || "",
          displayOrder: album.displayOrder,
          slug: album.slug,
          title: album.title,
        }}
        mode="edit"
      />
    </div>
  );
}
