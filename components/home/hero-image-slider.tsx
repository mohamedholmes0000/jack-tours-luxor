"use client";

import Image from "next/image";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";

const SLIDE_INTERVAL_MS = 7000;

export type HeroSlide = {
  alt: string;
  eyebrow: string;
  headline: {
    before: string;
    accent: string;
    after: string;
    showAccent: boolean;
  };
  image: string;
  primaryCta: {
    href: string;
    label: string;
  };
  secondaryCta: {
    href: string;
    label: string;
  };
  subheadline: string;
};

export function HeroImageSlider({
  slides,
  trustBadges,
}: {
  slides: HeroSlide[];
  trustBadges: string[];
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isInteracting, setIsInteracting] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const hasMultipleSlides = slides.length > 1;
  const activeSlide = slides[currentSlide] ?? slides[0];

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    function updateMotionPreference() {
      setPrefersReducedMotion(mediaQuery.matches);
    }

    updateMotionPreference();
    mediaQuery.addEventListener("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener("change", updateMotionPreference);
  }, []);

  useEffect(() => {
    if (!hasMultipleSlides || isInteracting || prefersReducedMotion) return;

    const interval = window.setInterval(() => {
      if (!document.hidden) {
        setCurrentSlide((current) => (current + 1) % slides.length);
      }
    }, SLIDE_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [hasMultipleSlides, isInteracting, prefersReducedMotion, slides.length]);

  if (!activeSlide) return null;

  function showPreviousSlide() {
    setIsInteracting(true);
    setCurrentSlide((current) => (current - 1 + slides.length) % slides.length);
  }

  function showNextSlide() {
    setIsInteracting(true);
    setCurrentSlide((current) => (current + 1) % slides.length);
  }

  return (
    <section
      data-home-hero="true"
      className="home-hero relative isolate order-1 overflow-hidden bg-[var(--color-navy)] text-white"
      aria-roledescription={hasMultipleSlides ? "carousel" : undefined}
      aria-label="Jack Luxor Tour introduction"
      onKeyDown={(event) => {
        if (!hasMultipleSlides) return;
        if (event.key === "ArrowLeft") {
          event.preventDefault();
          showPreviousSlide();
        }
        if (event.key === "ArrowRight") {
          event.preventDefault();
          showNextSlide();
        }
      }}
    >
      <div className="absolute inset-0 overflow-hidden">
        {slides.map((slide, index) => (
          <Image
            key={`${slide.image}-${index}`}
            src={slide.image}
            alt={slide.alt}
            fill
            loading={index === 0 ? "eager" : "lazy"}
            sizes="100vw"
            className={`home-hero-image object-cover ${
              index === currentSlide ? "is-active" : ""
            }`}
          />
        ))}
      </div>

      <div aria-hidden className="home-hero-scrim absolute inset-0" />

      <div className="container-premium home-hero-content relative flex flex-col items-center justify-center text-center">
        <div key={currentSlide} className="home-hero-copy w-full">
          <p className="eyebrow home-hero-eyebrow text-[var(--color-gold-light)]">
            {activeSlide.eyebrow}
          </p>
          <h1 className="home-hero-title mx-auto font-sans font-extrabold text-white">
            {activeSlide.headline.before}
            {activeSlide.headline.showAccent ? (
              <span className="text-white">
                {activeSlide.headline.accent}
              </span>
            ) : null}
            {activeSlide.headline.after}
          </h1>
          <p className="hero-subheadline mx-auto max-w-[42rem] text-white/82">
            {activeSlide.subheadline}
          </p>
          <div className="home-hero-actions flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center">
            <Link className="btn-primary hero-primary-cta" href={activeSlide.primaryCta.href}>
              <span>{activeSlide.primaryCta.label}</span>
            </Link>
            <a
              className="hero-whatsapp-cta"
              href={activeSlide.secondaryCta.href}
              target="_blank"
              rel="noreferrer"
            >
              <MessageCircle aria-hidden className="size-[1.15rem]" strokeWidth={1.8} />
              <span>{activeSlide.secondaryCta.label}</span>
            </a>
          </div>

          {trustBadges.length ? (
            <p className="hero-trust-line" aria-label="Why travelers choose Jack Luxor Tour">
              {trustBadges.map((badge, index) => (
                <span key={`${badge}-${index}`}>
                  {index ? <span aria-hidden className="hero-trust-separator">•</span> : null}
                  {badge}
                </span>
              ))}
            </p>
          ) : null}
        </div>
      </div>

      {hasMultipleSlides ? (
        <>
          <div
            className="home-hero-edge-controls"
            onPointerEnter={() => setIsInteracting(true)}
            onPointerLeave={() => setIsInteracting(false)}
            onFocusCapture={() => setIsInteracting(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsInteracting(false);
              }
            }}
          >
            <button
              type="button"
              className="home-hero-arrow home-hero-arrow-previous"
              aria-label="Previous slide"
              onFocus={() => setIsInteracting(true)}
              onBlur={() => setIsInteracting(false)}
              onPointerUp={(event) => { if (event.pointerType === "touch") { event.preventDefault(); showPreviousSlide(); } }}
              onClick={showPreviousSlide}
            >
              <span aria-hidden className="home-hero-arrow-line" />
              <span className="home-hero-arrow-label">Previous</span>
            </button>
            <button
              type="button"
              className="home-hero-arrow home-hero-arrow-next"
              aria-label="Next slide"
              onFocus={() => setIsInteracting(true)}
              onBlur={() => setIsInteracting(false)}
              onPointerUp={(event) => { if (event.pointerType === "touch") { event.preventDefault(); showNextSlide(); } }}
              onClick={showNextSlide}
            >
              <span className="home-hero-arrow-label">Next</span>
              <span aria-hidden className="home-hero-arrow-line" />
            </button>
          </div>

          <div
            className="home-hero-progress"
            aria-label={`Slide ${currentSlide + 1} of ${slides.length}`}
            onPointerEnter={() => setIsInteracting(true)}
            onPointerLeave={() => setIsInteracting(false)}
            onFocusCapture={() => setIsInteracting(true)}
            onBlurCapture={(event) => {
              if (!event.currentTarget.contains(event.relatedTarget)) {
                setIsInteracting(false);
              }
            }}
          >
            {slides.map((slide, index) => (
              <button
                key={`${slide.image}-progress`}
                type="button"
                aria-label={`Show slide ${index + 1}`}
                aria-current={index === currentSlide ? "true" : undefined}
                onFocus={() => setIsInteracting(true)}
                onBlur={() => setIsInteracting(false)}
                className={`home-hero-progress-button ${
                  index === currentSlide ? "is-active" : ""
                }`}
                onClick={() => {
                  setIsInteracting(true);
                  setCurrentSlide(index);
                }}
              >
                <span />
              </button>
            ))}
          </div>
        </>
      ) : null}
    </section>
  );
}
