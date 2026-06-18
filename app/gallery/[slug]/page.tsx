import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { getGalleryAlbumBySlugSafe, getGalleryAlbumsSafe } from "@/lib/data/public";
import { safeImageSrc } from "@/lib/images";

type GalleryAlbumPageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: GalleryAlbumPageProps): Promise<Metadata> {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlugSafe(slug);
  if (!album) return { title: "Gallery Album" };

  return {
    title: album.title,
    description: album.description,
    openGraph: {
      images: [{ url: album.coverImage }],
      title: album.title,
      description: album.description,
    },
  };
}

export async function generateStaticParams() {
  const albums = await getGalleryAlbumsSafe();
  return albums.map((album) => ({ slug: album.slug }));
}

export default async function GalleryAlbumPage({ params }: GalleryAlbumPageProps) {
  const { slug } = await params;
  const album = await getGalleryAlbumBySlugSafe(slug);
  if (!album) notFound();

  return (
    <>
      <section className="relative min-h-[360px] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={safeImageSrc(album.coverImage)}
          alt={album.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[var(--color-navy)]/65" />
        <div className="container-premium relative flex min-h-[360px] flex-col justify-end pb-12 pt-20">
          <Link className="mb-8 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]" href="/gallery">
            ← Back to gallery
          </Link>
          <p className="eyebrow text-[var(--color-gold-light)]">{album.category}</p>
          <h1 className="mt-3 max-w-4xl font-serif text-5xl font-semibold leading-tight text-white md:text-6xl">
            {album.title}
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            {album.description}
          </p>
          <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white/70">
            {album.imageCount} {album.imageCount === 1 ? "photo" : "photos"}
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-ivory)] py-14 md:py-20">
        {album.images.length ? (
          <GalleryLightbox images={album.images} />
        ) : (
          <div className="container-premium rounded-2xl border border-[rgb(214_173_84_/_24%)] bg-white p-10 text-center">
            <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">Photos coming soon</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
              This album has been created, and photos can be added from the admin gallery editor.
            </p>
          </div>
        )}
      </section>
    </>
  );
}
