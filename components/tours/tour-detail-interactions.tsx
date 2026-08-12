"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState, type UIEvent } from "react";
import { GalleryLightbox } from "@/components/gallery/gallery-lightbox";

type FaqItem = {
  question: string;
  answer: string;
};

export function TourFaqAccordion({ items }: { items: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="space-y-3">
      {items.map((item, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={item.question}
            className="overflow-hidden rounded-xl border border-[rgb(6_17_31_/_8%)] bg-white shadow-[0_2px_8px_rgb(0_0_0_/_5%)]"
          >
            <button
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-base font-semibold text-[var(--color-navy)]"
              onClick={() => setOpenIndex(isOpen ? -1 : index)}
              aria-expanded={isOpen}
            >
              {item.question}
              <span
                aria-hidden="true"
                className={`grid size-7 shrink-0 place-items-center rounded-full border border-[rgb(6_17_31_/_12%)] text-[var(--color-gold)] transition duration-200 ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <svg className="size-4" viewBox="0 0 24 24" fill="none">
                  <path
                    d="m6 9 6 6 6-6"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ${
                isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <p className="px-5 pb-5 text-[15px] leading-7 text-[var(--color-navy)]/70">
                  {item.answer}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

type TourDetailGalleryProps = {
  title: string;
  images: string[];
};

export function TourDetailGallery({ title, images }: TourDetailGalleryProps) {
  const [mobileIndex, setMobileIndex] = useState(0);
  const galleryImages = images.map((url, index) => ({
    url,
    alt: `${title} gallery image ${index + 1}`,
    title: "",
    description: "",
    category: "",
  }));
  const extraImageCount = Math.max(images.length - 3, 0);

  if (!images.length) {
    return null;
  }

  function handleMobileScroll(event: UIEvent<HTMLDivElement>) {
    const { clientWidth, scrollLeft } = event.currentTarget;

    if (!clientWidth) {
      return;
    }

    setMobileIndex(Math.min(images.length - 1, Math.max(0, Math.round(scrollLeft / clientWidth))));
  }

  function galleryButtonClassName() {
    return "group relative block min-w-0 overflow-hidden rounded-md bg-[var(--color-gray-100)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]";
  }

  function galleryImage(url: string, index: number, sizes: string) {
    return (
      <Image
        src={url}
        alt={`${title} gallery image ${index + 1}`}
        fill
        sizes={sizes}
        className="object-cover transition duration-500 group-hover:scale-[1.02]"
      />
    );
  }

  return (
    <section id="tour-gallery">
      <GalleryLightbox
        images={galleryImages}
        renderGallery={(openImage) => (
          <>
            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="eyebrow text-[var(--color-gold)]">Tour gallery</p>
                <h2 className="mt-2 text-[28px] font-bold leading-tight text-[var(--color-navy)]">In the frame</h2>
              </div>
              {images.length > 1 ? (
                <button
                  className="inline-flex min-h-11 shrink-0 items-center gap-2 text-sm font-semibold text-[var(--color-gold)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                  type="button"
                  onClick={() => openImage(0)}
                >
                  View all photos <span aria-hidden="true">&rarr;</span>
                </button>
              ) : null}
            </div>

            <div className="mt-6 hidden md:block">
              {images.length === 1 ? (
                <button
                  className={`${galleryButtonClassName()} aspect-[16/9] w-full`}
                  type="button"
                  aria-label="Open gallery image"
                  onClick={() => openImage(0)}
                >
                  {galleryImage(images[0], 0, "(min-width: 1280px) 52vw, (min-width: 768px) 62vw, 100vw")}
                </button>
              ) : null}

              {images.length === 2 ? (
                <div className="grid aspect-[16/9] grid-cols-[3fr_2fr] gap-2">
                  {images.slice(0, 2).map((image, index) => (
                    <button
                      key={image}
                      className={galleryButtonClassName()}
                      type="button"
                      aria-label={`Open gallery image ${index + 1}`}
                      onClick={() => openImage(index)}
                    >
                      {galleryImage(image, index, "(min-width: 1280px) 34vw, (min-width: 768px) 40vw, 100vw")}
                    </button>
                  ))}
                </div>
              ) : null}

              {images.length >= 3 ? (
                <div className="grid aspect-[16/9] grid-cols-[3fr_2fr] gap-2">
                  <button
                    className={galleryButtonClassName()}
                    type="button"
                    aria-label="Open gallery image 1"
                    onClick={() => openImage(0)}
                  >
                    {galleryImage(images[0], 0, "(min-width: 1280px) 34vw, (min-width: 768px) 40vw, 100vw")}
                  </button>
                  <div className="grid min-w-0 grid-rows-2 gap-2">
                    {images.slice(1, 3).map((image, index) => {
                      const imageIndex = index + 1;
                      const showExtraImages = imageIndex === 2 && extraImageCount > 0;

                      return (
                        <button
                          key={image}
                          className={galleryButtonClassName()}
                          type="button"
                          aria-label={`Open gallery image ${imageIndex + 1}`}
                          onClick={() => openImage(imageIndex)}
                        >
                          {galleryImage(image, imageIndex, "(min-width: 1280px) 20vw, (min-width: 768px) 24vw, 100vw")}
                          {showExtraImages ? (
                            <span className="absolute inset-0 grid place-items-center bg-[rgb(6_17_31_/_50%)] text-sm font-semibold text-white">
                              +{extraImageCount} photos
                            </span>
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : null}
            </div>

            <div className="mt-6 md:hidden">
              <div
                className="flex max-w-full snap-x snap-mandatory overflow-x-auto no-scrollbar"
                onScroll={handleMobileScroll}
              >
                {images.map((image, index) => (
                  <button
                    key={image}
                    className="group relative aspect-[4/3] w-full shrink-0 snap-center overflow-hidden rounded-md bg-[var(--color-gray-100)] text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--color-gold)]"
                    type="button"
                    aria-label={`Open gallery image ${index + 1}`}
                    onClick={() => openImage(index)}
                  >
                    {galleryImage(image, index, "100vw")}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-right text-xs font-semibold tracking-[0.08em] text-[var(--color-navy)]/55" aria-live="polite">
                {mobileIndex + 1} / {images.length}
              </p>
            </div>
          </>
        )}
      />
    </section>
  );
}

export function MobileTourBookingBar({
  heroId,
  price,
  inquiryHref,
}: {
  heroId: string;
  price: string;
  inquiryHref: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById(heroId);

    if (!hero || !("IntersectionObserver" in window)) {
      const onScroll = () => setVisible(window.scrollY > 320);
      onScroll();
      window.addEventListener("scroll", onScroll, { passive: true });
      return () => window.removeEventListener("scroll", onScroll);
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisible(!entry.isIntersecting);
      },
      { threshold: 0.05 },
    );

    observer.observe(hero);
    return () => observer.disconnect();
  }, [heroId]);

  return (
    <div
      data-tour-mobile-booking-bar="true"
      className={`fixed inset-x-0 bottom-0 z-50 border-t border-[rgb(214_173_84_/_24%)] bg-[var(--color-navy)] px-4 py-3 shadow-[0_-2px_12px_rgb(0_0_0_/_15%)] transition duration-300 md:hidden ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-full opacity-0"
      }`}
    >
      <div className="flex items-center justify-between gap-4">
        <p className="min-w-0">
          <span className="block truncate text-base font-semibold text-white">
            From {price}
          </span>
          <span className="block text-xs text-white/70">per person</span>
        </p>
        <Link
          href={inquiryHref}
          className="shrink-0 rounded-md bg-[var(--color-gold)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)]"
        >
          Continue on WhatsApp
        </Link>
      </div>
    </div>
  );
}
