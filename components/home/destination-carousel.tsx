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
      <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function DestinationCarousel({ items }: { items: DestinationCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);
  const resumeTimerRef = useRef<number | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
  const [canScrollPrevious, setCanScrollPrevious] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const dragStateRef = useRef({
    isDragging: false,
    startScrollLeft: 0,
    startX: 0,
    suppressClick: false,
  });

  function pauseThenResume() {
    setIsPaused(true);

    if (resumeTimerRef.current) {
      window.clearTimeout(resumeTimerRef.current);
    }

    resumeTimerRef.current = window.setTimeout(() => {
      setIsPaused(false);
    }, 2600);
  }

  function startDrag(clientX: number) {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    pauseThenResume();
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

    if (!track || !drag.isDragging) {
      return;
    }

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
    if (!dragStateRef.current.suppressClick) {
      return false;
    }

    window.setTimeout(() => {
      dragStateRef.current.suppressClick = false;
    }, 0);

    return true;
  }

  function getScrollStep() {
    const track = trackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;

    if (!track) {
      return 0;
    }

    return firstCard ? firstCard.getBoundingClientRect().width + 32 : track.clientWidth * 0.7;
  }

  function scrollByCard(direction: "previous" | "next") {
    const track = trackRef.current;

    if (!track) {
      return;
    }

    pauseThenResume();
    track.scrollBy({
      left: direction === "next" ? getScrollStep() : -getScrollStep(),
      behavior: "smooth",
    });
  }

  function updateMobileActiveIndex() {
    const track = mobileTrackRef.current;
    const firstCard = track?.firstElementChild as HTMLElement | null;

    if (!track || !firstCard) return;

    const cardWidth = firstCard.getBoundingClientRect().width;
    const styles = window.getComputedStyle(track);
    const gap = Number.parseFloat(styles.columnGap || styles.gap || "16") || 16;
    const nextIndex = Math.round(track.scrollLeft / (cardWidth + gap));
    setActiveMobileIndex(Math.max(0, Math.min(items.length - 1, nextIndex)));
  }

  useEffect(() => {
    const track = trackRef.current;

    if (!track) {
      return;
    }

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

  useEffect(() => {
    if (isPaused) {
      return;
    }

    const track = trackRef.current;

    if (!track) {
      return;
    }

    const trackEl = track;

    function tick(timestamp: number) {
      if (timestamp - lastStepRef.current < 2800) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      lastStepRef.current = timestamp;
      const maxScroll = trackEl.scrollWidth - trackEl.clientWidth;

      if (maxScroll <= 0) {
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      if (trackEl.scrollLeft >= maxScroll - 4) {
        trackEl.scrollTo({ left: 0, behavior: "smooth" });
        animationFrameRef.current = window.requestAnimationFrame(tick);
        return;
      }

      trackEl.scrollBy({ left: getScrollStep(), behavior: "smooth" });
      animationFrameRef.current = window.requestAnimationFrame(tick);
    }

    animationFrameRef.current = window.requestAnimationFrame(tick);

    return () => {
      if (animationFrameRef.current) {
        window.cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isPaused]);

  useEffect(() => {
    return () => {
      if (resumeTimerRef.current) {
        window.clearTimeout(resumeTimerRef.current);
      }
    };
  }, []);

  return (
    <div className="container-premium relative mt-8 max-w-[900px] sm:mt-10">
      <div className="destination-carousel-mobile-fade relative lg:hidden">
        <div
          ref={mobileTrackRef}
          className="destinations-mobile-scroll no-scrollbar -mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2"
          aria-label="Destinations carousel"
          onScroll={updateMobileActiveIndex}
        >
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex w-[38vw] min-w-[128px] max-w-[146px] shrink-0 snap-center flex-col items-center text-center"
          >
            <span className="relative block size-[118px] overflow-hidden rounded-full bg-[var(--color-sand)] shadow-[0_14px_30px_rgb(87_59_22_/_12%)]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="118px"
                draggable={false}
                className="object-cover"
              />
            </span>
            <span className="mt-3 max-w-full truncate font-sans text-[15px] font-bold leading-tight text-[var(--color-navy)]">
              {item.name}
            </span>
            <span className="mt-0.5 line-clamp-2 max-w-full text-[11px] font-normal leading-4 text-[rgb(6_17_31_/_60%)]">
              {item.subtitle}
            </span>
            <span className="mt-1 text-[11px] font-medium leading-4 text-[var(--color-gold-dark)]">
              {item.countLabel}
            </span>
          </Link>
        ))}
        </div>

        <div className="mt-4 flex justify-center gap-1.5">
          {items.map((item, index) => (
            <span
              key={item.name}
              aria-hidden="true"
              className={`h-1 rounded-full transition-all duration-300 ${
                index === activeMobileIndex ? "w-4 bg-[var(--color-gold)]" : "w-1 bg-[rgb(6_17_31_/_20%)]"
              }`}
            />
          ))}
        </div>
      </div>

      {canScroll ? (
        <div className="pointer-events-none absolute left-[-32px] right-[-32px] top-[46px] z-10 hidden items-center justify-between lg:flex">
          <button
            type="button"
            aria-label="Previous destination"
            disabled={!canScrollPrevious}
            className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white text-[var(--color-navy)] shadow-[0_2px_8px_rgb(0_0_0_/_8%)] transition duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgb(0_0_0_/_12%)] disabled:pointer-events-none disabled:scale-100 disabled:text-[var(--color-navy)]/25 disabled:shadow-[0_2px_8px_rgb(0_0_0_/_5%)]"
            onClick={() => scrollByCard("previous")}
          >
            <ChevronLeftIcon />
          </button>
          <button
            type="button"
            aria-label="Next destination"
            disabled={!canScrollNext}
            className="pointer-events-auto grid size-12 place-items-center rounded-full bg-white text-[var(--color-navy)] shadow-[0_2px_8px_rgb(0_0_0_/_8%)] transition duration-300 hover:scale-105 hover:shadow-[0_8px_20px_rgb(0_0_0_/_12%)] disabled:pointer-events-none disabled:scale-100 disabled:text-[var(--color-navy)]/25 disabled:shadow-[0_2px_8px_rgb(0_0_0_/_5%)]"
            onClick={() => scrollByCard("next")}
          >
            <ChevronRightIcon />
          </button>
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={`no-scrollbar hidden w-full cursor-grab snap-x snap-mandatory gap-8 overflow-x-auto scroll-smooth active:cursor-grabbing lg:flex ${
          canScroll ? "sm:justify-start" : "sm:justify-center"
        }`}
        aria-label="Destinations carousel"
        onPointerDown={(event) => {
          startDrag(event.clientX);
        }}
        onPointerLeave={stopDrag}
        onPointerMove={(event) => {
          moveDrag(event.clientX);
        }}
        onPointerUp={stopDrag}
        onWheel={pauseThenResume}
        onTouchStart={pauseThenResume}
      >
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            draggable={false}
            className="group flex w-[140px] shrink-0 snap-center flex-col items-center text-center outline-none"
            onDragStart={(event) => event.preventDefault()}
            onClick={(event) => {
              if (shouldSuppressClick()) {
                event.preventDefault();
              }
            }}
          >
            <span className="relative block size-[140px] overflow-hidden rounded-full bg-[var(--color-sand)] shadow-[0_14px_30px_rgb(87_59_22_/_12%)] transition duration-300 ease-out group-hover:scale-105 group-focus-visible:scale-105">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="140px"
                draggable={false}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </span>
            <span className="mt-3 font-sans text-[18px] font-bold leading-tight text-[var(--color-navy)]">
              {item.name}
            </span>
            <span className="mt-1 max-w-[140px] text-[13px] font-normal leading-5 text-[rgb(6_17_31_/_50%)]">
              {item.subtitle}
            </span>
            <span className="mt-1 text-[13px] font-normal leading-5 text-[rgb(6_17_31_/_60%)]">
              {item.countLabel}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
