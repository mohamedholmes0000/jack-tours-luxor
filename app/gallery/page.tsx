import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryImagesSafe } from "@/lib/data/public";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Egypt Travel Gallery",
  description:
    "Browse a premium gallery of Luxor, Nile cruise, Cairo, and private Egypt travel experiences from Jack Tours Luxor.",
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
            A clean MVP image grid for Luxor, Nile journeys, Cairo, and travel experiences.
          </p>
        </div>
      </section>

      <section className="section-dark border-y border-[rgb(214_173_84_/_22%)] py-8">
        <div className="container-premium flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/gallery" : `/gallery?category=${encodeURIComponent(category)}`}
              className={`shrink-0 border px-4 py-3 text-xs font-bold uppercase tracking-[0.14em] ${
                active === category
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                  : "border-[rgb(214_173_84_/_32%)] text-white"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {visibleImages.map((image, index) => (
            <figure
              key={image.url}
              className={`group overflow-hidden border border-[rgb(214_173_84_/_20%)] bg-white shadow-[0_16px_45px_rgb(87_59_22_/_8%)] ${index % 5 === 0 ? "md:col-span-2 md:row-span-2" : ""}`}
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <figcaption className="p-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]">
                {image.category}
              </figcaption>
            </figure>
          ))}
        </div>
      </section>

      <section className="section-dark py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl font-semibold text-white">
            Want a private Egypt itinerary around these places?
          </h2>
          <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            WhatsApp Jack Tours
          </a>
        </div>
      </section>
    </>
  );
}
