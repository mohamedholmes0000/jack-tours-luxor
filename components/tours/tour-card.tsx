import Image from "next/image";
import Link from "next/link";
import { formatPrice, type Tour } from "@/lib/content";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

export function TourCard({ tour, whatsappNumber }: { tour: Tour; whatsappNumber?: string }) {
  const whatsappMessage = `Hello Jack Egypt Tour, I am interested in ${tour.title}. Can you send me details and availability?`;

  return (
    <article className="group overflow-hidden border border-[rgb(214_173_84_/_28%)] bg-[linear-gradient(180deg,#102a45_0%,#06111f_100%)] text-white shadow-[0_22px_60px_rgb(0_0_0_/_28%)] transition duration-300 hover:-translate-y-1">
      <Link href={`/tours/${tour.slug}`} className="relative block aspect-[4/3] overflow-hidden">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgb(6_17_31_/_16%)] to-transparent" />
        <div className="absolute left-4 top-4 bg-[rgba(6,17,31,0.74)] px-3 py-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--color-gold-light)] backdrop-blur">
          {tour.category}
        </div>
        <div className="absolute right-4 top-4 flex size-9 items-center justify-center rounded-full border border-[rgb(214_173_84_/_45%)] bg-[rgba(214,173,84,0.16)] text-[var(--color-gold-light)]">
          +
        </div>
      </Link>
      <div className="p-6">
        <div className="flex items-center justify-between gap-4 text-xs font-bold uppercase tracking-[0.14em] text-white/58">
          <span>{tour.duration}</span>
          <span className="text-[var(--color-gold-light)]">{formatPrice(tour)}</span>
        </div>
        <h3 className="mt-4 font-serif text-2xl font-semibold leading-tight text-white">
          <Link href={`/tours/${tour.slug}`}>{tour.title}</Link>
        </h3>
        <p className="mt-4 text-sm leading-7 text-white/68">
          {tour.shortDescription}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary flex-1" href={`/tours/${tour.slug}`}>
            View Tour
          </Link>
          <a
            className="btn-secondary flex-1"
            href={buildWhatsAppUrlForNumber(whatsappMessage, whatsappNumber)}
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
