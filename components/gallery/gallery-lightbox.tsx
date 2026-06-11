"use client";

import Image from "next/image";
import { useEffect, useId, useRef, useState } from "react";
import type { GalleryImage } from "@/lib/content";

const galleryCardLayouts = [
  {
    frame: "md:col-span-2 lg:col-span-2 lg:row-span-2",
    media: "aspect-[16/10] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/5] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/5] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/5] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "md:col-span-2 lg:col-span-2",
    media: "aspect-[16/9] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/5] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/3] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/3] lg:flex-1 lg:aspect-auto",
  },
  {
    frame: "",
    media: "aspect-[4/3] lg:flex-1 lg:aspect-auto",
  },
] as const;

export function GalleryLightbox({ images }: { images: GalleryImage[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const lastFocusedElementRef = useRef<HTMLElement | null>(null);
  const titleId = useId();
  const descriptionId = useId();
  const activeImage = activeIndex === null ? null : images[activeIndex];

  function openImage(index: number) {
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null;
    setActiveIndex(index);
  }

  useEffect(() => {
    if (!activeImage) {
      return;
    }

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    closeButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setActiveIndex(null);
      }
    }

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      lastFocusedElementRef.current?.focus();
    };
  }, [activeImage]);

  return (
    <>
      <div className="container-premium grid gap-5 md:grid-cols-2 lg:grid-flow-dense lg:grid-cols-4 lg:auto-rows-[15rem]">
        {images.map((image, index) => {
          const layout = galleryCardLayouts[index % galleryCardLayouts.length];

          return (
            <figure
              key={`${image.url}-${index}`}
              role="button"
              tabIndex={0}
              aria-label={`Open ${image.title}`}
              className={`group h-full cursor-pointer focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)] ${layout.frame}`}
              onClick={() => openImage(index)}
              onKeyDown={(event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  openImage(index);
                }
              }}
            >
              <div
                className="gallery-liquid-card isolate flex h-full w-full flex-col text-left"
              >
                <span className={`gallery-liquid-media relative z-0 block min-h-0 ${layout.media}`}>
                  <Image
                    src={image.url}
                    alt={image.alt}
                    fill
                    sizes="(min-width: 1024px) 25vw, (min-width: 768px) 50vw, 100vw"
                    className="object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute inset-0 bg-[var(--color-navy)]/20 opacity-0 transition duration-500 group-hover:opacity-100" />
                </span>
                <figcaption className="gallery-liquid-caption relative z-10 mt-2 p-4 lg:p-3">
                  <span className="block text-[0.56rem] font-extrabold uppercase tracking-[0.2em] text-[var(--color-gold)]">
                    {image.category}
                  </span>
                  <span className="mt-1.5 block font-serif text-xl font-semibold leading-tight text-[var(--color-navy)] lg:text-lg">
                    {image.title}
                  </span>
                </figcaption>
              </div>
            </figure>
          );
        })}
      </div>

      {activeImage ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(6,17,31,0.82)] px-4 py-6 backdrop-blur-md"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActiveIndex(null);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            aria-describedby={descriptionId}
            className="gallery-liquid-card w-full max-w-5xl p-2 text-[var(--color-navy)]"
          >
            <div className="grid max-h-[88vh] overflow-hidden rounded-[18px] bg-[var(--color-ivory)] md:grid-cols-[minmax(0,1fr)_20rem]">
              <div className="relative min-h-[20rem] md:min-h-[34rem]">
                <Image
                  src={activeImage.url}
                  alt={activeImage.alt}
                  fill
                  sizes="(min-width: 768px) 64vw, 100vw"
                  className="object-cover"
                  priority
                />
              </div>
              <div className="gallery-liquid-caption m-2 flex flex-col p-5 md:m-3 md:p-6">
                <button
                  ref={closeButtonRef}
                  type="button"
                  className="ml-auto grid size-10 place-items-center rounded-full border border-[rgb(214_173_84_/_38%)] bg-white/70 text-xl leading-none text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-gold)]"
                  aria-label="Close gallery image"
                  onClick={() => setActiveIndex(null)}
                >
                  x
                </button>
                <p className="mt-6 text-[0.62rem] font-extrabold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                  {activeImage.category}
                </p>
                <h2 id={titleId} className="mt-3 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)]">
                  {activeImage.title}
                </h2>
                <p id={descriptionId} className="mt-5 text-sm leading-7 text-[var(--color-gray-600)]">
                  {activeImage.description}
                </p>
                <p className="mt-5 border-t border-[rgb(214_173_84_/_22%)] pt-5 text-xs leading-6 text-[var(--color-gray-600)]">
                  {activeImage.alt}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
