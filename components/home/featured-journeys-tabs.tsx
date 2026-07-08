"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import { formatPrice, type Tour } from "@/lib/content";

type FeaturedTab = "TOUR" | "ACTIVITY" | "HOTEL";

const tabs: Array<{ label: string; value: FeaturedTab }> = [
  { label: "Tour", value: "TOUR" },
  { label: "Activity", value: "ACTIVITY" },
  { label: "Hotels", value: "HOTEL" },
];

function StarIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
      <path d="m10 1.7 2.4 5 5.5.8-4 3.9.9 5.5-4.8-2.6-4.9 2.6.9-5.5-4-3.9 5.5-.8L10 1.7Z" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 6.2v4.2l2.8 1.8" stroke="currentColor" strokeLinecap="round" strokeWidth="1.5" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" className="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none">
      <path d="M10 18s5.5-5.2 5.5-10A5.5 5.5 0 0 0 4.5 8c0 4.8 5.5 10 5.5 10Z" stroke="currentColor" strokeWidth="1.5" />
      <circle cx="10" cy="8" r="1.8" stroke="currentColor" strokeWidth="1.5" />
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
    <article className="group flex h-full max-w-[350px] snap-start flex-col overflow-hidden rounded-xl bg-white text-left shadow-[0_8px_26px_rgb(6_17_31_/_8%)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_34px_rgb(6_17_31_/_13%)]">
      <div className="relative h-[190px] overflow-hidden bg-[var(--color-sand)] sm:h-[205px] lg:h-[220px]">
        <Link href={href} className="block h-full">
          <Image
            src={item.heroImage}
            alt={item.title}
            fill
            sizes="(min-width: 1024px) 350px, (min-width: 640px) 45vw, 84vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        </Link>
        <FavoriteHeartButton className="absolute right-3 top-3 z-10" />
      </div>
      <div className="flex flex-1 flex-col px-4 py-4">
        <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-navy)]/50">
          <MapPinIcon />
          {item.city || "Egypt"}
        </p>
        <Link href={href}>
          <h3 className="mt-2 line-clamp-2 font-sans text-[1rem] font-bold leading-snug text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)]">
            {item.title}
          </h3>
        </Link>
        <div className="mt-2 flex items-center gap-2 text-[13px]">
          <span className="text-[var(--color-gold)]">
            <StarIcon />
          </span>
          <span className="font-medium text-[var(--color-navy)]">
            {item.reviewCount > 0 ? item.rating.toFixed(1) : "0"}
          </span>
          <span className="text-[var(--color-navy)]/50">
            ({item.reviewCount > 0 ? `${item.reviewCount} reviews` : "No Review"})
          </span>
        </div>
      </div>
      <div className="mx-4 h-px bg-[rgb(6_17_31_/_8%)]" />
      <div className="flex items-end justify-between gap-3 px-4 py-4">
        <p>
          <span className="block text-[12px] text-[var(--color-navy)]/50">From</span>
          <span className="text-[16px] font-bold text-[var(--color-navy)]">{formatPrice(item)}</span>
        </p>
        <p className="flex items-center gap-1.5 text-[12px] text-[var(--color-navy)]/50">
          <ClockIcon />
          {item.duration}
        </p>
      </div>
    </article>
  );
}

function EmptyState() {
  return (
    <div className="mx-auto mt-7 max-w-xl rounded-2xl border border-[rgb(214_173_84_/_24%)] bg-white p-8 text-center shadow-[0_10px_28px_rgb(6_17_31_/_6%)]">
      <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
        More options coming soon — contact us to customize your trip.
      </p>
      <Link className="btn-primary mt-5" href="/trip-planner">
        Plan your journey
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
    if (activeTab === "ACTIVITY") {
      return { href: "/activities", label: "View all activities" };
    }

    if (activeTab === "HOTEL") {
      return { href: "/hotels", label: "View all hotels" };
    }

    return { href: defaultViewAllHref, label: defaultViewAllLabel };
  }, [activeTab, defaultViewAllHref, defaultViewAllLabel]);

  return (
    <>
      <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
        {tabs.map((tab) => {
          const active = tab.value === activeTab;

          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={active}
              onClick={() => setActiveTab(tab.value)}
              className={`rounded-md px-4 py-2 font-sans text-[0.72rem] font-semibold uppercase tracking-[0.06em] transition ${
                active
                  ? "bg-[var(--color-navy)] text-white"
                  : "border border-[rgb(6_17_31_/_14%)] bg-white text-[var(--color-navy)] hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div className="mt-4 text-center">
        <Link
          className="inline-flex font-sans text-[0.72rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-dark)] transition hover:text-[var(--color-navy)]"
          href={viewAllLink.href}
        >
          {viewAllLink.label}
        </Link>
      </div>

      {activeItems.length ? (
        <div className="no-scrollbar -mx-5 mt-7 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 sm:mx-0 sm:mt-9 sm:grid sm:grid-cols-2 sm:gap-5 sm:overflow-visible sm:px-0 lg:mx-auto lg:max-w-[1110px] lg:grid-cols-3 lg:gap-6">
          {activeItems.map((item) => (
            <div key={`${activeTab}-${item.slug}`} className="min-w-[82vw] snap-start sm:min-w-0">
              <FeaturedCard item={item} />
            </div>
          ))}
        </div>
      ) : (
        <EmptyState />
      )}
    </>
  );
}
