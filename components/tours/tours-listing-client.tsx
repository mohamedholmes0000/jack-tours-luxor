"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { FavoriteHeartButton } from "@/components/tours/favorite-heart-button";
import type { Tour } from "@/lib/content";

type SortOption = "recommended" | "price-asc" | "price-desc" | "newest";
type DurationFilter = "half-day" | "full-day" | "multi-day";

type ToursListingClientProps = {
  tours: Tour[];
  initialCategory?: string;
};

const categoryFilters = [
  { label: "Day Tours", values: ["Day Tours"] },
  { label: "Nile Cruises", values: ["Nile Cruises"] },
  { label: "Multi-Day Tours", values: ["Multi-Day Packages", "Multi-Day Tours"] },
  { label: "Luxury Tours", values: ["Luxury Tours"] },
  { label: "Custom Tours", values: ["Custom Egypt Tours", "Custom Tours"] },
];

const durationFilters: Array<{ id: DurationFilter; label: string }> = [
  { id: "half-day", label: "Half Day (< 5 hours)" },
  { id: "full-day", label: "Full Day (5-8 hours)" },
  { id: "multi-day", label: "Multi-Day (2+ days)" },
];

const destinationFilters = ["Luxor", "Aswan", "Cairo", "Hurghada", "Abu Simbel", "Red Sea"];

function ChevronIcon({ collapsed }: { collapsed: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className={`size-4 transition duration-200 ${collapsed ? "rotate-180" : ""}`}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path d="m6 15 6-6 6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function SlidersIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h10M18 7h2M4 17h2M10 17h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M14 7a2 2 0 1 0 4 0 2 2 0 0 0-4 0ZM6 17a2 2 0 1 0 4 0 2 2 0 0 0-4 0Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

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

function GridIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M4 4h6v6H4V4Zm10 0h6v6h-6V4ZM4 14h6v6H4v-6Zm10 0h6v6h-6v-6Z" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function ListIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

function priceLabel(tour: Tour) {
  if (!tour.priceFrom) {
    return "Custom quote";
  }

  const symbol = tour.priceCurrency === "USD" ? "$" : `${tour.priceCurrency} `;
  return `${symbol}${tour.priceFrom.toLocaleString("en-US")}`;
}

function durationBucket(duration: string): DurationFilter {
  const lower = duration.toLowerCase();
  const dayMatch = lower.match(/(\d+)\s*(day|days)/);
  const hourMatch = lower.match(/(\d+)\s*(hour|hours|hr|hrs)/);

  if (dayMatch && Number(dayMatch[1]) >= 2) {
    return "multi-day";
  }

  if (lower.includes("custom") || lower.includes("multi")) {
    return "multi-day";
  }

  if (hourMatch && Number(hourMatch[1]) < 5) {
    return "half-day";
  }

  return "full-day";
}

function normalizeCategoryFilter(category?: string) {
  if (!category) {
    return [];
  }

  const matchingFilter = categoryFilters.find(
    (filter) => filter.label === category || filter.values.includes(category),
  );

  return matchingFilter ? [matchingFilter.label] : [];
}

function ToggleCheckbox({
  checked,
  label,
  onChange,
}: {
  checked: boolean;
  label: string;
  onChange: () => void;
}) {
  return (
    <label className="flex cursor-pointer items-center gap-3 py-2 text-sm text-[var(--color-navy)]/70">
      <span
        className={`grid size-4 place-items-center rounded-[3px] border transition ${
          checked
            ? "border-[var(--color-gold)] bg-[var(--color-gold)]"
            : "border-[rgb(6_17_31_/_45%)] bg-transparent"
        }`}
        aria-hidden="true"
      >
        {checked ? (
          <svg className="size-3 text-white" viewBox="0 0 24 24" fill="none">
            <path d="m5 12 4 4L19 6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        ) : null}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <span>{label}</span>
    </label>
  );
}

function FilterGroup({
  title,
  defaultOpen = false,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-[rgb(6_17_31_/_8%)] py-4 last:border-b-0">
      <button
        type="button"
        className="flex w-full items-center justify-between text-left text-base font-semibold text-[var(--color-navy)]"
        onClick={() => setOpen((current) => !current)}
      >
        {title}
        <ChevronIcon collapsed={!open} />
      </button>
      <div
        className={`grid transition-[grid-template-rows] duration-200 ${
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        }`}
      >
        <div className="overflow-hidden">
          <div className="pt-3">{children}</div>
        </div>
      </div>
    </div>
  );
}

function TourCard({ tour }: { tour: Tour }) {
  return (
    <article className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_10%)]">
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/10]">
        <Link href={`/tours/${tour.slug}`} className="absolute inset-0">
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
          href={`/tours/${tour.slug}`}
          className="mt-2 block min-h-[3.2rem] overflow-hidden text-[17px] font-semibold leading-snug text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]"
        >
          {tour.title}
        </Link>

        {tour.reviewCount > 0 ? (
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
    </article>
  );
}

export function ToursListingClient({ tours, initialCategory }: ToursListingClientProps) {
  const basePriceValues = tours.map((tour) => tour.priceFrom).filter((price) => price > 0);
  const baseMinPrice = Math.floor(Math.min(...basePriceValues, 0));
  const baseMaxPrice = Math.ceil(Math.max(...basePriceValues, 0));
  const [selectedCategories, setSelectedCategories] = useState<string[]>(
    normalizeCategoryFilter(initialCategory),
  );
  const [selectedDurations, setSelectedDurations] = useState<DurationFilter[]>([]);
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>([]);
  const [minPrice, setMinPrice] = useState(baseMinPrice);
  const [maxPrice, setMaxPrice] = useState(baseMaxPrice);
  const [sort, setSort] = useState<SortOption>("recommended");
  const [filtersOpen, setFiltersOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = filtersOpen ? "hidden" : "";
    document.documentElement.style.overflow = filtersOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [filtersOpen]);

  function clearFilters() {
    setSelectedCategories([]);
    setSelectedDurations([]);
    setSelectedDestinations([]);
    setMinPrice(baseMinPrice);
    setMaxPrice(baseMaxPrice);
  }

  function toggleValue<T extends string>(value: T, values: T[], setter: (values: T[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  const filteredTours = useMemo(() => {
    const selectedCategoryValues = selectedCategories.flatMap((category) => {
      const filter = categoryFilters.find((item) => item.label === category);
      return filter?.values ?? [category];
    });

    return tours
      .map((tour, index) => ({ tour, index }))
      .filter(({ tour }) => {
        const price = tour.priceFrom || 0;
        const matchesCategory =
          !selectedCategoryValues.length || selectedCategoryValues.includes(tour.category);
        const matchesPrice = !price || (price >= minPrice && price <= maxPrice);
        const matchesDuration =
          !selectedDurations.length || selectedDurations.includes(durationBucket(tour.duration));
        const matchesDestination =
          !selectedDestinations.length || selectedDestinations.includes(tour.city || "Luxor");

        return matchesCategory && matchesPrice && matchesDuration && matchesDestination;
      })
      .sort((a, b) => {
        if (sort === "price-asc") {
          return (a.tour.priceFrom || Number.POSITIVE_INFINITY) - (b.tour.priceFrom || Number.POSITIVE_INFINITY);
        }

        if (sort === "price-desc") {
          return (b.tour.priceFrom || 0) - (a.tour.priceFrom || 0);
        }

        if (sort === "newest") {
          return a.index - b.index;
        }

        return a.index - b.index;
      })
      .map(({ tour }) => tour);
  }, [maxPrice, minPrice, selectedCategories, selectedDestinations, selectedDurations, sort, tours]);

  const filters = (
    <>
      <FilterGroup title="Category" defaultOpen>
        {categoryFilters.map((category) => (
          <ToggleCheckbox
            key={category.label}
            label={category.label}
            checked={selectedCategories.includes(category.label)}
            onChange={() => toggleValue(category.label, selectedCategories, setSelectedCategories)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Price Range" defaultOpen>
        <div className="space-y-4">
          <div className="grid gap-2">
            <input
              type="range"
              min={baseMinPrice}
              max={baseMaxPrice}
              value={minPrice}
              onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice))}
              className="accent-[var(--color-gold)]"
            />
            <input
              type="range"
              min={baseMinPrice}
              max={baseMaxPrice}
              value={maxPrice}
              onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice))}
              className="accent-[var(--color-gold)]"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <input
              type="number"
              className="h-10 rounded-md border border-[rgb(6_17_31_/_14%)] px-3 text-sm text-[var(--color-navy)]"
              value={minPrice}
              min={baseMinPrice}
              max={maxPrice}
              onChange={(event) => setMinPrice(Math.min(Number(event.target.value), maxPrice))}
            />
            <input
              type="number"
              className="h-10 rounded-md border border-[rgb(6_17_31_/_14%)] px-3 text-sm text-[var(--color-navy)]"
              value={maxPrice}
              min={minPrice}
              max={baseMaxPrice}
              onChange={(event) => setMaxPrice(Math.max(Number(event.target.value), minPrice))}
            />
          </div>
          <div className="flex items-center justify-between">
            <button type="button" className="text-[13px] text-[var(--color-gray-600)]" onClick={clearFilters}>
              Clear
            </button>
            <button type="button" className="rounded-md bg-[var(--color-gold)] px-4 py-2 text-[13px] font-semibold text-[var(--color-navy)]">
              Apply
            </button>
          </div>
        </div>
      </FilterGroup>

      <FilterGroup title="Duration">
        {durationFilters.map((duration) => (
          <ToggleCheckbox
            key={duration.id}
            label={duration.label}
            checked={selectedDurations.includes(duration.id)}
            onChange={() => toggleValue(duration.id, selectedDurations, setSelectedDurations)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Destination">
        {destinationFilters.map((destination) => (
          <ToggleCheckbox
            key={destination}
            label={destination}
            checked={selectedDestinations.includes(destination)}
            onChange={() => toggleValue(destination, selectedDestinations, setSelectedDestinations)}
          />
        ))}
      </FilterGroup>
    </>
  );

  return (
    <section className="bg-[#faf8f5] py-8 md:py-14">
      <div className="mx-auto grid max-w-[1280px] gap-8 px-5 lg:grid-cols-[280px_1fr]">
        <aside className="hidden lg:block">
          <div className="sticky top-[120px] rounded-xl bg-white p-6 shadow-[0_1px_6px_rgb(0_0_0_/_6%)]">
            {filters}
            <button type="button" className="mt-4 text-[13px] text-[var(--color-gray-600)]" onClick={clearFilters}>
              Clear all filters
            </button>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-between gap-3 lg:hidden">
            <button
              type="button"
              className="inline-flex min-h-10 items-center gap-2 rounded-full border border-[rgb(6_17_31_/_20%)] px-4 text-[13px] font-medium text-[var(--color-navy)]"
              onClick={() => setFiltersOpen(true)}
            >
              <SlidersIcon />
              Filters
            </button>
            <select
              className="h-10 rounded-md border border-[rgb(6_17_31_/_14%)] bg-white px-3 text-[13px] text-[var(--color-navy)]"
              value={sort}
              onChange={(event) => setSort(event.target.value as SortOption)}
              aria-label="Sort tours"
            >
              <option value="recommended">Recommended</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="newest">Newest</option>
            </select>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white px-4 py-3 shadow-[0_1px_6px_rgb(0_0_0_/_5%)] md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--color-navy)]/50">
              {filteredTours.length} {filteredTours.length === 1 ? "tour" : "tours"} found
            </p>
            <div className="hidden items-center gap-3 lg:flex">
              <select
                className="h-10 rounded-md border border-[rgb(6_17_31_/_14%)] bg-white px-3 text-sm text-[var(--color-navy)]"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                aria-label="Sort tours"
              >
                <option value="recommended">Recommended</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="newest">Newest</option>
              </select>
              <div className="flex overflow-hidden rounded-md border border-[rgb(6_17_31_/_12%)] text-[var(--color-navy)]/50">
                <button type="button" className="grid size-10 place-items-center bg-[var(--color-gold)] text-[var(--color-navy)]" aria-label="Grid view">
                  <GridIcon />
                </button>
                <button type="button" className="grid size-10 place-items-center cursor-not-allowed opacity-45" aria-label="List view disabled" disabled>
                  <ListIcon />
                </button>
              </div>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredTours.map((tour) => (
              <TourCard key={tour.slug} tour={tour} />
            ))}
          </div>

          {!filteredTours.length ? (
            <div className="rounded-xl bg-white p-8 text-center text-sm text-[var(--color-gray-600)] shadow-[0_1px_6px_rgb(0_0_0_/_6%)]">
              No tours match those filters. Try clearing one filter.
            </div>
          ) : null}
        </div>
      </div>

      {filtersOpen ? (
        <div className="fixed inset-0 z-[90] bg-[var(--color-navy)]/55 lg:hidden" onClick={() => setFiltersOpen(false)}>
          <div
            className="absolute inset-x-0 bottom-0 max-h-[92svh] overflow-y-auto rounded-t-2xl bg-[rgb(6_17_31_/_95%)] p-5 text-white shadow-[0_-18px_50px_rgb(0_0_0_/_30%)] [animation:tour-filter-sheet_300ms_ease]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-4 flex items-center justify-between">
              <p className="text-base font-semibold uppercase tracking-[0.08em]">Filters</p>
              <button type="button" className="grid size-10 place-items-center text-white" onClick={() => setFiltersOpen(false)}>
                <span className="sr-only">Close filters</span>
                <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
                  <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>
            <div className="tour-filter-sheet-content">
              {filters}
            </div>
            <div className="sticky bottom-0 mt-5 flex gap-3 bg-[rgb(6_17_31_/_95%)] pt-4">
              <button
                type="button"
                className="min-h-11 flex-1 rounded-md border border-white/20 px-4 text-sm font-semibold text-white"
                onClick={clearFilters}
              >
                Clear
              </button>
              <button
                type="button"
                className="min-h-11 flex-1 rounded-md bg-[var(--color-gold)] px-4 text-sm font-semibold text-[var(--color-navy)]"
                onClick={() => setFiltersOpen(false)}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
