"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Clock3, Star } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import type { Tour } from "@/lib/content";

type PromoJourney = {
  id: string;
  title: string;
  category: string;
  duration: string;
  image: string;
  href: string;
  ribbon: string;
  price: string;
  rating?: number;
  reviewCount?: number;
  planningPreview?: boolean;
};

const referenceJourneyPreviews: PromoJourney[] = [
  {
    id: "preview-cairo-old-city-and-citadel",
    title: "Cairo Old City and Citadel",
    category: "One-Day Tour",
    duration: "8 Hours",
    image: "/photos/alexandria.jpg",
    href: "/trip-planner?journey=cairo-old-city-and-citadel",
    ribbon: "Cairo day tour",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-dahshour-sakkara-and-memphis",
    title: "Dahshour, Sakkara and Memphis",
    category: "One-Day Tour",
    duration: "8 Hours",
    image: "/photos/pyramids.jpg",
    href: "/trip-planner?journey=dahshour-sakkara-and-memphis",
    ribbon: "Ancient Cairo",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-museum-pyramids-and-khan-al-khalili",
    title: "Museum, Pyramids and Khan Al Khalili",
    category: "One-Day Tour",
    duration: "8 Hours",
    image: "/photos/pyramids.jpg",
    href: "/trip-planner?journey=museum-pyramids-and-khan-al-khalili",
    ribbon: "Cairo highlights",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-alexandria-explorer",
    title: "Alexandria Explorer",
    category: "One-Day Tour",
    duration: "1 Day",
    image: "/photos/alexandria.jpg",
    href: "/trip-planner?journey=alexandria-explorer",
    ribbon: "Mediterranean day",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-nile-dream-by-felucca",
    title: "Nile Dream by Felucca",
    category: "Multi-Day Tour",
    duration: "9 Days",
    image: "/photos/felucca.jpg",
    href: "/trip-planner?journey=nile-dream-by-felucca",
    ribbon: "Felucca journey",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-aswan-luxor-nile-cruise",
    title: "Aswan-Luxor Nile Cruise",
    category: "Multi-Day Tour",
    duration: "4 Days",
    image: "/photos/aswan.jpg",
    href: "/trip-planner?journey=aswan-luxor-nile-cruise",
    ribbon: "Nile cruise",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-luxor-aswan-nile-cruise",
    title: "Luxor-Aswan Nile Cruise",
    category: "Multi-Day Tour",
    duration: "5 Days",
    image: "/photos/nile.jpg",
    href: "/trip-planner?journey=luxor-aswan-nile-cruise",
    ribbon: "Nile cruise",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-best-of-egypt",
    title: "Best of Egypt",
    category: "Multi-Day Tour",
    duration: "6 Days",
    image: "/photos/abu-simbel.jpg",
    href: "/trip-planner?journey=best-of-egypt",
    ribbon: "Egypt highlights",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-nile-pearl",
    title: "Nile Pearl",
    category: "Multi-Day Tour",
    duration: "8 Days",
    image: "/photos/hatshepsut.jpg",
    href: "/trip-planner?journey=nile-pearl",
    ribbon: "Private journey",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-nile-dream",
    title: "Nile Dream",
    category: "Multi-Day Tour",
    duration: "9 Days",
    image: "/photos/felucca.jpg",
    href: "/trip-planner?journey=nile-dream",
    ribbon: "Along the Nile",
    price: "Request a quote",
    planningPreview: true,
  },
  {
    id: "preview-see-and-sea",
    title: "See and Sea",
    category: "Multi-Day Tour",
    duration: "11 Days",
    image: "/photos/red-sea.jpg",
    href: "/trip-planner?journey=see-and-sea",
    ribbon: "Culture & coast",
    price: "Request a quote",
    planningPreview: true,
  },
];

function tourRibbon(tour: Tour) {
  const category = tour.category.toLowerCase();
  const duration = tour.duration.toLowerCase();

  if (category.includes("cruise")) return "Nile cruise";
  if (category.includes("luxury")) return "Private luxury";
  if (category.includes("custom") || tour.priceFrom <= 0) return "Tailor made";
  if (duration.includes("1 day") || category.includes("day tour")) return "One day";
  return "Multi day";
}

function priceLabel(tour: Tour) {
  if (tour.priceFrom <= 0) return "Tailor-made quote";

  const amount = tour.priceFrom.toLocaleString("en-US");
  const price =
    tour.priceCurrency.toUpperCase() === "USD"
      ? `$${amount}`
      : `${tour.priceCurrency} ${amount}`;

  return `Starts from ${price}`;
}

function realTourImage(tour: Tour, index: number) {
  const searchValue = `${tour.slug} ${tour.title} ${tour.category}`.toLowerCase();

  if (searchValue.includes("cruise")) {
    return index % 2 === 0 ? "/photos/felucca.jpg" : "/photos/nile.jpg";
  }
  if (searchValue.includes("balloon")) return "/photos/hatshepsut.jpg";
  if (searchValue.includes("7-day") || searchValue.includes("cairo")) {
    return "/photos/pyramids.jpg";
  }
  if (searchValue.includes("valley") || searchValue.includes("karnak")) {
    return "/photos/valley-of-kings.jpg";
  }
  if (searchValue.includes("tailor")) return "/photos/aswan.jpg";

  return tour.heroImage;
}

function toPromoJourney(tour: Tour, index: number): PromoJourney {
  return {
    id: `tour-${tour.slug}`,
    title: tour.title,
    category: tour.category,
    duration: tour.duration,
    image: realTourImage(tour, index),
    href: `/tours/${tour.slug}`,
    ribbon: tourRibbon(tour),
    price: priceLabel(tour),
    rating: tour.rating,
    reviewCount: tour.reviewCount,
  };
}

function normalizeTitle(title: string) {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
}

function JourneyMeta({ journey }: { journey: PromoJourney }) {
  if (journey.planningPreview) {
    return (
      <span className="text-[0.68rem] font-medium text-[var(--color-navy)]/56">
        Available for custom planning
      </span>
    );
  }

  if (!journey.reviewCount) {
    return (
      <span className="text-[0.68rem] font-medium text-[var(--color-navy)]/50">
        Private journey
      </span>
    );
  }

  const rating = Math.max(0, Math.min(5, Math.round(journey.rating ?? 0)));

  return (
    <span
      className="inline-flex items-center gap-2"
      aria-label={`${(journey.rating ?? 0).toFixed(1)} out of 5 from ${journey.reviewCount} reviews`}
    >
      <span
        className="flex items-center gap-0.5 text-[var(--color-gold-dark)]"
        aria-hidden="true"
      >
        {Array.from({ length: 5 }, (_, index) => (
          <Star
            key={index}
            className="size-3.5"
            fill={index < rating ? "currentColor" : "none"}
            strokeWidth={1.7}
          />
        ))}
      </span>
      <span className="text-[0.68rem] font-medium text-[var(--color-navy)]/62">
        {journey.reviewCount} {journey.reviewCount === 1 ? "review" : "reviews"}
      </span>
    </span>
  );
}

function JourneyCard({
  journey,
  position,
  total,
}: {
  journey: PromoJourney;
  position: number;
  total: number;
}) {
  return (
    <article
      role="group"
      aria-label={`${position} of ${total}: ${journey.title}`}
      className="group flex h-full w-[84vw] max-w-[20.5rem] shrink-0 snap-start flex-col overflow-hidden border border-[rgb(6_17_31_/_8%)] bg-white shadow-[0_16px_38px_rgb(6_17_31_/_10%)] transition-[transform,box-shadow] duration-500 motion-safe:hover:-translate-y-1 motion-safe:hover:shadow-[0_24px_50px_rgb(6_17_31_/_15%)] motion-reduce:transition-none sm:w-[20.5rem] lg:w-[19rem] xl:w-[20rem]"
    >
      <Link
        href={journey.href}
        className="relative block aspect-[1.45/1] overflow-hidden bg-[var(--color-sand)] outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold)]"
      >
        <Image
          src={journey.image}
          alt={journey.title}
          fill
          sizes="(min-width: 1280px) 320px, (min-width: 640px) 328px, 84vw"
          className="object-cover transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.055] motion-reduce:transition-none"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-t from-[rgb(6_17_31_/_18%)] via-transparent to-transparent"
        />
        <span className="absolute left-0 top-0 z-10 bg-[var(--color-gold-dark)] px-4 py-2 text-[0.64rem] font-bold uppercase tracking-[0.1em] text-white">
          {journey.ribbon}
        </span>
        <span className="absolute left-0 top-8 z-10 bg-[var(--color-navy-mid)] px-4 py-2.5 text-[0.76rem] font-bold text-white shadow-[0_8px_18px_rgb(6_17_31_/_18%)]">
          {journey.price}
        </span>
        <span className="absolute inset-x-0 bottom-0 h-1 bg-[var(--color-gold)]" />
      </Link>

      <div className="flex min-h-[10.8rem] flex-1 flex-col px-5 pb-4 pt-4">
        <Link
          href={journey.href}
          className="outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
        >
          <h3 className="line-clamp-2 min-h-[2.65rem] font-sans text-[1.05rem] font-extrabold leading-[1.22] text-[var(--color-navy)] transition-colors duration-300 group-hover:text-[var(--color-gold-dark)] motion-reduce:transition-none">
            {journey.title}
          </h3>
        </Link>

        <p className="mt-2 flex items-center gap-2 text-[0.7rem] font-medium text-[var(--color-navy)]/58">
          {journey.category}
          {journey.planningPreview ? (
            <>
              <span aria-hidden="true" className="size-1 bg-[var(--color-gold)]" />
              <span>Planning preview</span>
            </>
          ) : null}
        </p>

        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-[rgb(6_17_31_/_11%)] pt-3">
          <JourneyMeta journey={journey} />
          <span className="inline-flex items-center gap-1.5 text-[0.68rem] font-medium text-[var(--color-navy)]/62">
            <Clock3
              aria-hidden="true"
              className="size-3.5 text-[var(--color-gold-dark)]"
              strokeWidth={1.8}
            />
            {journey.duration}
          </span>
        </div>
      </div>
    </article>
  );
}

export function PromotionalToursCarousel({ tours }: { tours: Tour[] }) {
  const railRef = useRef<HTMLDivElement>(null);
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const journeys = useMemo(() => {
    const realJourneys = tours.map(toPromoJourney);
    const existingTitles = new Set(
      realJourneys.map((journey) => normalizeTitle(journey.title)),
    );
    const previews = referenceJourneyPreviews.filter(
      (journey) => !existingTitles.has(normalizeTitle(journey.title)),
    );

    return [...realJourneys, ...previews];
  }, [tours]);

  useEffect(
    () => () => {
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    },
    [],
  );

  if (!journeys.length) return null;

  function scrollToIndex(index: number) {
    const rail = railRef.current;
    if (!rail) return;

    const nextIndex = Math.max(0, Math.min(index, journeys.length - 1));
    const card = rail.children.item(nextIndex) as HTMLElement | null;
    if (!card) return;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    rail.scrollTo({
      left: card.offsetLeft - rail.offsetLeft,
      behavior: reduceMotion ? "auto" : "smooth",
    });
    setActiveIndex(nextIndex);
  }

  function updateActiveIndex() {
    const rail = railRef.current;
    if (!rail) return;

    const cards = Array.from(rail.children) as HTMLElement[];
    const nearest = cards.reduce(
      (best, card, index) => {
        const distance = Math.abs(
          card.offsetLeft - rail.offsetLeft - rail.scrollLeft,
        );
        return distance < best.distance ? { distance, index } : best;
      },
      { distance: Number.POSITIVE_INFINITY, index: 0 },
    );

    setActiveIndex(nearest.index);
  }

  function handleScroll() {
    if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current);
    scrollTimerRef.current = setTimeout(updateActiveIndex, 90);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      scrollToIndex(activeIndex - 1);
    }

    if (event.key === "ArrowRight") {
      event.preventDefault();
      scrollToIndex(activeIndex + 1);
    }
  }

  return (
    <section
      aria-labelledby="promotional-tours-heading"
      className="order-4 overflow-hidden bg-white py-8 text-[var(--color-navy)] sm:py-10 lg:py-12"
    >
      <div className="container-premium">
        <div className="mx-auto max-w-5xl border-t border-[rgb(183_137_43_/_35%)] pt-7 text-center sm:pt-8">
          <p className="text-[0.68rem] font-semibold uppercase tracking-[0.15em] text-[var(--color-navy)]/60 sm:text-xs">
            Private journeys across Egypt
          </p>
          <h2
            id="promotional-tours-heading"
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
            From private day tours to longer journeys across Cairo, Luxor,
            Aswan, and the Nile, choose the pace and places that feel right for
            you.
          </p>
        </div>
      </div>

      <div className="relative mx-auto mt-7 max-w-[1600px] sm:mt-8">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-16 top-20 bg-[linear-gradient(90deg,rgb(248_246_240_/_0),rgb(248_246_240_/_75%)_16%,rgb(248_246_240_/_75%)_84%,rgb(248_246_240_/_0))]"
        />
        <div
          ref={railRef}
          role="region"
          aria-roledescription="carousel"
          aria-label="Private Egypt tours and planning previews"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          onScroll={handleScroll}
          className="no-scrollbar relative flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-6 pt-2 outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold)] sm:gap-5 sm:px-8 lg:gap-6 lg:px-10"
        >
          {journeys.map((journey, index) => (
            <JourneyCard
              key={journey.id}
              journey={journey}
              position={index + 1}
              total={journeys.length}
            />
          ))}
        </div>

        <div className="relative mt-1 flex min-h-12 items-center justify-center px-5 sm:px-8 lg:px-10">
          <button
            type="button"
            aria-label="Previous tour"
            disabled={activeIndex === 0}
            onClick={() => scrollToIndex(activeIndex - 1)}
            className="absolute left-5 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold text-[var(--color-navy)] transition-colors hover:text-[var(--color-gold-dark)] disabled:cursor-not-allowed disabled:opacity-35 sm:left-8 lg:left-10"
          >
            <span className="h-px w-8 bg-current" />
            <ArrowLeft
              aria-hidden="true"
              className="size-3.5 sm:hidden"
              strokeWidth={1.6}
            />
            <span className="hidden sm:inline">Previous</span>
          </button>

          <span className="text-[0.7rem] font-semibold tracking-[0.14em] text-[var(--color-navy)]/65 sm:hidden">
            {String(activeIndex + 1).padStart(2, "0")} /{" "}
            {String(journeys.length).padStart(2, "0")}
          </span>

          <div
            className="hidden max-w-[56vw] flex-wrap items-center justify-center sm:flex"
            aria-label="Choose tour slide"
          >
            {journeys.map((journey, index) => (
              <button
                key={journey.id}
                type="button"
                aria-label={`Go to tour ${index + 1}: ${journey.title}`}
                aria-current={index === activeIndex ? "true" : undefined}
                onClick={() => scrollToIndex(index)}
                className="inline-flex size-9 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-1"
              >
                <span
                  className={`size-2.5 rounded-full border transition-colors ${
                    index === activeIndex
                      ? "border-[var(--color-gold-dark)] bg-[var(--color-gold-dark)]"
                      : "border-[var(--color-navy)]/40 bg-white hover:border-[var(--color-gold-dark)]"
                  }`}
                />
              </button>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next tour"
            disabled={activeIndex === journeys.length - 1}
            onClick={() => scrollToIndex(activeIndex + 1)}
            className="absolute right-5 inline-flex min-h-11 items-center gap-2 text-[0.68rem] font-semibold text-[var(--color-navy)] transition-colors hover:text-[var(--color-gold-dark)] disabled:cursor-not-allowed disabled:opacity-35 sm:right-8 lg:right-10"
          >
            <span className="hidden sm:inline">Next</span>
            <ArrowRight
              aria-hidden="true"
              className="size-3.5 sm:hidden"
              strokeWidth={1.6}
            />
            <span className="h-px w-8 bg-current" />
          </button>
        </div>
      </div>
    </section>
  );
}