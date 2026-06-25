import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import { formatPrice, type Tour } from "@/lib/content";

export function ContentCardGrid({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items: Tour[];
}) {
  if (!items.length) {
    return (
      <div className="container-premium py-16 text-center">
        <p className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
          More options coming soon
        </p>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-[var(--color-gray-600)]">
          Contact Jack Egypt Tour and we will customize a private plan around your dates, route, and travel style.
        </p>
        <Link className="btn-primary mt-6" href="/trip-planner">
          Plan your journey
        </Link>
      </div>
    );
  }

  return (
    <div className="container-premium py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <article
            key={item.slug}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgb(6_17_31_/_8%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgb(6_17_31_/_14%)]"
          >
            <div className="relative h-56 overflow-hidden bg-[var(--color-sand)]">
              <FavoriteHeartButton className="absolute right-3 top-3 z-10" />
              <Image
                src={item.heroImage}
                alt={item.title}
                fill
                sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
                className="object-cover transition duration-700 hover:scale-105"
              />
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-navy)]/55">
                <MapPin className="h-3.5 w-3.5" />
                {item.city || "Egypt"}
              </p>
              <h2 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">
                {item.title}
              </h2>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-gray-600)]">
                {item.shortDescription}
              </p>
              <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-navy)]/60">
                <Star className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                <span className="font-semibold text-[var(--color-navy)]">
                  {item.reviewCount > 0 ? item.rating.toFixed(1) : "0"}
                </span>
                <span>({item.reviewCount > 0 ? `${item.reviewCount} reviews` : "No Review"})</span>
              </div>
              <div className="mt-5 flex items-center justify-between border-t border-[rgb(6_17_31_/_10%)] pt-4">
                <p>
                  <span className="block text-xs text-[var(--color-navy)]/50">From</span>
                  <span className="font-bold text-[var(--color-navy)]">{formatPrice(item)}</span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--color-navy)]/55">
                  <Clock className="h-4 w-4" />
                  {item.duration || emptyLabel}
                </p>
              </div>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-gold)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
                href={`/trip-planner?interest=${encodeURIComponent(item.slug)}`}
              >
                Plan this {emptyLabel.toLowerCase()}
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
