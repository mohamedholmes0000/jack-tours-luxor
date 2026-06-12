import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Jack Egypt Tour",
  description:
    "Learn about Jack Egypt Tour, a Luxor-based Egypt travel agency and DMC focused on private tours and international service standards.",
};

const values = [
  {
    eyebrow: "01",
    title: "Luxor-based",
    text: "We plan from the city where Egypt's archaeological days begin, not from a desk in another country.",
  },
  {
    eyebrow: "02",
    title: "Private by default",
    text: "Trusted guides, private vehicles, and pacing shaped around your interests, your dates, and your light.",
  },
  {
    eyebrow: "03",
    title: "On WhatsApp time",
    text: "Short inquiry flow, quick replies, and practical coordination before, during, and after travel.",
  },
  {
    eyebrow: "04",
    title: "Tailored, not templated",
    text: "Day tours, Nile cruises, and multi-day routes composed for you, not pulled from a catalog.",
  },
];

const stats = [
  ["10+", "Years"],
  ["1,000+", "Travelers"],
  ["50+", "Routes"],
  ["24/7", "Support"],
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="relative grid h-[220px] place-items-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/hatshepsut.jpg"
          alt="Temple of Hatshepsut in Luxor"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgb(0_0_0_/_50%)]" />
        <div className="relative px-5">
          <p className="eyebrow text-[var(--color-gold-light)]">Our Story</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">Jack Egypt Tour</h1>
          <p className="mt-3 text-base text-white/70">Luxor-based. Privately run.</p>
        </div>
      </section>

      <section className="bg-[var(--color-ivory)] py-14 text-[var(--color-navy)] md:py-20">
        <div className="container-premium grid gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:items-center lg:gap-14">
          <div>
            <p className="eyebrow text-[var(--color-gold-dark)]">Who We Are</p>
            <h2 className="mt-4 text-3xl font-bold leading-tight md:text-[2.6rem]">
              A Luxor team, quietly capable.
            </h2>
            <div className="mt-6 space-y-5 text-base leading-[1.7] text-[var(--color-navy)]/80">
              <p>
                Jack Egypt Tour is a Luxor-based team arranging private Egypt travel with local
                knowledge, calm communication, and polished delivery.
              </p>
              <p>
                We arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to
                Aswan, dawn at Abu Simbel, and Red Sea finales. The work is practical and personal:
                clear timings, trusted guides, private vehicles, and responsive support.
              </p>
              <p>
                The goal is not to sell every possible package. It is to help each traveler choose
                the right route, the right guide, and the right pace.
              </p>
            </div>
          </div>
          <div className="relative aspect-[4/3] overflow-hidden rounded-xl shadow-[0_2px_8px_rgb(0_0_0_/_8%)] lg:aspect-[4/5]">
            <Image
              src="/photos/karnak.jpg"
              alt="Karnak Temple columns in Luxor"
              fill
              sizes="(min-width: 1024px) 48vw, 100vw"
              className="object-cover"
            />
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-navy)] py-14 text-white md:py-20">
        <div className="container-premium">
          <p className="eyebrow text-[var(--color-gold-light)]">How We Work</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-[2.6rem]">
            Premium travel standards with Egyptian warmth.
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {values.map((item) => (
              <article
                key={item.eyebrow}
                className="rounded-xl border border-[rgb(214_173_84_/_22%)] bg-white/[0.04] p-6"
              >
                <p className="text-3xl font-bold text-[var(--color-gold-light)]">{item.eyebrow}</p>
                <h3 className="mt-4 text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-white/70">{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[var(--color-ivory)] py-14 md:py-16">
        <div className="container-premium grid gap-6 text-center sm:grid-cols-2 lg:grid-cols-4">
          {stats.map(([value, label]) => (
            <div key={label} className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgb(0_0_0_/_5%)]">
              <p className="text-4xl font-bold text-[var(--color-gold-dark)]">{value}</p>
              <p className="mt-2 text-sm text-[var(--color-navy)]/60">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative isolate overflow-hidden bg-[var(--color-navy)] py-16 text-white md:py-20">
        <Image
          src="/photos/felucca.jpg"
          alt="Felucca sailing on the Nile"
          fill
          sizes="100vw"
          className="object-cover opacity-45"
        />
        <div className="absolute inset-0 bg-[rgb(6_17_31_/_70%)]" />
        <div className="container-premium relative flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <div>
            <p className="eyebrow text-[var(--color-gold-light)]">Start your booking</p>
            <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight md:text-[2.6rem]">
              Have questions? Let&apos;s talk.
            </h2>
          </div>
          <Link className="btn-primary" href="/trip-planner">
            Book Now
          </Link>
        </div>
      </section>
    </>
  );
}
