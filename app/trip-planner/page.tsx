import type { Metadata } from "next";
import Image from "next/image";
import { TripPlannerForm } from "@/components/forms/trip-planner-form";
import { getPublicSettings } from "@/lib/data/settings";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trip Planner",
  description:
    "Plan a private Egypt trip with Jack Luxor Tour using a short WhatsApp-led trip planner.",
};

export default async function TripPlannerPage() {
  const settings = await getPublicSettings();

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src="/photos/pyramids.jpg"
          alt="Egyptian pyramids at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.82)] to-[rgba(6,17,31,0.34)]" />
        <div className="container-premium relative py-20 md:py-28">
          <p className="eyebrow text-[var(--color-gold-light)]">Trip Planner</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Shape your private Egypt journey <span className="italic text-[var(--color-gold-light)]">in four short steps.</span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            Share dates, destinations, travel style, and contact details. We prepare a clean
            WhatsApp brief so the Luxor team can reply quickly.
          </p>
          <a
            className="btn-ghost mt-8"
            href={buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber)}
            target="_blank"
            rel="noreferrer"
          >
            Prefer direct WhatsApp?
          </a>
        </div>
      </section>

      <section className="section-ivory py-12 md:py-20">
        <div className="container-premium">
          <TripPlannerForm whatsappNumber={settings.whatsappNumber} />
        </div>
      </section>
    </>
  );
}
