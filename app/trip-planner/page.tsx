import type { Metadata } from "next";
import Image from "next/image";
import { TripPlannerForm } from "@/components/forms/trip-planner-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Trip Planner",
  description:
    "Plan a private Egypt trip with Jack Tours Luxor using a short WhatsApp-led trip planner.",
};

export default function TripPlannerPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src="https://images.unsplash.com/photo-1572252009286-268acec5ca0a?auto=format&fit=crop&w=1800&q=82"
          alt="Egyptian pyramids at sunset"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-[rgba(13,27,42,0.66)]" />
        <div className="container-premium relative py-20 md:py-28">
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
            Trip Planner
          </p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Shape your private Egypt journey in four short steps.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/78">
            Share dates, destinations, travel style, and contact details. We prepare a clean
            WhatsApp brief so the Luxor team can reply quickly.
          </p>
          <a className="btn-ghost mt-8" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
            Prefer direct WhatsApp?
          </a>
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-12 md:py-20">
        <div className="container-premium">
          <TripPlannerForm />
        </div>
      </section>
    </>
  );
}
