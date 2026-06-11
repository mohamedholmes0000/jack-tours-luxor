"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";

type DestinationCarouselItem = {
  name: string;
  label: string;
  image: string;
};

export function DestinationCarousel({ items }: { items: DestinationCarouselItem[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);
  const lastStepRef = useRef<number>(0);
  const resumeTimerRef = useRef<number | null>(null);
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
      className="-mx-[var(--container-edge,1.25rem)] mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-[var(--container-edge,1.25rem)] pb-3 sm:mx-0 sm:mt-10 sm:gap-6 sm:px-0"
      aria-label="Destinations carousel"
      onPointerDown={pauseThenResume}
      onWheel={pauseThenResume}
      onTouchStart={pauseThenResume}
    >
      {items.map((item) => (
        <figure
          key={item.name}
          className="relative h-[18rem] w-[78vw] max-w-[19rem] shrink-0 snap-start overflow-hidden border border-[rgb(214_173_84_/_22%)] bg-[var(--color-navy)] shadow-[0_20px_50px_rgb(0_0_0_/_28%)] sm:h-[22rem] sm:w-[18rem] md:h-[26rem] md:w-[21rem]"
        >
          <Image
            src={item.image}
            alt={item.name}
            fill
            sizes="(min-width: 768px) 21rem, (min-width: 640px) 18rem, 78vw"
            className="object-cover"
          />
          <div
            aria-hidden
            className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.12)] to-transparent"
          />
          <figcaption className="absolute inset-x-0 bottom-0 p-5">
            <p className="font-serif text-3xl font-semibold leading-none text-white">
              {item.name}
            </p>
            <p className="mt-3 text-[0.6rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
              {item.label}
            </p>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}
