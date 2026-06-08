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
      <section className="relative min-h-[72vh] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={tour.heroImage}
          alt={tour.title}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.72)] to-[rgba(6,17,31,0.18)]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-transparent to-[rgba(6,17,31,0.18)]" />
        <div className="container-premium relative flex min-h-[72vh] items-end py-16">
          <div className="max-w-4xl">
            <Link
              href="/tours"
              className="eyebrow text-[var(--color-gold-light)]"
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

      <section className="section-dark border-y border-[rgb(214_173_84_/_22%)]">
        <div className="container-premium grid gap-px bg-[rgb(214_173_84_/_22%)] md:grid-cols-4">
          {[
            ["Duration", tour.duration],
            ["Group size", tour.groupSize],
            ["Departure", tour.departurePoint],
            ["Languages", tour.languages.join(", ")],
          ].map(([label, value]) => (
            <div key={label} className="bg-[rgba(6,17,31,0.9)] p-6">
              <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
                {label}
              </p>
              <p className="mt-2 font-serif text-2xl font-semibold text-white">
                {value}
              </p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div className="space-y-16">
            <div>
              <p className="eyebrow">Overview</p>
              <p className="mt-5 text-xl leading-9 text-[var(--color-gray-900)]">{tour.overview}</p>
            </div>

            <div>
              <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Highlights</h2>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                {tour.highlights.map((highlight) => (
                  <div key={highlight} className="border border-[rgb(214_173_84_/_24%)] bg-white/82 p-5 shadow-[0_16px_45px_rgb(87_59_22_/_7%)]">
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
                    className="border border-[rgb(214_173_84_/_24%)] bg-white/86 p-5 shadow-[0_16px_45px_rgb(87_59_22_/_7%)]"
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
                    <li key={item} className="border-b border-[rgb(214_173_84_/_16%)] pb-2">{item}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">Excluded</h2>
                <ul className="mt-5 space-y-3 text-sm leading-7 text-[var(--color-gray-600)]">
                  {tour.excluded.map((item) => (
                    <li key={item} className="border-b border-[rgb(214_173_84_/_16%)] pb-2">{item}</li>
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
            <div className="border border-[rgb(214_173_84_/_28%)] bg-[linear-gradient(180deg,#102a45_0%,#06111f_100%)] p-6 text-white shadow-[0_24px_70px_rgb(0_0_0_/_28%)]">
              <p className="eyebrow text-[var(--color-gold-light)]">
                Private inquiry
              </p>
              <p className="mt-3 font-serif text-3xl font-semibold text-white">
                {formatPrice(tour)}
              </p>
              <p className="mt-4 text-sm leading-7 text-white/68">
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
              <div className="mt-6 border-t border-white/10 pt-6 text-sm leading-7 text-white/62">
                <p>Response promise: practical guidance, not a generic package reply.</p>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
