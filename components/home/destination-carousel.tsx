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

export function DestinationCarousel({ items }: { items: DestinationCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const mobileTrackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);
  const resumeTimerRef = useRef<number | null>(null);
  const [activeMobileIndex, setActiveMobileIndex] = useState(0);
  const [canScroll, setCanScroll] = useState(false);
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

    return firstCard ? firstCard.getBoundingClientRect().width + 40 : track.clientWidth * 0.7;
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
      setCanScroll(trackEl.scrollWidth > trackEl.clientWidth + 4);
    }

    updateScrollState();
    window.addEventListener("resize", updateScrollState);

    return () => {
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
    <div className="container-premium relative mt-9 sm:mt-12">
      <div className="lg:hidden">
        <div
          ref={mobileTrackRef}
          className="destinations-mobile-scroll no-scrollbar -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-smooth px-4 pb-2"
          aria-label="Destinations carousel"
          onScroll={updateMobileActiveIndex}
        >
        {items.map((item) => (
          <Link
            key={item.name}
            href={item.href}
            className="flex w-[100px] shrink-0 snap-center flex-col items-center text-center min-[390px]:w-[104px] min-[414px]:w-[110px]"
          >
            <span className="relative block size-[100px] overflow-hidden rounded-full bg-[var(--color-sand)] shadow-[0_14px_30px_rgb(87_59_22_/_12%)] ring-1 ring-[rgb(201_168_76_/_40%)] min-[390px]:size-[104px] min-[414px]:size-[110px]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 414px) 110px, (min-width: 390px) 104px, 100px"
                draggable={false}
                className="object-cover"
              />
            </span>
            <span className="mt-3 max-w-full truncate font-serif text-[15px] font-semibold leading-tight text-[var(--color-navy)]">
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

      {items.length > 6 && canScroll ? (
        <div className="pointer-events-none absolute inset-y-0 left-0 right-0 z-10 hidden items-center justify-between lg:flex">
          <button
            type="button"
            aria-label="Previous destination"
            className="pointer-events-auto -ml-5 grid size-10 place-items-center rounded-full border border-[rgb(6_17_31_/_20%)] bg-[var(--color-ivory)]/86 text-[var(--color-navy)] shadow-[0_10px_26px_rgb(87_59_22_/_10%)] transition hover:border-[rgb(6_17_31_/_40%)] hover:bg-[rgb(6_17_31_/_5%)]"
            onClick={() => scrollByCard("previous")}
          >
            <span aria-hidden className="text-xl leading-none">
              &lsaquo;
            </span>
          </button>
          <button
            type="button"
            aria-label="Next destination"
            className="pointer-events-auto -mr-5 grid size-10 place-items-center rounded-full border border-[rgb(6_17_31_/_20%)] bg-[var(--color-ivory)]/86 text-[var(--color-navy)] shadow-[0_10px_26px_rgb(87_59_22_/_10%)] transition hover:border-[rgb(6_17_31_/_40%)] hover:bg-[rgb(6_17_31_/_5%)]"
            onClick={() => scrollByCard("next")}
          >
            <span aria-hidden className="text-xl leading-none">
              &rsaquo;
            </span>
          </button>
        </div>
      ) : null}

      <div
        ref={trackRef}
        className={`no-scrollbar hidden w-full cursor-grab snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth active:cursor-grabbing lg:flex lg:gap-8 ${
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
            className="group flex w-32 shrink-0 snap-center flex-col items-center text-center outline-none sm:w-[10rem] lg:w-[10.5rem]"
            onDragStart={(event) => event.preventDefault()}
            onClick={(event) => {
              if (shouldSuppressClick()) {
                event.preventDefault();
              }
            }}
          >
            <span className="relative block size-[7.5rem] overflow-hidden rounded-full bg-[var(--color-sand)] shadow-[0_18px_38px_rgb(87_59_22_/_12%)] ring-1 ring-[rgb(201_168_76_/_45%)] transition duration-300 ease-out group-hover:scale-105 group-hover:ring-2 group-hover:ring-[rgb(201_168_76_/_100%)] group-focus-visible:scale-105 group-focus-visible:ring-2 group-focus-visible:ring-[rgb(201_168_76_/_100%)] sm:size-[9rem] lg:size-[10.5rem]">
              <Image
                src={item.image}
                alt={item.name}
                fill
                sizes="(min-width: 1024px) 168px, (min-width: 640px) 144px, 120px"
                draggable={false}
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </span>
            <span className="mt-4 font-serif text-base font-semibold leading-tight text-[var(--color-navy)]">
              {item.name}
            </span>
            <span className="mt-1 max-w-[10rem] text-[13px] font-normal leading-5 text-[rgb(6_17_31_/_50%)]">
              {item.subtitle}
            </span>
            <span className="mt-2 text-xs font-medium leading-5 text-[var(--color-gold-dark)]">
              {item.countLabel}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}
