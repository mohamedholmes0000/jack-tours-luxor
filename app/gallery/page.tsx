import type { Metadata } from "next";
import Link from "next/link";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import { getGalleryImagesSafe } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Egypt Travel Gallery",
  description:
    "Browse a premium gallery of Luxor, Nile cruise, Cairo, and private Egypt travel experiences from Jack Egypt Tour.",
};

type GalleryPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

const categories = ["All", "Luxor", "Nile Cruise", "Cairo", "Experiences"] as const;

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const galleryImages = await getGalleryImagesSafe();
  const active = params?.category ?? "All";
  const visibleImages =
    active === "All" ? galleryImages : galleryImages.filter((image) => image.category === active);

  return (
    <>
      <section className="section-dark pattern-overlay py-20 text-white md:py-28">
        <div className="container-premium relative">
          <p className="eyebrow text-[var(--color-gold-light)]">Gallery</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Egypt, framed for private travel.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Private moments, ancient places, and Nile light — captured across Egypt.
          </p>
        </div>
      </section>

      <section className="section-dark border-y border-[rgb(214_173_84_/_22%)] py-8">
        <div className="container-premium flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/gallery" : `/gallery?category=${encodeURIComponent(category)}`}
              className={`shrink-0 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition duration-300 ${
                active === category
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                  : "border-[rgb(214_173_84_/_30%)] bg-[var(--color-ivory)] text-[var(--color-navy)] hover:border-[var(--color-gold)] hover:bg-white"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <GalleryLightbox images={visibleImages} />
      </section>

      <section className="section-dark py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-2xl font-serif text-4xl font-semibold text-white">
              Want a private Egypt itinerary around these places?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              Tell us which destinations caught your eye — we&apos;ll build the route.
            </p>
          </div>
          <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            WhatsApp Jack Egypt Tour
          </a>
        </div>
      </section>
    </>
  );
}
