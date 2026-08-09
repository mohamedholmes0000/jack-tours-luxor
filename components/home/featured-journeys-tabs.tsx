"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import { formatPrice, type Tour } from "@/lib/content";

type FeaturedTab = "TOUR" | "ACTIVITY" | "HOTEL";

const tabs: Array<{ label: string; value: FeaturedTab }> = [
  { label: "Tours", value: "TOUR" },
  { label: "Activities", value: "ACTIVITY" },
  { label: "Hotels", value: "HOTEL" },
];

function StarIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path d="m10 1.7 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L10 1.7Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.2v4.2l2.8 1.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" className="size-3.5" viewBox="0 0 20 20" fill="none">
      <path d="M10 18s5.5-5.2 5.5-10A5.5 5.5 0 0 0 4.5 8c0 4.8 5.5 10 5.5 10Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h13M14 6l5 6-5 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function FeaturedCard({ item }: { item: Tour }) {
  const href =
    item.contentType === "ACTIVITY"
      ? `/activities/${item.slug}`
      : item.contentType === "HOTEL"
        ? `/hotels/${item.slug}`
        : `/tours/${item.slug}`;

  return (
    <article className="group flex h-full overflow-hidden rounded-[0.9rem] border border-[rgb(6_17_31_/_9%)] bg-white text-left shadow-[0_8px_22px_rgb(6_17_31_/_7%)] transition duration-500 hover:-translate-y-1 hover:border-[rgb(214_173_84_/_40%)] hover:shadow-[0_16px_30px_rgb(6_17_31_/_11%)]">
      <div className="flex min-h-full w-full flex-col">
        <div className="relative aspect-[16/9] overflow-hidden bg-[var(--color-sand)]">
          <Link href={href} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold)]">
            <Image
              src={item.heroImage}
              alt={item.title}
              fill
              sizes="(min-width: 1024px) 340px, (min-width: 640px) 48vw, 82vw"
              className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
            />
          </Link>
          <FavoriteHeartButton className="absolute right-2.5 top-2.5 z-10" />
        </div>

        <div className="flex h-[13.5rem] flex-1 flex-col px-4 pb-4 pt-3.5">
          <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-dark)]">
            <MapPinIcon />
            {item.city || "Egypt"}
          </p>
          <Link href={href} className="mt-2.5 outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]">
            <h3 className="line-clamp-2 min-h-[2.4rem] font-sans text-[1rem] font-bold leading-[1.25] text-[var(--color-navy)] transition group-hover:text-[var(--color-gold-dark)]">
              {item.title}
            </h3>
          </Link>

          <div className="mt-2.5 min-h-5">
            {item.reviewCount > 0 ? (
              <div className="flex items-center gap-2 text-[0.68rem]">
              <span className="flex items-center gap-1 text-[var(--color-gold-dark)]">
                <StarIcon />
                <span className="font-semibold text-[var(--color-navy)]">{item.rating.toFixed(1)}</span>
              </span>
              <span className="text-[var(--color-navy)]/52">{item.reviewCount} reviews</span>
              </div>
            ) : null}
          </div>

          <div className="mt-auto flex min-h-[2.25rem] items-end justify-between gap-4 border-t border-[rgb(6_17_31_/_9%)] pt-3">
            <p>
              <span className="block text-[0.6rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-navy)]/48">From</span>
              <span className="mt-0.5 block whitespace-nowrap font-sans text-[0.96rem] font-bold text-[var(--color-navy)]">
                {formatPrice(item, { includePrefix: false })}
              </span>
            </p>
            <p className="flex min-w-0 max-w-[46%] items-center gap-1.5 truncate pb-0.5 text-right text-[0.67rem] font-medium text-[var(--color-navy)]/58">
              <ClockIcon />
              {item.duration}
            </p>
          </div>

          <Link
            href={href}
            className="mt-2.5 inline-flex min-h-11 items-center gap-2 self-start text-[0.64rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
          >
            Explore journey
            <ArrowIcon />
          </Link>
        </div>
      </div>
    </article>
  );
}

function EmptyState({ type }: { type: FeaturedTab }) {
  const isHotel = type === "HOTEL";

  return (
    <div className="mx-auto mt-8 max-w-xl rounded-[1rem] border border-[rgb(214_173_84_/_24%)] bg-white/75 p-7 text-center sm:p-8">
      <span aria-hidden="true" className="mx-auto block h-px w-12 bg-[var(--color-gold)]" />
      <p className="mt-5 font-serif text-2xl font-semibold text-[var(--color-navy)]">
        {isHotel ? "New stays are being prepared." : "New experiences are being prepared."}
      </p>
      <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[var(--color-gray-600)]">
        Tell us what you need and our Luxor team will include the right options in your trip plan.
      </p>
      <Link className="btn-primary mt-5" href="/trip-planner">
        Plan your trip
      </Link>
    </div>
  );
}

export function FeaturedJourneysTabs({
  activities,
  defaultViewAllHref = "/tours",
  defaultViewAllLabel = "View all tours",
  hotels,
  tours,
}: {
  activities: Tour[];
  defaultViewAllHref?: string;
  defaultViewAllLabel?: string;
  hotels: Tour[];
  tours: Tour[];
}) {
  const [activeTab, setActiveTab] = useState<FeaturedTab>("TOUR");
  const activeItems = useMemo(() => {
    if (activeTab === "ACTIVITY") return activities;
    if (activeTab === "HOTEL") return hotels;
    return tours;
  }, [activeTab, activities, hotels, tours]);
  const viewAllLink = useMemo(() => {
    if (activeTab === "ACTIVITY") return { href: "/activities", label: "View all activities" };
    if (activeTab === "HOTEL") return { href: "/hotels", label: "View all hotels" };
    return { href: defaultViewAllHref, label: defaultViewAllLabel };
  }, [activeTab, defaultViewAllHref, defaultViewAllLabel]);

  return (
    <>
      <div className="mt-7 flex flex-col gap-4 border-y border-[rgb(6_17_31_/_10%)] py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2" aria-label="Featured content type">
          {tabs.map((tab) => {
            const active = tab.value === activeTab;

            return (
              <button
                key={tab.value}
                type="button"
                aria-pressed={active}
                onClick={() => setActiveTab(tab.value)}
                className={`min-h-11 rounded-full px-4 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.08em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] ${
                  active
                    ? "bg-[var(--color-navy)] text-white shadow-[0_8px_18px_rgb(6_17_31_/_16%)]"
                    : "border border-[rgb(6_17_31_/_14%)] bg-white text-[var(--color-navy)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
        <Link
          className="inline-flex min-h-11 items-center gap-2 self-start font-sans text-[0.7rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] sm:self-auto"
          href={viewAllLink.href}
        >
          {viewAllLink.label}
          <ArrowIcon />
        </Link>
      </div>

      {activeItems.length ? (
        <div className="no-scrollbar -mx-5 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mx-auto lg:max-w-[1120px] lg:grid-cols-3 lg:gap-6">
          {activeItems.map((item) => (
            <div key={`${activeTab}-${item.slug}`} className="min-w-[82vw] snap-start sm:min-w-0 lg:max-w-[340px] lg:justify-self-center">
              <FeaturedCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState type={activeTab} />
      )}
    </>
  );
}
