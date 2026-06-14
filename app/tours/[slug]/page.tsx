import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  MobileTourBookingBar,
  TourFaqAccordion,
} from "@/components/tours/tour-detail-interactions";
import { tours, type Tour } from "@/lib/content";
import { getToursSafe } from "@/lib/data/public";
import { JsonLd, touristTripJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type TourDetailProps = {
  params: Promise<{ slug: string }>;
};

type IconName =
  | "clock"
  | "users"
  | "pin"
  | "globe"
  | "check"
  | "x"
  | "photo"
  | "arrow";

const defaultFaqs = [
  {
    question: "What's the cancellation policy?",
    answer: "Free cancellation up to 24 hours before the tour.",
  },
  {
    question: "Is this tour private or shared?",
    answer: "All our tours are private and exclusively for your group.",
  },
  {
    question: "What should I bring?",
    answer: "Comfortable shoes, sunscreen, hat, water bottle, and camera.",
  },
  {
    question: "Is hotel pickup included?",
    answer: "Yes, complimentary hotel pickup is included from Luxor hotels.",
  },
];

export function generateStaticParams() {
  return tours.map((tour) => ({ slug: tour.slug }));
}

export async function generateMetadata({ params }: TourDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const safeTours = await getToursSafe();
  const tour = safeTours.find((item) => item.slug === slug);

  if (!tour) {
    return {};
  }

  return {
    title: tour.title,
    description: tour.shortDescription,
  };
}

function Icon({ name, className = "size-5" }: { name: IconName; className?: string }) {
  const common = {
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
  };

  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 24 24" fill="none">
      {name === "clock" ? (
        <>
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" {...common} />
          <path d="M12 6v6l4 2" {...common} />
        </>
      ) : null}
      {name === "users" ? (
        <>
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" {...common} />
          <path d="M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" {...common} />
          <path d="M22 21v-2a4 4 0 0 0-3-3.87" {...common} />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" {...common} />
        </>
      ) : null}
      {name === "pin" ? (
        <>
          <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" {...common} />
          <path d="M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" {...common} />
        </>
      ) : null}
      {name === "globe" ? (
        <>
          <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" {...common} />
          <path d="M2 12h20" {...common} />
          <path d="M12 2a15.3 15.3 0 0 1 0 20M12 2a15.3 15.3 0 0 0 0 20" {...common} />
        </>
      ) : null}
      {name === "check" ? (
        <path d="M20 6 9 17l-5-5" {...common} />
      ) : null}
      {name === "x" ? (
        <>
          <path d="m18 6-12 12" {...common} />
          <path d="m6 6 12 12" {...common} />
        </>
      ) : null}
      {name === "photo" ? (
        <>
          <path d="M4 5h16v14H4z" {...common} />
          <path d="m4 15 4-4 4 4 3-3 5 5" {...common} />
          <path d="M15.5 8.5h.01" {...common} />
        </>
      ) : null}
      {name === "arrow" ? (
        <path d="M5 12h14m-6-6 6 6-6 6" {...common} />
      ) : null}
    </svg>
  );
}

function priceAmount(tour: Tour) {
  if (!tour.priceFrom) {
    return "Custom quote";
  }

  const amount = tour.priceFrom.toLocaleString("en-US");
  return tour.priceCurrency === "USD" ? `$${amount}` : `${tour.priceCurrency} ${amount}`;
}

function isMultiDayTour(tour: Tour) {
  const lower = tour.duration.toLowerCase();
  const dayMatch = lower.match(/(\d+)\s*(day|days)/);

  return lower.includes("multi") || lower.includes("custom") || Boolean(dayMatch && Number(dayMatch[1]) > 1);
}

function sectionHeader(eyebrow: string, heading: string) {
  return (
    <div>
      <p className="eyebrow text-[var(--color-gold)]">{eyebrow}</p>
      <h2 className="mt-2 text-[28px] font-bold leading-tight text-[var(--color-navy)]">
        {heading}
      </h2>
    </div>
  );
}

function SimilarTourCard({ tour }: { tour: Tour }) {
  return (
    <Link
      href={`/tours/${tour.slug}`}
      className="group block overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_10%)]"
    >
      <div className="relative aspect-[16/9] overflow-hidden md:aspect-[16/10]">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          sizes="(min-width: 1280px) 300px, (min-width: 768px) 33vw, 100vw"
          className="object-cover transition duration-500 group-hover:scale-105"
        />
        <span className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-white/80 text-[var(--color-gray-600)] transition group-hover:text-[var(--color-gold)]">
          <Icon name="arrow" className="size-4" />
        </span>
      </div>
      <div className="px-4 pt-4">
        <p className="flex items-center gap-2 text-[13px] text-[var(--color-navy)]/50">
          <Icon name="pin" className="size-4 text-[var(--color-navy)]/40" />
          {tour.city || "Luxor"}
        </p>
        <p className="mt-2 min-h-[3.2rem] overflow-hidden text-[17px] font-semibold leading-snug text-[var(--color-navy)] [display:-webkit-box] [-webkit-box-orient:vertical] [-webkit-line-clamp:2]">
          {tour.title}
        </p>
      </div>
      <div className="mx-4 my-3 h-px bg-[rgb(6_17_31_/_8%)]" />
      <div className="flex items-end justify-between gap-3 px-4 pb-4">
        <p>
          <span className="block text-[13px] text-[var(--color-navy)]/50">From</span>
          <span className="text-lg font-bold text-[var(--color-navy)]">{priceAmount(tour)}</span>
        </p>
        <p className="flex items-center gap-2 text-[13px] text-[var(--color-navy)]/50">
          <Icon name="clock" className="size-[15px] text-[var(--color-navy)]/40" />
          {tour.duration}
        </p>
      </div>
    </Link>
  );
}

function getSimilarTours(currentTour: Tour, allTours: Tour[]) {
  const similar = allTours.filter(
    (tour) =>
      tour.slug !== currentTour.slug &&
      (tour.city === currentTour.city || tour.category === currentTour.category),
  );
  const fallback = allTours.filter(
    (tour) => tour.slug !== currentTour.slug && !similar.some((item) => item.slug === tour.slug),
  );

  return [...similar, ...fallback].slice(0, 3);
}

export default async function TourDetailPage({ params }: TourDetailProps) {
  const { slug } = await params;
  const safeTours = await getToursSafe();
  const tour = safeTours.find((item) => item.slug === slug);

  if (!tour) {
    notFound();
  }

  const allImages = Array.from(new Set([tour.heroImage, ...tour.images])).filter(Boolean);
  const thumbnailImages = allImages.slice(1, 5);
  const showSplitGallery = allImages.length > 1;
  const languageLabel = tour.languages.length ? tour.languages.join(", ") : "English";
  const bookingHref = `/trip-planner?tour=${encodeURIComponent(tour.slug)}`;
  const whatsappMessage = `Hi, I'm interested in the ${tour.title} tour. Could you tell me more?`;
  const whatsappHref = buildWhatsAppUrl(whatsappMessage);
  const price = priceAmount(tour);
  const similarTours = getSimilarTours(tour, safeTours);
  const heroId = "tour-detail-hero";
  const multiDay = isMultiDayTour(tour);

  return (
    <>
      <JsonLd data={touristTripJsonLd(tour)} />
      <div data-mobile-cta="true">
      <section id={heroId} className="bg-[var(--color-navy)]">
        <div className="relative h-[320px] overflow-hidden md:h-[480px]">
          <div
            className={`grid h-full gap-1 ${
              showSplitGallery ? "md:grid-cols-[3fr_2fr]" : "grid-cols-1"
            }`}
          >
            <div className="relative h-full overflow-hidden">
              <Image
                src={tour.heroImage}
                alt={tour.title}
                fill
                priority
                sizes={showSplitGallery ? "(min-width: 768px) 60vw, 100vw" : "100vw"}
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[rgb(6_17_31_/_72%)] via-[rgb(6_17_31_/_18%)] to-transparent md:from-[rgb(6_17_31_/_86%)]" />
            </div>

            {showSplitGallery ? (
              <div className="hidden h-full grid-cols-2 gap-1 md:grid">
                {thumbnailImages.map((image, index) => (
                  <div key={`${image}-${index}`} className="relative overflow-hidden">
                    <Image
                      src={image}
                      alt={`${tour.title} photo ${index + 2}`}
                      fill
                      sizes="40vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-[var(--color-navy)]/10" />
                  </div>
                ))}
              </div>
            ) : null}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 hidden p-8 md:block">
            <div className="mx-auto flex max-w-[1280px] items-end justify-between gap-8">
              <div className="max-w-4xl">
                <p className="text-[12.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-gold-light)]">
                  {tour.category}
                </p>
                <h1 className="mt-3 max-w-4xl text-[40px] font-bold leading-tight text-white drop-shadow-[0_4px_18px_rgb(0_0_0_/_45%)]">
                  {tour.title}
                </h1>
                <p className="mt-3 text-base text-white/70">{tour.city || tour.departurePoint}</p>
              </div>
              <a
                href="#tour-gallery"
                className="pointer-events-auto inline-flex items-center gap-2 rounded-md bg-white/90 px-4 py-3 text-sm font-semibold text-[var(--color-navy)] shadow-[0_8px_24px_rgb(0_0_0_/_18%)] transition hover:bg-white"
              >
                <Icon name="photo" className="size-4" />
                View all photos
              </a>
            </div>
          </div>

          <a
            href="#tour-gallery"
            className="absolute bottom-4 right-4 inline-flex items-center gap-2 rounded-md bg-white/90 px-3 py-2 text-xs font-semibold text-[var(--color-navy)] shadow-[0_8px_24px_rgb(0_0_0_/_18%)] md:hidden"
          >
            <Icon name="photo" className="size-4" />
            Photos
          </a>
        </div>
      </section>

      <section className="bg-[#faf8f5] px-5 py-5 md:hidden">
        <p className="text-[12.5px] font-medium uppercase tracking-[0.1em] text-[var(--color-gold)]">
          {tour.category}
        </p>
        <h1 className="mt-2 text-[30px] font-bold leading-tight text-[var(--color-navy)]">
          {tour.title}
        </h1>
        <p className="mt-2 text-sm text-[var(--color-navy)]/60">{tour.city || tour.departurePoint}</p>
      </section>

      <section className="bg-[#faf8f5] py-8 md:py-14">
        <div className="mx-auto grid max-w-[1280px] gap-10 px-5 lg:grid-cols-[minmax(0,65fr)_minmax(320px,35fr)]">
          <main className="min-w-0">
            <div className="mb-8 overflow-x-auto rounded-xl bg-white p-5 shadow-[0_2px_8px_rgb(0_0_0_/_6%)] no-scrollbar">
              <div className="flex min-w-max snap-x snap-mandatory gap-4 md:min-w-0 md:grid md:grid-cols-4">
                {([
                  ["clock" as const, "Duration", tour.duration],
                  ["users" as const, "Group", tour.groupSize],
                  ["pin" as const, "Location", tour.city || tour.departurePoint],
                  ["globe" as const, "Languages", languageLabel],
                ] satisfies Array<[IconName, string, string]>).map(([icon, label, value]) => (
                  <div key={label} className="min-w-[120px] snap-start">
                    <Icon name={icon} className="size-5 text-[var(--color-gold)]" />
                    <p className="mt-3 text-xs font-medium uppercase tracking-[0.08em] text-[var(--color-navy)]/50">
                      {label}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[var(--color-navy)]">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-8 md:space-y-12">
              <section>
                {sectionHeader("Overview", "About this experience")}
                <p className="mt-5 text-base leading-[1.7] text-[var(--color-navy)]/80">
                  {tour.overview}
                </p>
              </section>

              <section>
                {sectionHeader("Highlights", "What makes this special")}
                <ul className="mt-5 space-y-3">
                  {tour.highlights.slice(0, 7).map((highlight) => (
                    <li key={highlight} className="flex gap-3 text-base leading-7 text-[var(--color-navy)]/80">
                      <span className="mt-1 text-[var(--color-gold)]">
                        <Icon name="check" className="size-5" />
                      </span>
                      {highlight}
                    </li>
                  ))}
                </ul>
              </section>

              {tour.itinerary.length ? (
                <section>
                  {sectionHeader(multiDay ? "Itinerary" : "What to expect", multiDay ? "Day by day" : "A smooth private flow")}
                  {multiDay ? (
                    <div className="relative mt-6 space-y-4 pl-6 before:absolute before:bottom-2 before:left-2 before:top-2 before:w-px before:bg-[var(--color-gold)]/45">
                      {tour.itinerary.map((item, index) => (
                        <article
                          key={`${item.title}-${index}`}
                          className="relative rounded-xl bg-white p-5 shadow-[0_2px_8px_rgb(0_0_0_/_6%)] before:absolute before:-left-[23px] before:top-6 before:size-3 before:rounded-full before:bg-[var(--color-gold)]"
                        >
                          <p className="font-serif text-[28px] italic leading-none text-[var(--color-gold)]">
                            Day {String(index + 1).padStart(2, "0")}
                          </p>
                          <h3 className="mt-3 text-lg font-semibold text-[var(--color-navy)]">{item.title}</h3>
                          <p className="mt-2 text-[15px] leading-7 text-[var(--color-navy)]/70">
                            {item.description}
                          </p>
                        </article>
                      ))}
                    </div>
                  ) : (
                    <div className="mt-6 space-y-3">
                      {tour.itinerary.map((item, index) => (
                        <div
                          key={`${item.title}-${index}`}
                          className="flex gap-4 rounded-xl bg-white p-5 shadow-[0_2px_8px_rgb(0_0_0_/_6%)]"
                        >
                          <p className="w-20 shrink-0 text-sm font-semibold text-[var(--color-gold)]">
                            Stop {String(index + 1).padStart(2, "0")}
                          </p>
                          <div>
                            <h3 className="text-base font-semibold text-[var(--color-navy)]">{item.title}</h3>
                            <p className="mt-1 text-[15px] leading-7 text-[var(--color-navy)]/70">
                              {item.description}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </section>
              ) : null}

              <section className="grid gap-6 md:grid-cols-2">
                <div className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgb(0_0_0_/_6%)]">
                  <p className="eyebrow text-[var(--color-gold)]">Included</p>
                  <h2 className="mt-2 text-[24px] font-bold text-[var(--color-navy)]">What&apos;s included</h2>
                  <ul className="mt-5 space-y-3">
                    {tour.included.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--color-navy)]/80">
                        <span className="mt-0.5 text-emerald-600">
                          <Icon name="check" className="size-5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgb(0_0_0_/_6%)]">
                  <p className="eyebrow text-[var(--color-gray-600)]">Not included</p>
                  <h2 className="mt-2 text-[24px] font-bold text-[var(--color-navy)]">What&apos;s not included</h2>
                  <ul className="mt-5 space-y-3">
                    {tour.excluded.map((item) => (
                      <li key={item} className="flex gap-3 text-[15px] leading-6 text-[var(--color-navy)]/80">
                        <span className="mt-0.5 text-red-500">
                          <Icon name="x" className="size-5" />
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {tour.departurePoint ? (
                <section>
                  {sectionHeader("Meeting point", "Where we meet")}
                  <p className="mt-5 text-base leading-[1.7] text-[var(--color-navy)]/80">
                    Pickup is arranged from {tour.departurePoint}. Exact timing is confirmed by WhatsApp after booking, based on your hotel, cruise schedule, and preferred pace.
                  </p>
                </section>
              ) : null}

              <section>
                {sectionHeader("FAQ", "Common questions")}
                <div className="mt-5">
                  <TourFaqAccordion items={defaultFaqs} />
                </div>
              </section>

              <section id="tour-gallery">
                {sectionHeader("Tour gallery", "In the frame")}
                <div className="relative mt-6 overflow-hidden rounded-xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-navy)] py-4 shadow-[0_22px_60px_rgb(87_59_22_/_12%)]">
                  <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-10 bg-gradient-to-r from-[var(--color-navy)] to-transparent" />
                  <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-10 bg-gradient-to-l from-[var(--color-navy)] to-transparent" />
                  <div className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth px-4 pb-2 no-scrollbar">
                    {allImages.map((image, index) => (
                      <figure
                        key={`${image}-${index}`}
                        className="group relative aspect-[4/3] w-[min(82vw,30rem)] shrink-0 snap-center overflow-hidden rounded-lg border border-[rgb(214_173_84_/_24%)] bg-[var(--color-gray-100)] sm:w-[26rem] lg:w-[30rem]"
                      >
                        <Image
                          src={image}
                          alt={`${tour.title} gallery image ${index + 1}`}
                          fill
                          sizes="(min-width: 1024px) 30rem, (min-width: 640px) 26rem, 82vw"
                          className="object-cover transition duration-500 group-hover:scale-105"
                        />
                        <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#06111f] to-transparent p-4">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
                            Image {index + 1}
                          </p>
                        </figcaption>
                      </figure>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </main>

          <aside className="hidden lg:block lg:sticky lg:top-[120px] lg:self-start">
            <div className="rounded-xl bg-white p-7 shadow-[0_4px_16px_rgb(0_0_0_/_8%)]">
              <p className="text-[13px] text-[var(--color-navy)]/50">From</p>
              <p className="mt-1 text-4xl font-bold text-[var(--color-navy)]">{price}</p>
              <p className="mt-1 text-[13px] text-[var(--color-navy)]/50">per person</p>

              <div className="my-5 h-px bg-[rgb(6_17_31_/_8%)]" />

              <div className="space-y-3">
                {([
                  ["clock" as const, "Duration", tour.duration],
                  ["users" as const, "Type", "Private tour"],
                  ["globe" as const, "Languages", languageLabel],
                  ["users" as const, "Group size", tour.groupSize],
                ] satisfies Array<[IconName, string, string]>).map(([icon, label, value]) => (
                  <div key={label} className="flex items-center gap-3 text-sm text-[var(--color-navy)]/70">
                    <Icon name={icon} className="size-4 text-[var(--color-gold)]" />
                    <span className="min-w-24 text-[var(--color-navy)]/50">{label}</span>
                    <span className="font-medium text-[var(--color-navy)]">{value}</span>
                  </div>
                ))}
              </div>

              <div className="my-5 h-px bg-[rgb(6_17_31_/_8%)]" />

              <div className="space-y-3">
                <Link
                  href={bookingHref}
                  className="block w-full rounded-md bg-[var(--color-gold)] px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]"
                >
                  Book Now
                </Link>
                <a
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer"
                  className="block w-full rounded-md border-[1.5px] border-[var(--color-navy)] px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white"
                >
                  WhatsApp Us
                </a>
              </div>

              <div className="mt-6 space-y-3">
                {[
                  "Free cancellation 24h before",
                  "Reserve now, pay later",
                  "Instant confirmation via WhatsApp",
                ].map((item) => (
                  <p key={item} className="flex gap-2 text-[13px] leading-5 text-[var(--color-navy)]/50">
                    <span className="mt-0.5 text-[var(--color-gold)]">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </aside>

          <div className="lg:hidden">
            <div className="rounded-xl bg-white p-6 shadow-[0_4px_16px_rgb(0_0_0_/_8%)]">
              <p className="text-[13px] text-[var(--color-navy)]/50">From</p>
              <p className="mt-1 text-3xl font-bold text-[var(--color-navy)]">{price}</p>
              <p className="mt-1 text-[13px] text-[var(--color-navy)]/50">per person</p>
              <div className="my-5 h-px bg-[rgb(6_17_31_/_8%)]" />
              <Link
                href={bookingHref}
                className="block w-full rounded-md bg-[var(--color-gold)] px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)]"
              >
                Book Now
              </Link>
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="mt-3 block w-full rounded-md border-[1.5px] border-[var(--color-navy)] px-4 py-3.5 text-center text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)]"
              >
                WhatsApp Us
              </a>
              <div className="mt-5 space-y-2">
                {[
                  "Free cancellation 24h before",
                  "Reserve now, pay later",
                  "Instant confirmation via WhatsApp",
                ].map((item) => (
                  <p key={item} className="flex gap-2 text-[13px] leading-5 text-[var(--color-navy)]/50">
                    <span className="mt-0.5 text-[var(--color-gold)]">
                      <Icon name="check" className="size-3.5" />
                    </span>
                    {item}
                  </p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {similarTours.length ? (
        <section className="bg-[var(--color-ivory)] py-14 md:py-20">
          <div className="mx-auto max-w-[1280px] px-5">
            <p className="eyebrow text-[var(--color-gold)]">You might also like</p>
            <div className="mt-2 flex flex-col justify-between gap-4 md:flex-row md:items-end">
              <div>
                <h2 className="text-[28px] font-bold leading-tight text-[var(--color-navy)]">
                  More tours to explore
                </h2>
                <p className="mt-2 text-base text-[var(--color-navy)]/60">
                  Hand-picked experiences similar to this one
                </p>
              </div>
              <Link
                href="/tours"
                className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.08em] text-[var(--color-gold)]"
              >
                View all tours
                <Icon name="arrow" className="size-4" />
              </Link>
            </div>
            <div className="mt-8 grid gap-4 md:grid-cols-3 lg:gap-6">
              {similarTours.map((item) => (
                <SimilarTourCard key={item.slug} tour={item} />
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <MobileTourBookingBar heroId={heroId} price={price} bookingHref={bookingHref} />
      </div>
    </>
  );
}
