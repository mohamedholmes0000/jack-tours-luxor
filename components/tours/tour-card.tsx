import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Tour } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function TourCard({ tour }: { tour: Tour }) {
  const whatsappMessage = `Hello Jack Tours Luxor, I am interested in ${tour.title}. Can you send me details and availability?`;

  return (
    <article className="group overflow-hidden border border-[var(--color-gray-100)] bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute left-4 top-4 bg-[var(--color-navy)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--color-gold-light)]">
          {tour.category}
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
          <span>{tour.duration}</span>
          <span>{formatPrice(tour)}</span>
        </div>
        <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h3>
        <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
          {tour.shortDescription}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary flex-1" href={`/tours/${tour.slug}`}>
            View Tour
          </Link>
          <a
            className="btn-secondary flex-1"
            href={buildWhatsAppUrl(whatsappMessage)}
            target="_blank"
            rel="noreferrer"
          >
            WhatsApp
          </a>
        </div>
      </div>
    </article>
  );
}
