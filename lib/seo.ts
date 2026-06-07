import { createElement } from "react";

export const defaultSeo = {
  title: "Jack Tours Luxor | Luxury Egypt Private Tours",
  description:
    "Private tailor-made Egypt journeys, Luxor day tours, Nile cruises, and DMC services curated by local experts.",
  keywords: [
    "Luxor tours",
    "Egypt private tours",
    "Egypt travel agency",
    "Egypt DMC",
    "Nile cruise Egypt",
    "Luxor day tours",
    "Private Egypt tours",
    "Egypt itinerary planner",
  ],
};

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://jacktoursluxor.com";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: "Jack Tours Luxor",
    url: siteUrl,
    areaServed: ["Luxor", "Cairo", "Aswan", "Egypt"],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Luxor",
      addressCountry: "EG",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer support",
      availableLanguage: ["English", "Arabic"],
    },
  };
}

export function faqPageJsonLd(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export function touristTripJsonLd(tour: {
  title: string;
  shortDescription: string;
  slug: string;
  priceCurrency: string;
  priceFrom: number;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: tour.title,
    description: tour.shortDescription,
    url: `${siteUrl}/tours/${tour.slug}`,
    offers: tour.priceFrom
      ? {
          "@type": "Offer",
          priceCurrency: tour.priceCurrency,
          price: tour.priceFrom,
        }
      : undefined,
    provider: {
      "@type": "TravelAgency",
      name: "Jack Tours Luxor",
    },
  };
}

export function blogPostingJsonLd(article: {
  title: string;
  excerpt: string;
  slug: string;
  publishedAt: string;
  heroImage: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: article.title,
    description: article.excerpt,
    datePublished: article.publishedAt,
    image: article.heroImage,
    url: `${siteUrl}/blog/${article.slug}`,
    publisher: {
      "@type": "TravelAgency",
      name: "Jack Tours Luxor",
    },
  };
}

export function JsonLd({ data }: { data: object }) {
  return createElement("script", {
    type: "application/ld+json",
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  });
}
