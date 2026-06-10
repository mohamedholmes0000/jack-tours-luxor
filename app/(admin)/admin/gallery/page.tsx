import Image from "next/image";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { GalleryImageForm } from "@/components/admin/simple-cms-forms";
import { getAdminGalleryImages } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";
import { safeImageSrc } from "@/lib/images";

export const metadata = { title: "Admin Gallery" };

export default async function AdminGalleryPage() {
  const images = await getAdminGalleryImages();
  const hasDb = hasConfiguredDatabase();
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Gallery</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Gallery manager</h1>
      <div className="mt-6">{!hasDb ? <DatabaseNotice /> : null}</div>
      <div className="mt-8 grid gap-6">
        <GalleryImageForm />
        {images.length ? images.map((image) => <div key={image.id} className="grid gap-4 lg:grid-cols-[180px_1fr]"><div className="relative min-h-40 overflow-hidden bg-[var(--color-gray-100)]"><Image src={safeImageSrc(image.url)} alt={image.alt} fill sizes="180px" className="object-cover" /></div><GalleryImageForm id={image.id} initialValues={{ url: image.url, alt: image.alt, category: image.category ?? "Experiences", relatedTourSlug: image.relatedTourSlug ?? "", order: image.order }} /></div>) : <p className="border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">No database gallery images found. The public page still uses static fallback content.</p>}
      </div>
    </div>
  );
}
