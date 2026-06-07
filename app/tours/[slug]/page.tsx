import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TourInquiryForm } from "@/components/forms/tour-inquiry-form";
import { tours, formatPrice } from "@/lib/content";
import { getToursSafe } from "@/lib/data/public";
import { JsonLd, touristTripJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type TourDetailProps = {
  params: Promise<{ slug: string }>;
};

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

export default async function TourDetailPage({ params }: TourDetailProps) {
  const { slug } = await params;
  const safeTours = await getToursSafe();
  const tour = safeTours.find((item) => item.slug === slug);

  if (!tour) {
    notFound();
  }

  const whatsappMessage = `Hello Jack Tours Luxor, I am interested in ${tour.title}. Can you send me details and availability?`;

  return (
    <>
      <JsonLd data={touristTripJsonLd(tour)} />
      <section className="relative min-h-[68vh] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(13,27,42,0.62)]" />
        <div className="container-premium relative flex min-h-[68vh] items-end py-16">
          <div className="max-w-4xl">
            <Link
              href="/tours"
              className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]"
            >
              Tours / {tour.category}
            </Link>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight md:text-7xl">
              {tour.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-white/78">{tour.shortDescription}</p>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="container-premium grid gap-px bg-[var(--color-gray-100)] md:grid-cols-4">
          {[
            ["Duration", tour.duration],
            ["Group size", tour.groupSize],
            ["Departure", tour.departurePoint],
            ["Languages", tour.languages.join(", ")],
          ].map(([label, value]) => (
            <div key={label} className="bg-white p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
                {label}
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-16 md:py-24">
        <div className="container-premium grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-16">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
                Overview
              </p>
              <p className="mt-5 text-xl leading-9 text-[var(--color-gray-900)]">{tour.overview}</p>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Highlights</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <div key={highlight} className="border border-[var(--color-gray-100)] bg-white p-5">
                    <p className="text-sm font-semibold leading-7 text-[var(--color-gray-900)]">
                      {highlight}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Itinerary</h2>
              <div className="mt-6 space-y-4">
                {tour.itinerary.map((item, index) => (
                  <details
                    key={item.title}
                    className="border border-[var(--color-gray-100)] bg-white p-5"
                    open={index === 0}
                  >
                    <summary className="cursor-pointer font-serif text-2xl font-semibold text-[var(--color-navy)]">
                      {item.title}
                    </summary>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                      {item.description}
                    </p>
                  </details>
                ))}
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Included</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-gray-600)]">
                  {tour.included.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Excluded</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-gray-600)]">
                  {tour.excluded.map((item) => (
                    <li key={item}>- {item}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Gallery</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {tour.images.map((image, index) => (
                  <div key={image} className="relative aspect-[4/3] overflow-hidden bg-[var(--color-gray-100)]">
                    <Image
                      src={image}
                      alt={`${tour.title} gallery image ${index + 1}`}
                      fill
                      sizes="(min-width: 768px) 30vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>

            <TourInquiryForm tourTitle={tour.title} tourSlug={tour.slug} />
          </div>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="border border-[var(--color-gray-100)] bg-white p-6 shadow-xl">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
                Private inquiry
              </p>
              <p className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                {formatPrice(tour)}
              </p>
              <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
                Ask for availability, exact pricing, or a tailored version of this tour.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <a
                  className="btn-primary"
                  href={buildWhatsAppUrl(whatsappMessage)}
                  target="_blank"
                  rel="noreferrer"
                >
                  WhatsApp Availability
                </a>
                <Link className="btn-secondary" href="/trip-planner">
                  Plan Similar Trip
                </Link>
              </div>
              <div className="mt-6 border-t border-[var(--color-gray-100)] pt-6 text-sm leading-7 text-[var(--color-gray-600)]">
                <p>Response promise: practical guidance, not a generic package reply.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
