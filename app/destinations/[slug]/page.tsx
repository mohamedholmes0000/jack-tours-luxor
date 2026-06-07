import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getDestinationBySlug, destinations } from "@/lib/content";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type DestinationDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return destinations.map((destination) => ({ slug: destination.slug }));
}

export async function generateMetadata({ params }: DestinationDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    return {};
  }

  return {
    title: `${destination.name} Private Tours`,
    description: destination.overview,
  };
}

export default async function DestinationDetailPage({ params }: DestinationDetailProps) {
  const { slug } = await params;
  const destination = getDestinationBySlug(slug);

  if (!destination) {
    notFound();
  }

  const message = `Hello Jack Tours Luxor, I am interested in planning time in ${destination.name}. Can you help me with a private itinerary?`;

  return (
    <>
      <section className="relative min-h-[62vh] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={destination.heroImage}
          alt={destination.name}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(13,27,42,0.64)]" />
        <div className="container-premium relative flex min-h-[62vh] items-end py-16">
          <div className="max-w-3xl">
            <Link
              href="/destinations"
              className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]"
            >
              Destinations
            </Link>
            <h1 className="mt-5 font-serif text-6xl font-semibold leading-tight md:text-8xl">
              {destination.name}
            </h1>
            <p className="mt-5 text-lg leading-8 text-white/78">{destination.overview}</p>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-16 md:py-24">
        <div className="container-premium grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Highlights
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Shape this destination into a private Egypt itinerary.
            </h2>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {destination.highlights.map((highlight) => (
                <div key={highlight} className="border border-[var(--color-gray-100)] bg-white p-5">
                  <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
          <aside className="border border-[var(--color-gray-100)] bg-white p-6 shadow-xl lg:self-start">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
              Plan {destination.name}
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
              Ask us how to combine {destination.name} with Luxor, Cairo, Aswan, or a Nile cruise.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <a className="btn-primary" href={buildWhatsAppUrl(message)} target="_blank" rel="noreferrer">
                WhatsApp Planner
              </a>
              <Link className="btn-secondary" href="/tours">
                View Related Tours
              </Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
