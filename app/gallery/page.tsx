import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";
import type { GalleryImage } from "@/lib/content";
import { getGalleryImagesSafe } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Egypt Travel Gallery",
  description:
    "Browse a premium gallery of Luxor, Nile cruise, Cairo, and private Egypt travel experiences from Jack Egypt Tour.",
};

type GalleryPageProps = {
  searchParams?: Promise<{ category?: string }>;
};

const categories = ["All", "Luxor", "Nile Cruise", "Cairo", "Experiences"] as const;

const localGalleryImages: GalleryImage[] = [
  {
    url: "/photos/karnak.jpg",
    alt: "Karnak Temple columns in Luxor",
    title: "Karnak Temple Columns",
    description: "A quiet temple moment among the monumental columns of Karnak in Luxor.",
    category: "Luxor",
  },
  {
    url: "/photos/luxor-temple.jpg",
    alt: "Luxor Temple in Egypt",
    title: "Luxor Temple",
    description: "Warm stone, city light, and the open-air museum feeling of Luxor.",
    category: "Luxor",
  },
  {
    url: "/photos/valley-of-kings.jpg",
    alt: "Valley of the Kings in Luxor",
    title: "Valley of the Kings",
    description: "Royal tomb country on Luxor's West Bank, best explored at a private pace.",
    category: "Luxor",
  },
  {
    url: "/photos/hatshepsut.jpg",
    alt: "Temple of Hatshepsut in Luxor",
    title: "Hatshepsut Temple",
    description: "A terraced West Bank landmark framed by the cliffs of Deir el-Bahari.",
    category: "Luxor",
  },
  {
    url: "/photos/felucca.jpg",
    alt: "Traditional felucca sailing on the Nile",
    title: "Felucca on the Nile",
    description: "A slower Nile rhythm between temple days and southern light.",
    category: "Nile Cruise",
  },
  {
    url: "/photos/nile.jpg",
    alt: "Nile river view in Upper Egypt",
    title: "Upper Egypt Nile",
    description: "River scenery for journeys between Luxor, Edfu, Kom Ombo, and Aswan.",
    category: "Nile Cruise",
  },
  {
    url: "/photos/aswan.jpg",
    alt: "Aswan landscape by the Nile",
    title: "Aswan Light",
    description: "Granite islands, soft river color, and the calmer rhythm of southern Egypt.",
    category: "Nile Cruise",
  },
  {
    url: "/photos/pyramids.jpg",
    alt: "Pyramids of Giza near Cairo",
    title: "Giza Plateau",
    description: "The classic Cairo opening, shaped with time for context and photography.",
    category: "Cairo",
  },
  {
    url: "/photos/abu-simbel.jpg",
    alt: "Abu Simbel temples in southern Egypt",
    title: "Abu Simbel",
    description: "A dramatic southern extension near Lake Nasser and the Nubian frontier.",
    category: "Experiences",
  },
  {
    url: "/photos/hurghada.jpg",
    alt: "Hurghada and the Red Sea coast",
    title: "Hurghada Coast",
    description: "A restful Red Sea finale after Egypt's temples, tombs, and Nile journeys.",
    category: "Experiences",
  },
  {
    url: "/photos/red-sea.jpg",
    alt: "Red Sea coastline in Egypt",
    title: "Red Sea Water",
    description: "Clear water, coastal air, and a softer ending to a private Egypt route.",
    category: "Experiences",
  },
  {
    url: "/photos/alexandria.jpg",
    alt: "Alexandria on the Mediterranean coast",
    title: "Mediterranean Egypt",
    description: "A coastal contrast for travelers adding Alexandria to Cairo and Upper Egypt.",
    category: "Experiences",
  },
];

function ensureGalleryDepth(images: GalleryImage[]) {
  const seen = new Set(images.map((image) => image.url));
  const merged = [...images];

  for (const image of localGalleryImages) {
    if (merged.length >= 12) break;
    if (!seen.has(image.url)) {
      merged.push(image);
      seen.add(image.url);
    }
  }

  return merged;
}

export default async function GalleryPage({ searchParams }: GalleryPageProps) {
  const params = await searchParams;
  const galleryImages = ensureGalleryDepth(await getGalleryImagesSafe());
  const active = params?.category ?? "All";
  const visibleImages =
    active === "All" ? galleryImages : galleryImages.filter((image) => image.category === active);

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
          <p className="mt-3 text-base text-white/70">Scenes from our private journeys</p>
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

        <GalleryLightbox images={visibleImages} />
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
