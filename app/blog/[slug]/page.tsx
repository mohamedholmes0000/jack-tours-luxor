import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogArticles } from "@/lib/content";
import { getBlogArticlesSafe } from "@/lib/data/public";
import { JsonLd, blogPostingJsonLd } from "@/lib/seo";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

type BlogDetailProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return blogArticles.map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: BlogDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getBlogArticlesSafe();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    return {};
  }

  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      title: article.title,
      description: article.excerpt,
      images: [article.heroImage],
    },
  };
}

export default async function BlogDetailPage({ params }: BlogDetailProps) {
  const { slug } = await params;
  const articles = await getBlogArticlesSafe();
  const article = articles.find((item) => item.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <JsonLd data={blogPostingJsonLd(article)} />
      <section className="relative min-h-[60vh] overflow-hidden bg-[var(--color-navy)] text-white">
        <Image
          src={article.heroImage}
          alt={article.title}
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-65"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06111f] via-[rgba(6,17,31,0.76)] to-[rgba(6,17,31,0.2)]" />
        <div className="container-premium relative flex min-h-[60vh] items-end py-16">
          <div className="max-w-4xl">
            <Link href="/blog" className="eyebrow text-[var(--color-gold-light)]">
              Blog
            </Link>
            <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight md:text-7xl">
              {article.title}
            </h1>
            <p className="mt-5 text-sm font-bold uppercase tracking-[0.14em] text-white/72">
              {article.readTime} / {article.publishedAt}
            </p>
          </div>
        </div>
      </section>

      <article className="section-ivory py-16 md:py-24">
        <div className="container-premium grid gap-12 lg:grid-cols-[minmax(0,760px)_320px]">
          <div className="space-y-10">
            <p className="font-serif text-3xl leading-snug text-[var(--color-navy)]">{article.excerpt}</p>
            {article.sections.map((section) => (
              <section key={section.heading}>
                <h2 className="font-serif text-4xl font-semibold text-[var(--color-navy)]">{section.heading}</h2>
                <p className="mt-4 text-base leading-8 text-[var(--color-gray-600)]">{section.body}</p>
              </section>
            ))}
          </div>
          <aside className="border border-[rgb(214_173_84_/_28%)] bg-white/88 p-6 shadow-[0_24px_70px_rgb(87_59_22_/_12%)] lg:self-start">
            <p className="eyebrow">
              Plan with a local team
            </p>
            <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
              Turn this advice into a private Egypt itinerary with WhatsApp-first planning.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link className="btn-secondary" href="/trip-planner">
                Trip Planner
              </Link>
              <a className="btn-primary" href={buildWhatsAppUrl()} target="_blank" rel="noreferrer">
                WhatsApp Us
              </a>
            </div>
          </aside>
        </div>
      </article>
    </>
  );
}
