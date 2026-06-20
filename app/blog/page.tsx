import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { getBlogArticlesSafe } from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

export const metadata: Metadata = {
  title: "Egypt Travel Blog",
  description:
    "Practical Egypt travel articles from Jack Egypt Tour about Luxor, private tours, itinerary planning, and first-time travel.",
};

export default async function BlogPage() {
  const [blogArticles, settings] = await Promise.all([getBlogArticlesSafe(), getPublicSettings()]);
  return (
    <>
      <section className="section-dark pattern-overlay py-20 text-white md:py-28">
        <div className="container-premium relative">
          <p className="eyebrow text-[var(--color-gold-light)]">Blog</p>
          <h1 className="mt-5 max-w-4xl font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Practical notes for planning private Egypt travel.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/76">
            Simple, useful guidance for travelers comparing seasons, routes, and tour styles.
          </p>
        </div>
      </section>

      <section className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-7 md:grid-cols-2">
          {blogArticles.map((article) => (
            <article key={article.slug} className="overflow-hidden border border-[rgb(214_173_84_/_24%)] bg-white/86 shadow-[0_18px_50px_rgb(87_59_22_/_9%)]">
              <Link href={`/blog/${article.slug}`} className="relative block aspect-[16/10] overflow-hidden">
                <Image
                  src={article.heroImage}
                  alt={article.title}
                  fill
                  sizes="(min-width: 768px) 50vw, 100vw"
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </Link>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold)]">
                  {article.readTime}
                </p>
                <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                  <Link href={`/blog/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">{article.excerpt}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-dark py-16">
        <div className="container-premium flex flex-col justify-between gap-8 md:flex-row md:items-center">
          <h2 className="max-w-2xl font-serif text-4xl font-semibold text-white">
            Have a specific Egypt planning question?
          </h2>
          <a className="btn-primary" href={buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber)} target="_blank" rel="noreferrer">
            Ask on WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
