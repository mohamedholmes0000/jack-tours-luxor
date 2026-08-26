import {
  blogArticles,
  destinations,
  faqs,
  galleryImages,
  homepageCityDestinations,
  tours,
  type BlogArticle,
  type Destination,
  type GalleryAlbum,
  type GalleryImage,
  type HomepageCityDestination,
  type Tour,
} from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import {
  customizeTripSiteSettingKeys,
  mapHomepageSettingsToEditorValues,
  type HomepageEditorValues,
} from "@/lib/homepage-settings";
import { replaceLegacyBrandText } from "@/lib/brand";
import { safeImageSrc } from "@/lib/images";

const cityNames = ["Luxor", "Aswan", "Cairo", "Hurghada", "Abu Simbel", "Red Sea"];
export type PublicContentType = "TOUR" | "ACTIVITY" | "HOTEL";

function fallbackContentForType(contentType: PublicContentType) {
  // Activities and hotels only appear once the owner has published real records.
  // The static tour fallback remains available for the established Tours catalog.
  if (contentType === "ACTIVITY" || contentType === "HOTEL") return [];
  return tours.filter((tour) => (tour.contentType ?? "TOUR") === "TOUR");
}

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
  const heroImage = safeImageSrc(tour.heroImage);

  return {
    contentType: tour.contentType ?? "TOUR",
    slug: tour.slug,
    title: replaceLegacyBrandText(tour.title),
    category: replaceLegacyBrandText(tour.category),
    shortDescription: replaceLegacyBrandText(tour.shortDescription),
    overview: replaceLegacyBrandText(tour.overview),
    highlights: tour.highlights.map(replaceLegacyBrandText),
    duration: replaceLegacyBrandText(tour.duration),
    city: tour.city ?? inferTourCity([
      tour.title,
      tour.category,
      tour.shortDescription,
      tour.overview,
      tour.departurePoint ?? "",
    ]),
    rating: tour.rating ?? 0,
    reviewCount: tour.reviewCount ?? 0,
    groupSize: replaceLegacyBrandText(tour.groupSize),
    departurePoint: replaceLegacyBrandText(tour.departurePoint ?? "Flexible"),
    languages: tour.languages.map(replaceLegacyBrandText),
    priceFrom: tour.priceFrom ?? 0,
    priceCurrency: tour.priceCurrency,
    included: tour.included,
    excluded: tour.excluded,
    itinerary: Array.isArray(tour.itinerary)
      ? (tour.itinerary as Array<{ title: string; description: string }>).map((item) => ({
          title: replaceLegacyBrandText(item.title),
          description: replaceLegacyBrandText(item.description),
        }))
      : [],
    heroImage,
    images: tour.images.length
      ? tour.images.map((image) => safeImageSrc(image, heroImage))
      : [heroImage],
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
    name: replaceLegacyBrandText(destination.name),
    overview: replaceLegacyBrandText(destination.overview),
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
            title: replaceLegacyBrandText(title),
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
    title: replaceLegacyBrandText(post.title),
    excerpt: replaceLegacyBrandText(post.excerpt),
    publishedAt: post.createdAt.toISOString().slice(0, 10),
    readTime: "4 min read",
    heroImage: safeImageSrc(post.heroImage, blogArticles[0].heroImage),
    sections: contentText
      ? [{ heading: replaceLegacyBrandText(post.title), body: replaceLegacyBrandText(contentText) }]
      : content.length
        ? content.map((section) => ({
            heading: replaceLegacyBrandText(section.heading),
            body: replaceLegacyBrandText(section.body),
          }))
        : [{ heading: replaceLegacyBrandText(post.title), body: replaceLegacyBrandText(post.excerpt) }],
  };
}

export type HomepageCityDestinationCard = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  tourCount: number;
  activityCount: number;
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

function countStaticContentByCity(city: string, contentType: "TOUR" | "ACTIVITY") {
  const normalizedCity = normalizeCityTerm(city);

  if (!normalizedCity) {
    return 0;
  }

  return tours.filter(
    (tour) =>
      (tour.contentType ?? "TOUR") === contentType &&
      normalizeCityTerm(tour.city || "") === normalizedCity,
  ).length;
}

async function getPublishedContentCountByCity(
  city: string,
  contentType: "TOUR" | "ACTIVITY",
): Promise<number> {
  const trimmedCity = city.trim();

  if (!trimmedCity) {
    return 0;
  }

  return tryDatabase(
    async () =>
      prisma.tour.count({
        where: {
          contentType,
          published: true,
          city: {
            equals: trimmedCity,
            mode: "insensitive",
          },
        },
      }),
    countStaticContentByCity(trimmedCity, contentType),
  );
}

export function getTourCountByCity(city: string): Promise<number> {
  return getPublishedContentCountByCity(city, "TOUR");
}

export function getActivityCountByCity(city: string): Promise<number> {
  return getPublishedContentCountByCity(city, "ACTIVITY");
}

async function buildCityCards(source: HomepageCityDestination[]): Promise<HomepageCityDestinationCard[]> {
  return Promise.all(
    source.map(async (city) => {
      const [tourCount, activityCount] = await Promise.all([
        getTourCountByCity(city.name),
        getActivityCountByCity(city.name),
      ]);

      return {
        slug: city.slug,
        name: city.name,
        subtitle: city.subtitle,
        image: city.image,
        href: city.href,
        tourCount,
        activityCount,
      };
    }),
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
        const [tourCount, activityCount] = await Promise.all([
          getTourCountByCity(name),
          getActivityCountByCity(name),
        ]);

        return {
          slug: fallbackCity.slug,
          name,
          subtitle: city?.subtitle || fallbackCity.subtitle,
          image: safeImageSrc(city?.heroImage, fallbackCity.image),
          href: fallbackCity.href,
          tourCount,
          activityCount,
        };
      }));
    },
    fallbackCards,
  );
}

export async function getToursSafe(contentType: PublicContentType = "TOUR") {
  const fallbackTours = fallbackContentForType(contentType);

  return tryDatabase(
    async () => {
      const dbTours = await prisma.tour.findMany({
        where: { contentType, published: true },
        orderBy: [{ featured: "desc" }, { createdAt: "desc" }],
      });
      return dbTours.length ? dbTours.map(mapTour) : fallbackTours;
    },
    fallbackTours,
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
            question: replaceLegacyBrandText(faq.question),
            answer: replaceLegacyBrandText(faq.answer),
          }))
        : faqs;
    },
    faqs,
  );
}

export type PublicTestimonial = {
  id: string;
  name: string;
  location: string | null;
  rating: number;
  text: string;
  source: string | null;
};

export async function getTestimonialsSafe(): Promise<PublicTestimonial[]> {
  return tryDatabase(
    async () => {
      const dbTestimonials = await prisma.testimonial.findMany({
        where: { active: true },
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        take: 4,
      });

      return dbTestimonials.map((testimonial) => ({
        id: testimonial.id,
        name: replaceLegacyBrandText(testimonial.name),
        location: testimonial.country || testimonial.nationality
          ? replaceLegacyBrandText(testimonial.country || testimonial.nationality || "")
          : null,
        rating: testimonial.rating,
        text: replaceLegacyBrandText(testimonial.text),
        source: testimonial.source ? replaceLegacyBrandText(testimonial.source) : null,
      }));
    },
    [],
  );
}

export async function getGalleryImagesSafe(): Promise<GalleryImage[]> {
  const albums = await getGalleryAlbumsSafe();
  return albums.flatMap((album) => album.images);
}

function fallbackGalleryAlbums(): GalleryAlbum[] {
  const grouped = new Map<string, GalleryImage[]>();

  for (const image of galleryImages) {
    const category = image.category || "Experiences";
    grouped.set(category, [...(grouped.get(category) ?? []), image]);
  }

  return Array.from(grouped.entries()).map(([category, images]) => ({
    category,
    coverImage: images[0]?.url ?? galleryImages[0].url,
    description:
      category === "Experiences"
        ? "Private moments, ancient places, and Nile light captured across Egypt."
        : `A curated ${category} album from private Jack Luxor Tour journeys.`,
    imageCount: images.length,
    images,
    slug: category.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, ""),
    title: category === "Experiences" ? "Egypt Highlights" : `${category} Highlights`,
  }));
}

function mapGalleryImage(
  image: Awaited<ReturnType<typeof prisma.galleryImage.findMany>>[number],
  category: string,
): GalleryImage {
  return {
    id: image.id,
    url: safeImageSrc(image.url, galleryImages[0].url),
    alt: replaceLegacyBrandText(image.alt),
    title: replaceLegacyBrandText(image.title || image.alt),
    caption: image.caption ? replaceLegacyBrandText(image.caption) : undefined,
    description:
      (image.description ? replaceLegacyBrandText(image.description) : "") ||
      (image.caption ? replaceLegacyBrandText(image.caption) : "") ||
      (category === "Experiences"
        ? "A private Egypt travel moment from the gallery."
        : `A ${category} gallery image from Jack Luxor Tour.`),
    category,
    order: image.order,
  };
}

export async function getGalleryAlbumsSafe(): Promise<GalleryAlbum[]> {
  const fallbackAlbums = fallbackGalleryAlbums();

  return tryDatabase(
    async () => {
      const albums = await prisma.galleryAlbum.findMany({
        where: { active: true },
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        include: {
          category: true,
          images: {
            where: { active: true },
            orderBy: [{ order: "asc" }, { createdAt: "asc" }],
          },
        },
      });

      return albums.length
        ? albums.map((album) => {
            const category = album.category?.name || "Experiences";
            const images = album.images.map((image) => mapGalleryImage(image, category));

            return {
              id: album.id,
              category,
              coverImage: safeImageSrc(album.coverImage || images[0]?.url, galleryImages[0].url),
              description:
                (album.description ? replaceLegacyBrandText(album.description) : "") ||
                (category === "Experiences"
                  ? "Private moments, ancient places, and Nile light captured across Egypt."
                  : `A curated ${category} album from private Jack Luxor Tour journeys.`),
              imageCount: images.length,
              images,
              slug: album.slug,
              title: replaceLegacyBrandText(album.title),
            };
          })
        : fallbackAlbums;
    },
    fallbackAlbums,
  );
}

export async function getGalleryAlbumBySlugSafe(slug: string): Promise<GalleryAlbum | null> {
  const albums = await getGalleryAlbumsSafe();
  return albums.find((album) => album.slug === slug) ?? null;
}

export async function getHomepageSettingsSafe(): Promise<HomepageEditorValues> {
  return tryDatabase(
    async () => {
      const [settings, customizeTripRows] = await Promise.all([
        prisma.homepageSettings.findUnique({ where: { id: "homepage" } }),
        prisma.siteSetting.findMany({
          where: { key: { in: Object.values(customizeTripSiteSettingKeys) } },
        }),
      ]);
      const customizeTripSettings = customizeTripRows.reduce<Record<string, string>>((settingsMap, row) => {
        const matchingEntry = Object.entries(customizeTripSiteSettingKeys).find(([, key]) => key === row.key);
        if (matchingEntry) settingsMap[matchingEntry[0]] = row.value;
        return settingsMap;
      }, {});

      return mapHomepageSettingsToEditorValues({ ...settings, ...customizeTripSettings });
    },
    mapHomepageSettingsToEditorValues(null),
  );
}
