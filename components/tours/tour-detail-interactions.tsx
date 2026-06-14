"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

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

export function MobileTourBookingBar({
  heroId,
  price,
  bookingHref,
}: {
  heroId: string;
  price: string;
  bookingHref: string;
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
          href={bookingHref}
          className="shrink-0 rounded-md bg-[var(--color-gold)] px-5 py-3 text-xs font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)]"
        >
          Book Now
        </Link>
      </div>
    </div>
  );
}
