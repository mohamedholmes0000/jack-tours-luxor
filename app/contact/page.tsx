import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import { ContactForm } from "@/components/forms/contact-form";
import { getPublicSettings } from "@/lib/data/settings";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact Jack Luxor Tour for private Luxor tours, Egypt itineraries, Nile cruises, and DMC services.",
};

function MessageCircleIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M21 11.5a8.4 8.4 0 0 1-9 8.4 8.7 8.7 0 0 1-3.8-.9L3 21l1.6-5A8.5 8.5 0 1 1 21 11.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none">
      <path d="M12 21s7-5.1 7-11a7 7 0 1 0-14 0c0 5.9 7 11 7 11Z" stroke="currentColor" strokeWidth="1.8" />
      <path d="M12 12.3a2.3 2.3 0 1 0 0-4.6 2.3 2.3 0 0 0 0 4.6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function ContactInfoCard({
  href,
  icon,
  title,
  detail,
  subtitle,
}: {
  href?: string;
  icon: ReactNode;
  title: string;
  detail: string;
  subtitle: string;
}) {
  const className =
    "block rounded-xl bg-white p-6 shadow-[0_2px_8px_rgb(0_0_0_/_6%)] transition hover:-translate-y-0.5 hover:shadow-[0_4px_16px_rgb(0_0_0_/_10%)]";
  const content = (
    <>
      <span className="text-[var(--color-gold)]">{icon}</span>
      <h2 className="mt-4 text-lg font-semibold text-[var(--color-navy)]">{title}</h2>
      <p className="mt-2 text-[15px] text-[var(--color-navy)]/60">{detail}</p>
      <p className="mt-1 text-[13px] text-[var(--color-navy)]/40">{subtitle}</p>
    </>
  );

  return href ? (
    <a className={className} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined}>
      {content}
    </a>
  ) : (
    <div className={className}>{content}</div>
  );
}

export default async function ContactPage() {
  const settings = await getPublicSettings();
  const whatsappNumber = settings.whatsappNumber || "201096586292";
  const email = settings.email || "admin@jacktoursluxor.com";
  const address = settings.address || "Luxor, Upper Egypt";
  const mapLocation = settings.contactMapLocation || address || "Luxor, Egypt";
  const mapZoom = settings.contactMapZoom || 12;
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapLocation)}&z=${mapZoom}&output=embed`;

  return (
    <>
      <section className="relative grid h-[220px] place-items-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/luxor-temple.jpg"
          alt="Luxor Temple in Egypt"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(0_0_0_/_50%)]" />
        <div className="relative px-5">
          <p className="eyebrow text-[var(--color-gold-light)]">Get In Touch</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">Contact Us</h1>
          <p className="mt-3 text-base text-white/70">We reply within 24 hours</p>
        </div>
      </section>

      <section className="bg-[var(--color-ivory)] py-14 md:py-20">
        <div className="container-premium grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="grid gap-4">
            <ContactInfoCard
              href={buildWhatsAppUrlForNumber("Hello Jack Luxor Tour, I would like to ask about a private Egypt trip.", whatsappNumber)}
              icon={<MessageCircleIcon />}
              title="WhatsApp"
              detail={whatsappNumber}
              subtitle="Fastest way to reach us"
            />
            <ContactInfoCard
              href={`mailto:${email}`}
              icon={<MailIcon />}
              title="Email"
              detail={email}
              subtitle="We reply within 24 hours"
            />
            <ContactInfoCard
              icon={<MapPinIcon />}
              title="Visit Us"
              detail={address}
              subtitle="By appointment only"
            />
          </div>
          <ContactForm />
        </div>
      </section>

      {settings.contactMapVisible ? (
        <section className="bg-[var(--color-ivory)] py-14 md:py-20">
          <div className="container-premium">
            <div className="mb-6">
              <p className="eyebrow text-[var(--color-gold)]">Visit Us</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
                Find us in Luxor
              </h2>
            </div>
            <div className="overflow-hidden rounded-xl border border-[rgb(214_173_84_/_24%)] bg-white shadow-[0_18px_50px_rgb(87_59_22_/_9%)]">
              <iframe
                src={mapSrc}
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Google Map for ${mapLocation}`}
                className="h-[320px] w-full md:h-[450px]"
              />
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
