import {
  blogArticles,
  destinations,
  faqs,
  galleryImages,
  tours,
  type BlogArticle,
  type Destination,
  type GalleryImage,
  type Tour,
} from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import { safeImageSrc } from "@/lib/images";

function mapTour(tour: Awaited<ReturnType<typeof prisma.tour.findMany>>[number]): Tour {
  return {
    slug: tour.slug,
    title: tour.title,
    category: tour.category,
    shortDescription: tour.shortDescription,
    overview: tour.overview,
    highlights: tour.highlights,
    duration: tour.duration,
    groupSize: tour.groupSize,
    departurePoint: tour.departurePoint ?? "Flexible",
    languages: tour.languages,
    priceFrom: tour.priceFrom ?? 0,
    priceCurrency: tour.priceCurrency,
    included: tour.included,
    excluded: tour.excluded,
    itinerary: Array.isArray(tour.itinerary)
      ? (tour.itinerary as Array<{ title: string; description: string }>)
      : [],
    heroImage: safeImageSrc(tour.heroImage, tours[0].heroImage),
    images: tour.images.length
      ? tour.images.map((image) => safeImageSrc(image, tours[0].heroImage))
      : [safeImageSrc(tour.heroImage, tours[0].heroImage)],
    featured: tour.featured,
  };
}

function mapDestination(
  destination: Awaited<ReturnType<typeof prisma.destination.findMany>>[number],
): Destination {
  const fallbackDestination =
    destinations.find((item) => item.slug === destination.slug) ?? destinations[0];

  return {
    slug: destination.slug,
    name: destination.name,
    overview: destination.overview,
    description: fallbackDestination.description,
    bestTime: fallbackDestination.bestTime,
    duration: fallbackDestination.duration,
    region: fallbackDestination.region,
    coverImage: safeImageSrc(destination.heroImage, fallbackDestination.coverImage),
    highlights: destination.highlights.length
      ? destination.highlights.map((title, index) => {
          const fallbackHighlight =
            fallbackDestination.highlights[index] ?? fallbackDestination.highlights[0];

          return {
            title,
            image: fallbackHighlight.image,
            description: fallbackHighlight.description,
          };
        })
      : fallbackDestination.highlights,
    heroImage: safeImageSrc(destination.heroImage, destinations[0].heroImage),
  };
}

function mapBlogPost(post: Awaited<ReturnType<typeof prisma.blogPost.findMany>>[number]): BlogArticle {
  const content = Array.isArray(post.content)
    ? (post.content as Array<{ heading: string; body: string }>)
    : [];
  const contentText = post.contentText?.trim();

  return {
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    publishedAt: post.createdAt.toISOString().slice(0, 10),
    readTime: "4 min read",
    heroImage: safeImageSrc(post.heroImage, blogArticles[0].heroImage),
    sections: contentText
      ? [{ heading: post.title, body: contentText }]
      : content.length
        ? content
        : [{ heading: post.title, body: post.excerpt }],
  };
}

export async function getToursSafe() {
  return tryDatabase(
    async () => {
      const dbTours = await prisma.tour.findMany({
        where: { published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });
      return dbTours.length ? dbTours.map(mapTour) : tours;
    },
    tours,
  );
}

export async function getDestinationsSafe() {
  return tryDatabase(
    async () => {
      const dbDestinations = await prisma.destination.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
      return dbDestinations.length ? dbDestinations.map(mapDestination) : destinations;
    },
    destinations,
  );
}

export async function getBlogArticlesSafe() {
  return tryDatabase(
    async () => {
      const posts = await prisma.blogPost.findMany({
        where: { published: true },
        orderBy: { createdAt: "desc" },
      });
      return posts.length ? posts.map(mapBlogPost) : blogArticles;
    },
    blogArticles,
  );
}

export async function getFaqsSafe() {
  return tryDatabase(
    async () => {
      const dbFaqs = await prisma.fAQ.findMany({ where: { active: true }, orderBy: [{ category: "asc" }, { order: "asc" }] });
      return dbFaqs.length
        ? dbFaqs.map((faq) => ({
            category: faq.category as (typeof faqs)[number]["category"],
            question: faq.question,
            answer: faq.answer,
          }))
        : faqs;
    },
    faqs,
  );
}

export async function getGalleryImagesSafe(): Promise<GalleryImage[]> {
  return tryDatabase(
    async () => {
      const images = await prisma.galleryImage.findMany({ orderBy: { order: "asc" } });
      return images.length
        ? images.map((image) => ({
            url: safeImageSrc(image.url, galleryImages[0].url),
            alt: image.alt,
            title: image.alt,
            description:
              image.category === "Experiences"
                ? "A private Egypt travel moment from the gallery."
                : `A ${image.category ?? "Egypt"} gallery image from Jack Egypt Tour.`,
            category: (image.category ?? "Experiences") as GalleryImage["category"],
          }))
        : galleryImages;
    },
    galleryImages,
  );
}
