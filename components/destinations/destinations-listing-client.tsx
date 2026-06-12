"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import type { DestinationListingItem } from "@/lib/data/public";

type SortOption = "az" | "za" | "most-tours" | "newest";
type TourAvailabilityFilter = "has-tours" | "coming-soon";

type DestinationsListingClientProps = {
  destinations: DestinationListingItem[];
};

const regionFilters = [
  { label: "Upper Egypt", values: ["Upper Egypt"] },
  { label: "Lower Egypt", values: ["Lower Egypt"] },
  { label: "Red Sea Coast", values: ["Red Sea Coast"] },
];

const availabilityFilters: Array<{ id: TourAvailabilityFilter; label: string }> = [
  { id: "has-tours", label: "Has tours" },
  { id: "coming-soon", label: "Coming soon" },
];

const typeFilters = ["City", "Archaeological Site", "Coastal / Beach", "River / Cruise Route"];

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

function HeartIcon() {
  return (
    <svg aria-hidden="true" className="size-[18px]" viewBox="0 0 24 24" fill="none">
      <path
        d="M20.8 4.6a5.4 5.4 0 0 0-7.6 0L12 5.8l-1.2-1.2a5.4 5.4 0 1 0-7.6 7.6L12 21l8.8-8.8a5.4 5.4 0 0 0 0-7.6Z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function ArrowIcon() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M5 12h14m-6-6 6 6-6 6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
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

function DestinationCard({ destination }: { destination: DestinationListingItem }) {
  const hasTours = destination.tourCount > 0;

  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_10%)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/10]">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 text-[var(--color-gray-600)] transition group-hover:text-[var(--color-gold)]">
          <HeartIcon />
        </span>
      </div>

      <div className="px-4 pt-4">
        <p className="flex items-center gap-2 text-[13px] text-[var(--color-navy)]/50">
          <span className="text-[var(--color-navy)]/40">
            <MapPinIcon />
          </span>
          {destination.region}
        </p>
        <p className="mt-2 text-xl font-semibold leading-snug text-[var(--color-navy)]">
          {destination.name}
        </p>
        <p className="mt-1 min-h-[2.6rem] overflow-hidden text-sm leading-6 text-[var(--color-navy)]/50 [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {destination.overview}
        </p>
      </div>

      <div className="mx-4 my-3 h-px bg-[rgb(6_17_31_/_8%)]" />

      <div className="flex items-center justify-between gap-3 px-4 pb-4">
        <p
          className={`text-sm ${
            hasTours
              ? "font-medium text-[var(--color-gold)]"
              : "font-normal text-[var(--color-navy)]/30"
          }`}
        >
          {hasTours
            ? `${destination.tourCount} ${destination.tourCount === 1 ? "Tour" : "Tours"} available`
            : "Coming soon"}
        </p>
        {hasTours ? (
          <span className="text-[var(--color-gold)] transition group-hover:translate-x-1">
            <ArrowIcon />
          </span>
        ) : null}
      </div>
    </Link>
  );
}

export function DestinationsListingClient({ destinations }: DestinationsListingClientProps) {
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [selectedAvailability, setSelectedAvailability] = useState<TourAvailabilityFilter[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sort, setSort] = useState<SortOption>("newest");
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
    setSelectedRegions([]);
    setSelectedAvailability([]);
    setSelectedTypes([]);
  }

  function toggleValue<T extends string>(value: T, values: T[], setter: (values: T[]) => void) {
    setter(values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);
  }

  const filteredDestinations = useMemo(() => {
    const selectedRegionValues = selectedRegions.flatMap((region) => {
      const filter = regionFilters.find((item) => item.label === region);
      return filter?.values ?? [region];
    });

    return destinations
      .map((destination, index) => ({ destination, index }))
      .filter(({ destination }) => {
        const matchesRegion =
          !selectedRegionValues.length || selectedRegionValues.includes(destination.region);
        const matchesAvailability =
          !selectedAvailability.length ||
          (selectedAvailability.includes("has-tours") && destination.tourCount > 0) ||
          (selectedAvailability.includes("coming-soon") && destination.tourCount === 0);
        const matchesType = !selectedTypes.length || selectedTypes.includes(destination.type);

        return matchesRegion && matchesAvailability && matchesType;
      })
      .sort((a, b) => {
        if (sort === "az") {
          return a.destination.name.localeCompare(b.destination.name);
        }

        if (sort === "za") {
          return b.destination.name.localeCompare(a.destination.name);
        }

        if (sort === "most-tours") {
          return b.destination.tourCount - a.destination.tourCount;
        }

        return a.index - b.index;
      })
      .map(({ destination }) => destination);
  }, [destinations, selectedAvailability, selectedRegions, selectedTypes, sort]);

  const filters = (
    <>
      <FilterGroup title="Region" defaultOpen>
        {regionFilters.map((region) => (
          <ToggleCheckbox
            key={region.label}
            label={region.label}
            checked={selectedRegions.includes(region.label)}
            onChange={() => toggleValue(region.label, selectedRegions, setSelectedRegions)}
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Tours Available" defaultOpen>
        {availabilityFilters.map((availability) => (
          <ToggleCheckbox
            key={availability.id}
            label={availability.label}
            checked={selectedAvailability.includes(availability.id)}
            onChange={() =>
              toggleValue(availability.id, selectedAvailability, setSelectedAvailability)
            }
          />
        ))}
      </FilterGroup>

      <FilterGroup title="Type">
        {typeFilters.map((type) => (
          <ToggleCheckbox
            key={type}
            label={type}
            checked={selectedTypes.includes(type)}
            onChange={() => toggleValue(type, selectedTypes, setSelectedTypes)}
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
              aria-label="Sort destinations"
            >
              <option value="newest">Newest</option>
              <option value="az">A-Z</option>
              <option value="za">Z-A</option>
              <option value="most-tours">Most Tours</option>
            </select>
          </div>

          <div className="mb-6 flex flex-col gap-4 rounded-xl bg-white px-4 py-3 shadow-[0_1px_6px_rgb(0_0_0_/_5%)] md:flex-row md:items-center md:justify-between">
            <p className="text-sm text-[var(--color-navy)]/50">
              {filteredDestinations.length} {filteredDestinations.length === 1 ? "destination" : "destinations"} found
            </p>
            <div className="hidden items-center gap-3 lg:flex">
              <select
                className="h-10 rounded-md border border-[rgb(6_17_31_/_14%)] bg-white px-3 text-sm text-[var(--color-navy)]"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                aria-label="Sort destinations"
              >
                <option value="newest">Newest</option>
                <option value="az">A-Z</option>
                <option value="za">Z-A</option>
                <option value="most-tours">Most Tours</option>
              </select>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {filteredDestinations.map((destination) => (
              <DestinationCard key={destination.slug} destination={destination} />
            ))}
          </div>

          {!filteredDestinations.length ? (
            <div className="rounded-xl bg-white p-8 text-center text-sm text-[var(--color-gray-600)] shadow-[0_1px_6px_rgb(0_0_0_/_6%)]">
              No destinations match those filters. Try clearing one filter.
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
            <div className="tour-filter-sheet-content">{filters}</div>
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
