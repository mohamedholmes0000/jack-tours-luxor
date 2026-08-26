import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getGalleryAlbumsSafe } from "@/lib/data/public";
import { safeImageSrc } from "@/lib/images";

export const metadata: Metadata = {
  title: "Egypt Travel Gallery",
  description:
    "Browse premium Egypt travel albums from Luxor, Nile cruise, Cairo, and private Jack Luxor Tour journeys.",
};

type GalleryPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const albums = await getGalleryAlbumsSafe();
  const categories = ["All", ...Array.from(new Set(albums.map((album) => album.category)))];
  const active = params?.category ?? "All";
  const visibleAlbums = active === "All" ? albums : albums.filter((album) => album.category === active);

  return (
    <>
      <section className="relative grid h-[220px] place-items-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/felucca.jpg"
          alt="Felucca sailing on the Nile"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(0_0_0_/_50%)]" />
        <div className="relative px-5">
          <p className="eyebrow text-[var(--color-gold-light)]">Our Gallery</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">Moments from Egypt</h1>
          <p className="mt-3 text-base text-white/70">
            Private moments, ancient places, and Nile light captured across Egypt.
          </p>
        </div>
      </section>

      <section className="bg-[var(--color-ivory)] py-14 md:py-20">
        <div className="container-premium mb-8 flex gap-3 overflow-x-auto pb-2">
          {categories.map((category) => (
            <Link
              key={category}
              href={category === "All" ? "/gallery" : `/gallery?category=${encodeURIComponent(category)}`}
              className={`shrink-0 rounded-full border px-5 py-2 text-xs font-bold uppercase tracking-widest transition duration-300 ${
                active === category
                  ? "border-[var(--color-gold)] bg-[var(--color-gold)] text-[var(--color-navy)]"
                  : "border-[rgb(214_173_84_/_30%)] bg-white text-[var(--color-navy)] hover:border-[var(--color-gold)]"
              }`}
            >
              {category}
            </Link>
          ))}
        </div>

        <div className="container-premium grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {visibleAlbums.map((album) => (
            <Link
              key={album.slug}
              href={`/gallery/${album.slug}`}
              className="group overflow-hidden rounded-[22px] border border-[rgb(214_173_84_/_24%)] bg-white shadow-[0_18px_45px_rgb(10_14_30_/_10%)] transition duration-300 hover:-translate-y-1 hover:border-[rgb(214_173_84_/_55%)]"
            >
              <div className="relative aspect-[16/11] overflow-hidden">
                <Image
                  src={safeImageSrc(album.coverImage)}
                  alt={album.title}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 48vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-navy)]/75 via-[var(--color-navy)]/10 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                  {album.imageCount} {album.imageCount === 1 ? "photo" : "photos"}
                </span>
              </div>
              <div className="bg-[var(--color-navy)] p-5 text-white">
                <p className="eyebrow text-[var(--color-gold-light)]">{album.category}</p>
                <h2 className="mt-3 font-serif text-3xl font-semibold leading-tight text-white">
                  {album.title}
                </h2>
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/68">
                  {album.description}
                </p>
                <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
                  Open album →
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-14 text-white md:py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <h2 className="max-w-2xl text-3xl font-bold leading-tight md:text-[2.4rem]">
              Want a private Egypt itinerary around these places?
            </h2>
            <p className="mt-4 max-w-xl text-base leading-7 text-white/70">
              Tell us which destinations caught your eye, and we&apos;ll build the route.
            </p>
          </div>
          <Link className="btn-primary" href="/trip-planner">
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
