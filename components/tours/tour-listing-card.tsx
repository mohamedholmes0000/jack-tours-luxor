import Image from "next/image";
import Link from "next/link";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import type { Tour } from "@/lib/content";

function MapPinIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" viewBox="0 0 24 24" fill="none">
      <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 6v6l4 2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg aria-hidden="true" className="size-[15px]" viewBox="0 0 24 24" fill="currentColor">
      <path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.2L5.8 21 7 14.2 2 9.3l6.9-1L12 2Z" />
    </svg>
  );
}

function priceLabel(tour: Tour) {
  if (!tour.priceFrom) return "Custom quote";

  const symbol = tour.priceCurrency === "USD" ? "$" : `${tour.priceCurrency} `;
  return `${symbol}${tour.priceFrom.toLocaleString("en-US")}`;
}

function contentHref(tour: Tour) {
  return tour.contentType === "ACTIVITY" ? `/activities/${tour.slug}` : `/tours/${tour.slug}`;
}

export function TourListingCard({
  tour,
  metadataLabel,
}: {
  tour: Tour;
  metadataLabel?: string;
}) {
  const href = contentHref(tour);

  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_10%)]">
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/10]">
        <Link href={href} className="absolute inset-0">
          <Image
            src={tour.heroImage}
            alt={tour.title}
            fill
            sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 100vw"
            className="object-cover transition duration-500 group-hover:scale-105"
          />
        </Link>
        <FavoriteHeartButton className="absolute right-3 top-3 z-10" />
      </div>

      <div className="px-4 pt-4">
        <p className="flex items-center gap-2 text-[13px] text-[var(--color-navy)]/50">
          <span className="text-[var(--color-navy)]/40">
            <MapPinIcon />
          </span>
          {tour.city || "Luxor"}
        </p>
        <Link
          href={href}
          className="mt-2 block min-h-[3.2rem] overflow-hidden text-[17px] font-semibold leading-snug text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        >
          {tour.title}
        </Link>

        {metadataLabel ? (
          <p className="mt-2 text-[13px] text-[var(--color-navy)]/50">{tour.category}</p>
        ) : tour.reviewCount > 0 ? (
          <div className="mt-2 flex items-center gap-2 text-sm">
            <span className="text-[var(--color-gold)]">
              <StarIcon />
            </span>
            <span className="font-medium text-[var(--color-navy)]">{tour.rating.toFixed(1)}</span>
            <span className="text-[var(--color-navy)]/50">({tour.reviewCount} reviews)</span>
          </div>
        ) : (
          <p className="mt-2 text-[13px] font-medium text-[var(--color-gold-dark)]">New experience</p>
        )}
      </div>

      <div className="mx-4 my-3 h-px bg-[rgb(6_17_31_/_8%)]" />

      {metadataLabel ? (
        <div className="flex flex-wrap items-center gap-x-3 gap-y-2 px-4 pb-4 text-[13px] text-[var(--color-navy)]/50">
          <span>{metadataLabel}</span>
          <span className="flex items-center gap-2">
            <span className="text-[var(--color-navy)]/40">
              <ClockIcon />
            </span>
            {tour.duration}
          </span>
          <span className="ml-auto border border-[rgb(183_137_43_/_45%)] px-2 py-1 text-xs font-bold text-[var(--color-gold-dark)]">
            From {priceLabel(tour)}
          </span>
        </div>
      ) : (
        <div className="flex items-end justify-between gap-3 px-4 pb-4">
          <p>
            <span className="block text-[13px] text-[var(--color-navy)]/50">From</span>
            <span className="text-lg font-bold text-[var(--color-navy)]">{priceLabel(tour)}</span>
          </p>
          <p className="flex items-center gap-2 text-[13px] text-[var(--color-navy)]/50">
            <span className="text-[var(--color-navy)]/40">
              <ClockIcon />
            </span>
            {tour.duration}
          </p>
        </div>
      )}
    </article>
  );
}
