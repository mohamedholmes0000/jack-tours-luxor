"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

export function HeroImageSlider({
  images,
}: {
  images: { alt: string; src: string }[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const hasMultipleImages = images.length > 1;

  useEffect(() => {
    if (!hasMultipleImages) return;

    const interval = window.setInterval(() => {
      setCurrentSlide((current) => (current + 1) % images.length);
    }, 5000);

    return () => window.clearInterval(interval);
  }, [hasMultipleImages, images.length]);

  if (images.length === 0) return null;

  return (
    <>
      {images.map((image, index) => {
        const isActive = index === currentSlide;

        return (
          <Image
            key={`${image.src}-${index}`}
            src={image.src}
            alt={image.alt}
            fill
            priority={index === 0}
            sizes="100vw"
            className={`object-cover transition-opacity duration-1000 ease-out ${
              isActive ? "ken-burns opacity-100" : "opacity-0"
            }`}
          />
        );
      })}

      {hasMultipleImages ? (
        <div className="absolute bottom-5 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-2 sm:flex">
          {images.map((image, index) => {
            const isActive = index === currentSlide;

            return (
              <button
                key={image.src}
                type="button"
                aria-label={`Show hero image ${index + 1}`}
                aria-current={isActive ? "true" : undefined}
                onClick={() => setCurrentSlide(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  isActive ? "w-8 bg-[var(--color-gold-light)]" : "w-2 bg-white/55 hover:bg-white/80"
                }`}
              />
            );
          })}
        </div>
      ) : null}
    </>
  );
}
