"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 6500;

export function HeroImageSlider({
  images,
}: {
  images: { alt: string; src: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;

    let interval: number | undefined;

    function tick() {
      setCurrentSlide((current) => (current + 1) % images.length);
    }

    function start() {
      stop();
      interval = window.setInterval(tick, SLIDE_INTERVAL_MS);
    }

    function stop() {
      if (interval !== undefined) {
        window.clearInterval(interval);
        interval = undefined;
      }
    }

    function handleVisibility() {
      if (document.hidden) {
        stop();
      } else {
        start();
      }
    }

    start();
    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      stop();
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [hasMultipleImages, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((image, index) => {
        const isActive = index === currentSlide;
        const isNext = index === (currentSlide + 1) % images.length;

        return (
          <Image
            key={`${image.src}-${index}`}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0 || index === 1}
            fetchPriority={isActive || isNext ? "high" : "low"}
            sizes="100vw"
            className={`object-cover transition-opacity duration-[1400ms] ease-out ${
              isActive ? "ken-burns opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      {hasMultipleImages ? (
        <div className="absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-2 sm:bottom-8">
          {images.map((image, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={image.src}
                type="button"
                aria-label={`Show hero image ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setCurrentSlide(index)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  isActive ? "w-8 bg-[var(--color-gold-light)]" : "w-1.5 bg-white/55 hover:bg-white/80"
                }`}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
}
