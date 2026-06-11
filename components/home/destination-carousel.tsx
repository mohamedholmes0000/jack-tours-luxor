"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type DestinationCarouselItem = {
  name: string;
  label: string;
  image: string;
  href: string;
  description: string;
};

export function DestinationCarousel({ items }: { items: DestinationCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);
  const resumeTimerRef = useRef<number | null>(null);
  const dragStateRef = useRef({
    isDragging: false,
    startScrollLeft: 0,
    startX: 0,
    suppressClick: false,
  });
  const [isPaused, setIsPaused] = useState(false);

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

      const firstCard = trackEl.firstElementChild as HTMLElement | null;
      const step = firstCard
        ? firstCard.getBoundingClientRect().width + 16
        : trackEl.clientWidth * 0.72;

      trackEl.scrollBy({ left: step, behavior: "smooth" });
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
    <div
      ref={trackRef}
      className="no-scrollbar -mx-[var(--container-edge,1.25rem)] mt-8 flex cursor-grab snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--container-edge,1.25rem)] pb-3 active:cursor-grabbing sm:mx-0 sm:mt-10 sm:gap-6 sm:px-0"
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
          className="group w-[78vw] max-w-[19rem] shrink-0 snap-start overflow-hidden border border-[rgb(214_173_84_/_26%)] bg-[var(--color-navy)] shadow-[0_20px_50px_rgb(0_0_0_/_28%)] transition duration-300 hover:-translate-y-1 hover:border-[rgb(214_173_84_/_44%)] sm:w-[18rem] md:w-[21rem]"
          onDragStart={(event) => event.preventDefault()}
          onClick={(event) => {
            if (shouldSuppressClick()) {
              event.preventDefault();
            }
          }}
        >
          <div className="relative h-56 overflow-hidden sm:h-60 md:h-64">
            <Image
              src={item.image}
              alt={item.name}
              fill
              sizes="(min-width: 768px) 21rem, (min-width: 640px) 18rem, 78vw"
              draggable={false}
              className="object-cover transition duration-700 group-hover:scale-105"
            />
          </div>
          <div className="p-5">
            <p className="text-[0.58rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
              Destination
            </p>
            <p className="mt-2 font-serif text-3xl font-semibold leading-none text-white">
              {item.name}
            </p>
            <p className="mt-2 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
              {item.label}
            </p>
            <p className="mt-3 line-clamp-3 text-sm leading-6 text-white/72">
              {item.description}
            </p>
            <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)] transition group-hover:translate-x-1">
              Explore Outward →
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
