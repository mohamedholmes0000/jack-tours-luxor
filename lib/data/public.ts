import {
  blogArticles,
  destinations,
  faqs,
  galleryImages,
  homepageCityDestinations,
  tours,
  type BlogArticle,
  type Destination,
  type GalleryImage,
  type HomepageCityDestination,
  type Tour,
} from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import { safeImageSrc } from "@/lib/images";

const cityNames = ["Luxor", "Aswan", "Cairo", "Hurghada", "Abu Simbel", "Red Sea"];

const destinationTypeLabels = {
  CITY: "City",
  SITE: "Archaeological Site",
  COASTAL: "Coastal / Beach",
  RIVER_ROUTE: "River / Cruise Route",
} as const;

function destinationTypeLabel(type?: string | null): Destination["type"] {
  if (
    type === "City" ||
    type === "Archaeological Site" ||
    type === "Coastal / Beach" ||
    type === "River / Cruise Route"
  ) {
    return type;
  }

  return (
    destinationTypeLabels[type as keyof typeof destinationTypeLabels] ??
    "Archaeological Site"
  );
}

function inferTourCity(parts: string[]) {
  const haystack = parts.join(" ").toLowerCase();
  return cityNames.find((city) => haystack.includes(city.toLowerCase())) ?? "Luxor";
}

function mapTour(tour: Awaited<ReturnType<typeof prisma.tour.findMany>>[number]): Tour {
  return {
    slug: tour.slug,
    title: tour.title,
    category: tour.category,
    shortDescription: tour.shortDescription,
    overview: tour.overview,
    highlights: tour.highlights,
    duration: tour.duration,
    city: tour.city ?? inferTourCity([
      tour.title,
      tour.category,
      tour.shortDescription,
      tour.overview,
      tour.departurePoint ?? "",
    ]),
    rating: tour.rating ?? 0,
    reviewCount: tour.reviewCount ?? 0,
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
    region: destination.region ?? fallbackDestination.region,
    type: destinationTypeLabel(destination.type ?? fallbackDestination.type),
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

export type HomepageCityDestinationCard = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  countLabel: string;
};

type DbCityDestination = {
  slug: string;
  name: string;
  subtitle: string | null;
  heroImage: string | null;
};

function normalizeCityTerm(value: string) {
  return value.trim().toLowerCase().replace(/&/g, "and");
}

function countStaticToursByCity(city: string) {
  const normalizedCity = normalizeCityTerm(city);

  if (!normalizedCity) {
    return 0;
  }

  return tours.filter((tour) => normalizeCityTerm(tour.city || "") === normalizedCity).length;
}

export async function getTourCountByCity(city: string): Promise<number> {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    return 0;
  }

  return tryDatabase(
    async () =>
      prisma.tour.count({
        where: {
          published: true,
          city: {
            equals: trimmedCity,
            mode: "insensitive",
          },
        },
      }),
    countStaticToursByCity(trimmedCity),
  );
}

function tourCountLabel(count: number) {
  if (count <= 0) {
    return "Coming soon";
  }

  return `${count} ${count === 1 ? "Tour" : "Tours"}`;
}

async function buildCityCards(source: HomepageCityDestination[]): Promise<HomepageCityDestinationCard[]> {
  return Promise.all(
    source.map(async (city) => ({
      slug: city.slug,
      name: city.name,
      subtitle: city.subtitle,
      image: city.image,
      href: city.href,
      countLabel: tourCountLabel(await getTourCountByCity(city.name)),
    })),
  );
}

export async function getHomepageCityDestinationsSafe() {
  const fallbackCards = await buildCityCards(homepageCityDestinations);

  return tryDatabase(
    async () => {
      const destinationCityColumns = await prisma.$queryRaw<Array<{ column_name: string }>>`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_name = 'Destination' AND column_name IN ('type', 'subtitle')
      `;

      const availableColumns = new Set(destinationCityColumns.map((column) => column.column_name));

      if (!availableColumns.has("type") || !availableColumns.has("subtitle")) {
        return fallbackCards;
      }

      const dbCities = await prisma.$queryRaw<DbCityDestination[]>`
        SELECT "slug", "name", "subtitle", "heroImage"
        FROM "Destination"
        WHERE "published" = true AND "type" = 'CITY'
        ORDER BY "createdAt" ASC
      `;

      if (!dbCities.length) {
        return fallbackCards;
      }

      const dbCitiesBySlug = new Map(dbCities.map((city) => [city.slug, city]));

      return Promise.all(homepageCityDestinations.map(async (fallbackCity) => {
        const city = dbCitiesBySlug.get(fallbackCity.slug);
        const name = city?.name || fallbackCity.name;
        const count = await getTourCountByCity(name);

        return {
          slug: fallbackCity.slug,
          name,
          subtitle: city?.subtitle || fallbackCity.subtitle,
          image: safeImageSrc(city?.heroImage, fallbackCity.image),
          href: fallbackCity.href,
          countLabel: tourCountLabel(count),
        };
      }));
    },
    fallbackCards,
  );
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

export type DestinationListingItem = Destination & {
  tourCount: number;
};

export async function getDestinationListingSafe() {
  const destinationList = await getDestinationsSafe();

  return Promise.all(
    destinationList.map(async (destination) => ({
      ...destination,
      tourCount: await getTourCountByCity(destination.name),
    })),
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
      const images = await prisma.galleryImage.findMany({ where: { active: true }, orderBy: { order: "asc" } });
      return images.length
        ? images.map((image) => ({
            url: safeImageSrc(image.url, galleryImages[0].url),
            alt: image.alt,
            title: image.title || image.alt,
            description:
              image.description ||
              image.caption ||
              (image.category === "Experiences"
                ? "A private Egypt travel moment from the gallery."
                : `A ${image.category ?? "Egypt"} gallery image from Jack Egypt Tour.`),
            category: (image.category ?? "Experiences") as GalleryImage["category"],
          }))
        : galleryImages;
    },
    galleryImages,
  );
}
