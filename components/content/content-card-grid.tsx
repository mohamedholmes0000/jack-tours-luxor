import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import { formatPrice, type Tour } from "@/lib/content";

function contentHref(item: Tour, emptyLabel: string) {
  if (item.contentType === "ACTIVITY" || emptyLabel.toLowerCase() === "activity") {
    return `/activities/${item.slug}`;
  }

  if (item.contentType === "HOTEL" || emptyLabel.toLowerCase() === "hotel") {
    return `/hotels/${item.slug}`;
  }

  return `/tours/${item.slug}`;
}

export function ContentCardGrid({
  emptyLabel,
  items,
}: {
  emptyLabel: string;
  items: Tour[];
}) {
  if (!items.length) {
    const isHotel = emptyLabel.toLowerCase() === "hotel";

    return (
      <div className="container-premium py-14 sm:py-16">
        <div className="mx-auto max-w-xl rounded-xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)] px-6 py-9 text-center sm:px-10">
          <span aria-hidden="true" className="mx-auto block h-px w-12 bg-[var(--color-gold)]" />
          <p className="mt-5 font-serif text-3xl font-semibold text-[var(--color-navy)]">
            {isHotel ? "New stays are being prepared." : "New experiences are being prepared."}
          </p>
          <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-gray-600)]">
            Tell us what you need and our Luxor team will include the right options in your trip plan.
          </p>
          <Link className="btn-primary mt-6" href="/trip-planner">
            Plan your trip
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container-premium py-12">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => {
          const href = contentHref(item, emptyLabel);

          return (
          <article
            key={item.slug}
            className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_30px_rgb(6_17_31_/_8%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_42px_rgb(6_17_31_/_14%)]"
          >
            <div className="relative h-56 overflow-hidden bg-[var(--color-sand)]">
              <FavoriteHeartButton className="absolute right-3 top-3 z-10" />
              <Link href={href} className="block h-full">
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  fill
                  sizes="(min-width: 1024px) 31vw, (min-width: 768px) 46vw, 92vw"
                  className="object-cover transition duration-700 hover:scale-105"
                />
              </Link>
            </div>
            <div className="p-5">
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-navy)]/55">
                <MapPin className="h-3.5 w-3.5" />
                {item.city || "Egypt"}
              </p>
              <Link href={href}>
                <h2 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)]">
                  {item.title}
                </h2>
              </Link>
              <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-gray-600)]">
                {item.shortDescription}
              </p>
              {item.reviewCount > 0 ? (
                <div className="mt-3 flex items-center gap-2 text-sm text-[var(--color-navy)]/60">
                  <Star className="h-4 w-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                  <span className="font-semibold text-[var(--color-navy)]">{item.rating.toFixed(1)}</span>
                  <span>({item.reviewCount} reviews)</span>
                </div>
              ) : (
                <p className="mt-3 text-sm font-medium text-[var(--color-gold-dark)]">New experience</p>
              )}
              <div className="mt-5 flex items-center justify-between border-t border-[rgb(6_17_31_/_10%)] pt-4">
                <p>
                  <span className="block text-xs text-[var(--color-navy)]/50">From</span>
                  <span className="font-bold text-[var(--color-navy)]">
                    {formatPrice(item, { includePrefix: false })}
                  </span>
                </p>
                <p className="flex items-center gap-1.5 text-xs text-[var(--color-navy)]/55">
                  <Clock className="h-4 w-4" />
                  {item.duration || emptyLabel}
                </p>
              </div>
              <Link
                className="mt-5 inline-flex w-full items-center justify-center rounded-md bg-[var(--color-gold)] px-4 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
                href={href}
              >
                View {emptyLabel.toLowerCase()}
              </Link>
            </div>
          </article>
          );
        })}
      </div>
    </div>
  );
}
