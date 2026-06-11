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

  const message = `Hello Jack Egypt Tour, I am interested in planning time in ${destination.name}. Can you help me with a private itinerary?`;

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
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.76)] to-[rgba(6,17,31,0.2)]" />
        <div className="container-premium relative flex min-h-[62vh] items-end py-16">
          <div className="max-w-3xl">
            <Link
              href="/destinations"
              className="eyebrow text-[var(--color-gold-light)]"
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

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium">
          <div className="grid gap-8 border-b border-[rgb(214_173_84_/_22%)] pb-14 lg:grid-cols-[minmax(0,1fr)_420px] lg:items-start">
            <div>
              <p className="eyebrow">Destination character</p>
              <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)] md:text-5xl">
                What makes {destination.name} worth slowing down for.
              </h2>
              <p className="mt-6 max-w-4xl text-base leading-8 text-[var(--color-gray-600)] md:text-lg md:leading-9">
                {destination.description}
              </p>
            </div>
            <p className="mb-3 text-[0.66rem] font-bold uppercase tracking-[0.22em] text-[var(--color-gold-dark)]">
              At a Glance
            </p>
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Best Time to Visit", destination.bestTime],
                ["Suggested Duration", destination.duration],
                ["Region", destination.region],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border border-[rgb(214_173_84_/_26%)] bg-white/82 p-4 shadow-[0_14px_40px_rgb(87_59_22_/_7%)]"
                >
                  <p className="text-[0.62rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
                    {label}
                  </p>
                  <p className="mt-2 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                    {value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="container-premium mt-14 grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <div>
            <p className="eyebrow">Highlights</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              Shape this destination into a private Egypt itinerary.
            </h2>
            <div className="mt-8 grid gap-5 sm:grid-cols-2">
              {destination.highlights.map((highlight) => (
                <div
                  key={highlight.title}
                  className="group overflow-hidden border border-[rgb(214_173_84_/_24%)] bg-white/86 shadow-[0_14px_40px_rgb(87_59_22_/_7%)] transition duration-300 hover:-translate-y-1 hover:border-[rgb(214_173_84_/_44%)]"
                >
                  <div className="relative h-48 overflow-hidden">
                    <Image
                      src={highlight.image}
                      alt={highlight.title}
                      fill
                      sizes="(min-width: 640px) 50vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-5">
                    <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
                      {highlight.title}
                    </p>
                    <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                      {highlight.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <aside className="border border-[rgb(214_173_84_/_28%)] bg-[linear-gradient(180deg,#102a45_0%,#06111f_100%)] p-6 text-white shadow-[0_24px_70px_rgb(0_0_0_/_28%)] lg:self-start">
            <p className="eyebrow text-[var(--color-gold-light)]">
              Plan {destination.name}
            </p>
            <p className="mt-4 text-sm leading-7 text-white/68">
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
