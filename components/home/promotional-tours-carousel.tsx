"use client";

import { useMemo, useState } from "react";
import { TourListingCard } from "@/components/tours/tour-listing-card";
import type { Tour } from "@/lib/content";
import { getTourJourneyType } from "@/lib/tour-journey-type";

const INITIAL_EXPERIENCE_COUNT = 8;

type PromoExperience = {
  id: string;
  item: Tour;
  metadataLabel: string;
};

function tourJourneyLabel(tour: Tour) {
  const category = tour.category.toLowerCase();
  const journeyType = getTourJourneyType(tour);

  if (category.includes("cruise")) return "Nile Cruise";
  if (category.includes("custom") || journeyType === null) return "Custom";

  return journeyType === "multi-day" ? "Multi Day" : "One Day";
}

function toPromoExperience(item: Tour): PromoExperience {
  const isActivity = item.contentType === "ACTIVITY";

  return {
    id: `${isActivity ? "activity" : "tour"}-${item.slug}`,
    item,
    metadataLabel: isActivity ? item.category.trim() || "Activity" : tourJourneyLabel(item),
  };
}

export function PromotionalToursCarousel({
  tours,
  activities,
}: {
  tours: Tour[];
  activities: Tour[];
}) {
  const [showAll, setShowAll] = useState(false);
  const experiences = useMemo(
    () =>
      [...tours, ...activities]
        .sort((first, second) => Number(second.featured) - Number(first.featured))
        .map(toPromoExperience),
    [activities, tours],
  );
  const visibleExperiences = showAll
    ? experiences
    : experiences.slice(0, INITIAL_EXPERIENCE_COUNT);

  if (!experiences.length) return null;

  return (
    <section
      aria-labelledby="promotional-experiences-heading"
      className="order-4 bg-white py-8 text-[var(--color-navy)] sm:py-10 lg:py-12"
    >
      <div className="container-premium">
        <div className="mx-auto max-w-5xl border-t border-[rgb(183_137_43_/_35%)] pt-7 text-center sm:pt-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-navy)]/60 sm:text-xs">
            Most-loved experiences
          </p>
          <h2
            id="promotional-experiences-heading"
            className="mx-auto mt-3 max-w-4xl font-sans text-[2.45rem] font-normal leading-[0.98] tracking-[-0.05em] text-[var(--color-navy)] sm:text-[3.6rem] lg:text-[4.45rem]"
          >
            Plan now and{" "}
            <span className="relative isolate inline-block font-extrabold">
              travel deeper.
              <span
                aria-hidden="true"
                className="absolute bottom-[0.04em] left-0 -z-10 h-[0.21em] w-[38%] bg-[var(--color-navy-mid)]"
              />
              <span
                aria-hidden="true"
                className="absolute bottom-[0.04em] right-0 -z-10 h-[0.21em] w-[68%] bg-[var(--color-gold)]"
              />
            </span>
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-sm leading-7 text-[var(--color-navy)]/66 sm:text-base">
            From sunrise balloon flights and private day tours to Nile cruises and longer journeys, discover the experiences travelers love most.
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {visibleExperiences.map((experience) => (
            <TourListingCard
              key={experience.id}
              tour={experience.item}
              metadataLabel={experience.metadataLabel}
            />
          ))}
        </div>

        {!showAll && experiences.length > INITIAL_EXPERIENCE_COUNT ? (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll(true)}
              className="min-h-11 border border-[var(--color-gold-dark)] px-7 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gold-dark)] transition-colors hover:bg-[var(--color-gold)] hover:text-[var(--color-navy)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-dark)] focus-visible:ring-offset-2"
            >
              View more experiences
            </button>
          </div>
        ) : null}
      </div>
    </section>
  );
}
