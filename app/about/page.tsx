import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/shared/section-heading";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "About Jack Egypt Tour",
  description:
    "Learn about Jack Egypt Tour, a Luxor-based Egypt travel agency and DMC focused on private tours and international service standards.",
};

const values = [
  ["Local depth", "Guiding and planning shaped by real Luxor knowledge, not a generic itinerary script."],
  ["Private comfort", "Flexible timing, trusted drivers, and calm communication for travelers who value ease."],
  ["Clear follow-up", "WhatsApp-first planning keeps questions, dates, and refinements practical."],
];

const trustItems = [
  "Luxor-based local operations",
  "Professional private guides and drivers",
  "Transparent inclusions and exclusions",
  "Practical support before and during travel",
];

export default function AboutPage() {
  return (
    <>
      <section className="relative min-h-[66vh] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src="/photos/hatshepsut.jpg"
          alt="Egyptian temple columns in warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.76)] to-[rgba(6,17,31,0.2)]" />
        <div className="container-premium relative flex min-h-[66vh] items-end py-16">
          <div className="max-w-4xl">
            <p className="eyebrow text-[var(--color-gold-light)]">About Jack Egypt Tour</p>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight md:text-7xl">
              Luxor-born expertise, <span className="italic text-[var(--color-gold-light)]">built for international travelers.</span>
            </h1>
          </div>
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <SectionHeading
            eyebrow="Company story"
            title="A local travel partner for travelers who want Egypt handled beautifully."
            description="Jack Egypt Tour was shaped around a simple idea: private Egypt travel should feel personal, polished, and grounded in local knowledge. From Luxor day tours to multi-city itineraries, the team focuses on practical planning, trusted people, and responsive support."
          />
          <div className="border border-[rgb(214_173_84_/_26%)] bg-white/78 p-8 shadow-[0_24px_70px_rgb(87_59_22_/_12%)]">
            <p className="font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">
              The goal is not to sell every possible package. It is to help each traveler choose the
              right route, the right guide, and the right pace.
            </p>
          </div>
        </div>
      </section>

      <section className="section-dark py-16 md:py-24">
        <div className="container-premium">
          <div className="[&_h2]:text-white [&_p]:text-white/70">
            <SectionHeading eyebrow="Mission and values" title="Premium travel standards with Egyptian warmth." />
          </div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {values.map(([title, text]) => (
              <div key={title} className="border border-[rgb(214_173_84_/_24%)] bg-white/[0.06] p-7">
                <h2 className="font-serif text-3xl font-semibold text-white">{title}</h2>
                <p className="mt-4 text-sm leading-7 text-white/68">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              eyebrow="Why trust us"
              title="A practical operating style for private travelers."
              description="Travel in Egypt is better when the details are clear. We prioritize reliable pickup information, honest inclusions, realistic timing, and guides who can match the traveler in front of them."
            />
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {trustItems.map((item) => (
                <div key={item} className="border border-[rgb(214_173_84_/_24%)] bg-white/82 p-5 text-sm font-semibold leading-7 text-[var(--color-gray-900)]">
                  {item}
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className="eyebrow">Local delivery</p>
            <div className="mt-4 grid gap-5">
              {["Operations lead", "Private guide network", "Guest support"].map((role) => (
                <div key={role} className="border border-[rgb(214_173_84_/_24%)] bg-white/82 p-6 shadow-[0_16px_45px_rgb(87_59_22_/_7%)]">
                  <h3 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">{role}</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
                    Profile details will be added in the CMS phase while the MVP keeps the public
                    trust message clean and practical.
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section-dark pattern-overlay py-16 text-white md:py-24">
        <div className="container-premium grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <p className="eyebrow text-[var(--color-gold-light)]">License, safety, professionalism</p>
            <h2 className="mt-4 font-serif text-4xl font-semibold md:text-5xl">
              Built around clear arrangements and responsible local delivery.
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/72">
              This MVP presents the service promise clearly while the next admin phase will allow
              the owner to update credentials, settings, and operating details without code.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col">
            <Link className="btn-primary" href="/trip-planner">
              Plan My Trip
            </Link>
            <a className="btn-ghost" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
              WhatsApp Us Now
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
