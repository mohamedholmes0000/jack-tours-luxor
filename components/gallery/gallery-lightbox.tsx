"use client";

import Image from "next/image";
import { useCallback, useEffect, useId, useRef, useState, type ReactNode } from "react";
import type { GalleryImage } from "@/lib/content";

function XIcon() {
  return (
    <svg aria-hidden="true" className="size-8" viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ direction }: { direction: "left" | "right" }) {
  return (
    <svg aria-hidden="true" className="size-7" viewBox="0 0 24 24" fill="none">
      {direction === "left" ? (
        <path d="M15 18 9 12l6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="m9 18 6-6-6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

type GalleryLightboxProps = {
  images: GalleryImage[];
  renderGallery?: (openImage: (index: number) => void) => ReactNode;
};

export function GalleryLightbox({ images, renderGallery }: GalleryLightboxProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const touchStartXRef = useRef<number | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const activeImage = activeIndex === null ? null : images[activeIndex];
  const hasImageMetadata = Boolean(
    activeImage?.category || activeImage?.title || activeImage?.description,
  );

  function close() {
    setActiveIndex(null);
  }

  const showPrevious = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === 0 ? images.length - 1 : current - 1;
    });
  }, [images.length]);

  const showNext = useCallback(() => {
    setActiveIndex((current) => {
      if (current === null) return current;
      return current === images.length - 1 ? 0 : current + 1;
    });
  }, [images.length]);

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") close();
      if (event.key === "ArrowLeft") showPrevious();
      if (event.key === "ArrowRight") showNext();
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeImage, showNext, showPrevious]);

  return (
    <>
      {renderGallery ? (
        renderGallery((index) => setActiveIndex(index))
      ) : (
        <div className="container-premium grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {images.map((image, index) => (
            <figure
              key={`${image.url}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`Open ${image.title}`}
              className="group cursor-pointer overflow-hidden rounded-lg bg-white shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_22px_rgb(0_0_0_/_12%)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
              onClick={() => setActiveIndex(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  setActiveIndex(index);
                }
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={image.url}
                  alt={image.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition duration-300 group-hover:scale-[1.02]"
                />
              </div>
              <figcaption className="p-4">
                <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
                  {image.category}
                </p>
                <h2 className="mt-2 text-lg font-semibold leading-snug text-[var(--color-navy)]">
                  {image.title}
                </h2>
              </figcaption>
            </figure>
          ))}
        </div>
      )}

      {activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgb(6_17_31_/_95%)] px-4 py-5 text-white"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) close();
          }}
          onTouchStart={(event) => {
            touchStartXRef.current = event.touches[0]?.clientX ?? null;
          }}
          onTouchEnd={(event) => {
            if (touchStartXRef.current === null) return;
            const endX = event.changedTouches[0]?.clientX ?? touchStartXRef.current;
            const delta = endX - touchStartXRef.current;
            if (Math.abs(delta) > 42) {
              if (delta > 0) showPrevious();
              else showNext();
            }
            touchStartXRef.current = null;
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={activeImage.title ? titleId : undefined}
            aria-describedby={activeImage.description ? descriptionId : undefined}
            aria-label={hasImageMetadata ? undefined : "Gallery image viewer"}
            className="relative flex h-full max-h-[92vh] w-full max-w-6xl flex-col"
          >
            <button
              ref={closeButtonRef}
              type="button"
              className="absolute right-0 top-0 z-20 grid size-12 place-items-center rounded-full text-white transition hover:bg-white/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
              aria-label="Close gallery image"
              onClick={close}
            >
              <XIcon />
            </button>
            <button
              type="button"
              className="absolute left-0 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/8 text-white transition hover:bg-white/16 sm:grid"
              aria-label="Previous image"
              onClick={showPrevious}
            >
              <ArrowIcon direction="left" />
            </button>
            <button
              type="button"
              className="absolute right-0 top-1/2 z-20 hidden size-12 -translate-y-1/2 place-items-center rounded-full bg-white/8 text-white transition hover:bg-white/16 sm:grid"
              aria-label="Next image"
              onClick={showNext}
            >
              <ArrowIcon direction="right" />
            </button>

            <div className="relative min-h-0 flex-1">
              <Image
                src={activeImage.url}
                alt={activeImage.alt}
                fill
                sizes="90vw"
                className="object-contain"
                priority
              />
            </div>
            {hasImageMetadata ? (
              <div className="mx-auto mt-4 max-w-3xl text-center">
                {activeImage.category ? (
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
                    {activeImage.category}
                  </p>
                ) : null}
                {activeImage.title ? (
                  <h2 id={titleId} className="mt-2 text-2xl font-semibold text-white">
                    {activeImage.title}
                  </h2>
                ) : null}
                {activeImage.description ? (
                  <p id={descriptionId} className="mt-2 text-sm leading-6 text-white/70">
                    {activeImage.description}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
