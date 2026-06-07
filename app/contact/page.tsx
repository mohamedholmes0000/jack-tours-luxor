import type { Metadata } from "next";
import Image from "next/image";
import { ContactForm } from "@/components/forms/contact-form";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Jack Tours Luxor for private Luxor tours, Egypt itineraries, Nile cruises, and DMC services.",
};

export default function ContactPage() {
  return (
    <>
      <section className="bg-[var(--color-navy)] py-20 text-white md:py-28">
        <div className="container-premium grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
              Contact
            </p>
            <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
              Ask a local Luxor team for practical Egypt travel guidance.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
              Send a short message and continue the conversation on WhatsApp for the fastest reply.
            </p>
          </div>
          <div className="border border-white/12 bg-white/[0.06] p-6">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
              Direct support
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-white/76">
              <p>Luxor, Egypt</p>
              <p>24/7 WhatsApp response path</p>
              <p>admin@jacktoursluxor.com</p>
            </div>
            <a className="btn-primary mt-6" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
              WhatsApp Now
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-gray-50)] py-16 md:py-24">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
              Website message
            </p>
            <h2 className="mt-4 font-serif text-4xl font-semibold leading-tight text-[var(--color-navy)] md:text-5xl">
              Tell us what you need, then send it to WhatsApp.
            </h2>
            <p className="mt-5 text-base leading-8 text-[var(--color-gray-600)]">
              No email automation yet in this MVP slice. The form validates your details and builds
              a readable WhatsApp message for sales follow-up.
            </p>
            <div className="relative mt-8 min-h-72 overflow-hidden">
              <Image
                src="https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?auto=format&fit=crop&w=1200&q=82"
                alt="Ancient Egyptian columns"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
            </div>
          </div>
          <ContactForm />
        </div>
      </section>
    </>
  );
}
