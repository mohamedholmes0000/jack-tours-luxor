"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DestinationCarouselItem = {
  name: string;
  subtitle: string;
  image: string;
  href: string;
  countLabel: string;
};

function ChevronLeftIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="m15 18-6-6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ChevronRightIcon() {
  return (
    <svg aria-hidden="true" className="size-5" viewBox="0 0 24 24" fill="none">
      <path d="m9 18 6-6 6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DestinationMedallion() {
  return (
    <svg aria-hidden="true" className="size-4" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s6-5.5 6-11a6 6 0 1 0-12 0c0 5.5 6 11 6 11Z" stroke="currentColor" strokeWidth="1.7" />
      <circle cx="12" cy="10" r="2" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

export function DestinationCarousel({ items }: { items: DestinationCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const dragStateRef = useRef({
    isDragging: false,
    startScrollLeft: 0,
    startX: 0,
    suppressClick: false,
  });

  function startDrag(clientX: number) {
    const track = trackRef.current;

    if (!track) return;

    dragStateRef.current = {
      isDragging: true,
      startScrollLeft: track.scrollLeft,
      startX: clientX,
      suppressClick: false,
    };
  }

  function moveDrag(clientX: number) {
    const track = trackRef.current;
    const drag = dragStateRef.current;

    if (!track || !drag.isDragging) return;

    const distance = clientX - drag.startX;

    if (Math.abs(distance) > 5) {
      drag.suppressClick = true;
    }

    track.scrollLeft = drag.startScrollLeft - distance;
  }

  function stopDrag() {
    dragStateRef.current.isDragging = false;
  }

  function shouldSuppressClick() {
    if (!dragStateRef.current.suppressClick) return false;

    window.setTimeout(() => {
      dragStateRef.current.suppressClick = false;
    }, 0);

    return true;
  }

  function getScrollStep() {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;

    if (!track) return 0;

    return firstCard ? firstCard.getBoundingClientRect().width + 20 : track.clientWidth * 0.7;
  }

  function scrollByCard(direction: "previous" | "next") {
    const track = trackRef.current;

    if (!track) return;

    track.scrollBy({
      left: direction === "next" ? getScrollStep() : -getScrollStep(),
      behavior: "smooth",
    });
  }

  function updateMobileActiveIndex() {
    const track = mobileTrackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;

    if (!track || !firstCard) return;

    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    const cardWidth = firstCard.getBoundingClientRect().width;
    const nextIndex = Math.round(track.scrollLeft / (cardWidth + gap));

    setActiveMobileIndex(Math.max(0, Math.min(items.length - 1, nextIndex)));
  }

  useEffect(() => {
    const track = trackRef.current;

    if (!track) return;

    const trackEl = track;

    function updateScrollState() {
      const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;

      setCanScroll(maxScroll > 4);
      setCanScrollPrevious(trackEl.scrollLeft > 4);
      setCanScrollNext(trackEl.scrollLeft < maxScroll - 4);
    }

    updateScrollState();
    trackEl.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      trackEl.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
    };
  }, [items.length]);

  return (
    <div className="container-premium relative mt-7 max-w-[1180px] sm:mt-8">
      <div className="destination-carousel-mobile-fade relative lg:hidden">
        <div
          ref={mobileTrackRef}
          className="destinations-mobile-scroll no-scrollbar -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-5 pb-2"
          aria-label="Destinations carousel"
          onScroll={updateMobileActiveIndex}
        >
          {items.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className="group w-[72vw] min-w-[248px] max-w-[290px] shrink-0 snap-center overflow-hidden rounded-[1rem] border border-[rgb(6_17_31_/_10%)] bg-white text-left shadow-[0_12px_30px_rgb(6_17_31_/_8%)] outline-none transition duration-500 hover:-translate-y-1 hover:shadow-[0_20px_38px_rgb(6_17_31_/_13%)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
            >
              <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-sand)]">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="72vw"
                  draggable={false}
                  className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
                />
                <span className="absolute bottom-0 left-1/2 grid size-11 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border border-[rgb(214_173_84_/_42%)] bg-white text-[var(--color-gold-dark)] shadow-[0_8px_18px_rgb(6_17_31_/_14%)]">
                  <DestinationMedallion />
                </span>
              </span>
              <span className="block px-4 pb-4 pt-7 text-center">
                <span className="block font-serif text-[1.3rem] font-semibold leading-none text-[var(--color-navy)]">
                  {item.name}
                </span>
                <span className="mt-2 block line-clamp-2 text-[0.76rem] leading-5 text-[var(--color-navy)]/58">
                  {item.subtitle}
                </span>
                {item.countLabel ? (
                  <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-gold-dark)]">
                    {item.countLabel}
                  </span>
                ) : null}
              </span>
            </Link>
          ))}
        </div>

        <div className="mt-5 flex justify-center gap-1.5" aria-hidden="true">
          {items.map((item, index) => (
            <span
              key={item.name}
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeMobileIndex ? "w-5 bg-[var(--color-gold)]" : "w-1.5 bg-[rgb(6_17_31_/_18%)]"
              }`}
            />
          ))}
        </div>
      </div>

      {canScroll ? (
        <div className="pointer-events-none absolute inset-x-[-1.5rem] top-[42%] z-10 hidden items-center justify-between lg:flex">
          <button
            type="button"
            aria-label="Previous destination"
            disabled={!canScrollPrevious}
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-[rgb(6_17_31_/_10%)] bg-white text-[var(--color-navy)] shadow-[0_8px_20px_rgb(6_17_31_/_12%)] transition hover:-translate-x-0.5 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] disabled:pointer-events-none disabled:opacity-30"
            onClick={() => scrollByCard("previous")}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next destination"
            disabled={!canScrollNext}
            className="pointer-events-auto grid size-11 place-items-center rounded-full border border-[rgb(6_17_31_/_10%)] bg-white text-[var(--color-navy)] shadow-[0_8px_20px_rgb(6_17_31_/_12%)] transition hover:translate-x-0.5 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] disabled:pointer-events-none disabled:opacity-30"
            onClick={() => scrollByCard("next")}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={`no-scrollbar hidden w-full cursor-grab snap-x snap-mandatory gap-5 overflow-x-auto px-1 py-2 active:cursor-grabbing lg:flex ${
          canScroll ? "justify-start" : "justify-center"
        }`}
        aria-label="Destinations carousel"
        onPointerDown={(event) => startDrag(event.clientX)}
        onPointerLeave={stopDrag}
        onPointerMove={(event) => moveDrag(event.clientX)}
        onPointerUp={stopDrag}
      >
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            draggable={false}
            className="group min-w-[190px] shrink-0 snap-center overflow-hidden rounded-[1rem] border border-[rgb(6_17_31_/_10%)] bg-white text-left shadow-[0_10px_28px_rgb(6_17_31_/_7%)] outline-none transition duration-500 hover:-translate-y-1.5 hover:border-[rgb(214_173_84_/_46%)] hover:shadow-[0_22px_42px_rgb(6_17_31_/_13%)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] xl:min-w-0 xl:flex-1"
            onDragStart={(event) => event.preventDefault()}
            onClick={(event) => {
              if (shouldSuppressClick()) event.preventDefault();
            }}
          >
            <span className="relative block aspect-[4/3] overflow-hidden bg-[var(--color-sand)]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1280px) 220px, 20vw"
                draggable={false}
                className="object-cover transition duration-700 ease-out group-hover:scale-[1.06]"
              />
              <span className="absolute bottom-0 left-1/2 grid size-11 -translate-x-1/2 translate-y-1/2 place-items-center rounded-full border border-[rgb(214_173_84_/_42%)] bg-white text-[var(--color-gold-dark)] shadow-[0_8px_18px_rgb(6_17_31_/_14%)]">
                <DestinationMedallion />
              </span>
            </span>
            <span className="block px-4 pb-4 pt-7 text-center">
              <span className="block font-serif text-[1.35rem] font-semibold leading-none text-[var(--color-navy)]">
                {item.name}
              </span>
              <span className="mt-2 block min-h-10 text-[0.76rem] leading-5 text-[var(--color-navy)]/58">
                {item.subtitle}
              </span>
              {item.countLabel ? (
                <span className="mt-1 block text-[0.68rem] font-semibold uppercase tracking-[0.09em] text-[var(--color-gold-dark)]">
                  {item.countLabel}
                </span>
              ) : null}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
