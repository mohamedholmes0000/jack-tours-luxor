import type { Metadata } from "next";
import Link from "next/link";
import { getFaqsSafe } from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";
import { JsonLd, faqPageJsonLd } from "@/lib/seo";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers about booking private Luxor tours, Egypt itineraries, payment basics, safety, and custom trips with Jack Egypt Tour.",
};

export default async function FAQPage() {
  const [faqs, settings] = await Promise.all([getFaqsSafe(), getPublicSettings()]);
  const categories = Array.from(new Set(faqs.map((faq) => faq.category)));
  return (
    <>
      <JsonLd data={faqPageJsonLd(faqs)} />
      <section className="section-dark pattern-overlay py-20 text-white md:py-28">
        <div className="container-premium relative">
          <p className="eyebrow text-[var(--color-gold-light)]">FAQ</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Clear answers before you plan Egypt.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Practical guidance on booking, private tours, payments, safety, and custom itineraries.
          </p>
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium space-y-12">
          {categories.map((category) => (
            <div key={category}>
              <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">{category}</h2>
              <div className="mt-5 space-y-4">
                {faqs
                  .filter((item) => item.category === category)
                  .map((item, index) => (
                    <details key={item.question} className="border border-[rgb(214_173_84_/_24%)] bg-white/86 p-5 shadow-[0_12px_34px_rgb(87_59_22_/_7%)]" open={index === 0}>
                      <summary className="cursor-pointer font-serif text-2xl font-semibold text-[var(--color-navy)]">
                        {item.question}
                      </summary>
                      <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">{item.answer}</p>
                    </details>
                  ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-dark py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl font-semibold text-white">
            Still choosing the right Egypt plan?
          </h2>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link className="btn-secondary" href="/trip-planner">
              Trip Planner
            </Link>
            <a className="btn-primary" href={buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber)} target="_blank" rel="noreferrer">
              Ask on WhatsApp
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
