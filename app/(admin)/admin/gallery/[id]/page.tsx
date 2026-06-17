import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { AdminGalleryImageForm } from "@/components/admin/admin-gallery-image-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminGalleryCategories, getAdminGalleryImage } from "@/lib/data/admin";

type GalleryImageEditPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = { title: "Edit Gallery Image" };

export default async function GalleryImageEditPage({ params }: GalleryImageEditPageProps) {
  const { id } = await params;
  const currentUser = await getCurrentAdminUser();
  const role = currentUser?.role || "VIEWER";
  const canEditGallery = canWriteAdminResource(role, "gallery", "update");

  if (!canEditGallery) redirect("/admin/gallery");

  const [image, categories] = await Promise.all([getAdminGalleryImage(id), getAdminGalleryCategories()]);
  if (!image) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/gallery">
          ← Back to Gallery
        </Link>
        <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
          Edit Gallery Image
        </h1>
        <p className="mt-2 text-sm text-[var(--color-navy)]/60">
          Update the image, title, caption, category, and public display order.
        </p>
      </div>

      <AdminGalleryImageForm
        categories={categories.map((category) => ({ id: category.id, name: category.name }))}
        id={image.id}
        initialValues={{
          active: image.active,
          alt: image.alt,
          caption: image.caption || "",
          category: image.categoryRef?.name || image.category || "Experiences",
          categoryId: image.categoryId || "",
          description: image.description || "",
          order: image.order,
          relatedTourSlug: image.relatedTourSlug || "",
          title: image.title || image.alt,
          url: image.url,
        }}
        mode="edit"
      />
    </div>
  );
}
