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
import { safeImageSrc } from "@/lib/images";

const cityNames = ["Luxor", "Aswan", "Cairo", "Hurghada", "Abu Simbel", "Red Sea"];
export type PublicContentType = "TOUR" | "ACTIVITY" | "HOTEL";

const demoActivities: Tour[] = [
  {
    contentType: "ACTIVITY",
    slug: "demo-hot-air-balloon-ride-luxor",
    title: "Hot Air Balloon Ride in Luxor",
    category: "Activity",
    shortDescription: "Rise above Luxor's west bank at sunrise with private transfer coordination.",
    overview: "A polished sunrise activity over Luxor's temples, farms, and desert edge.",
    highlights: ["Sunrise balloon ride", "West Bank views", "Private transfer support"],
    duration: "3 hours",
    city: "Luxor",
    rating: 4.9,
    reviewCount: 18,
    groupSize: "Shared balloon",
    departurePoint: "Luxor hotel or Nile cruise",
    languages: ["English", "Arabic"],
    priceFrom: 95,
    priceCurrency: "USD",
    included: ["Pickup coordination", "Balloon ride", "Local support"],
    excluded: ["Meals", "Personal expenses"],
    itinerary: [],
    heroImage: "/photos/valley-of-kings.jpg",
    images: ["/photos/valley-of-kings.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-felucca-ride-on-the-nile",
    title: "Felucca Ride on the Nile",
    category: "Activity",
    shortDescription: "A quiet private felucca sail for soft Nile light and relaxed pacing.",
    overview: "A calm sailing experience on the Nile, arranged around golden hour where possible.",
    highlights: ["Private felucca", "Golden hour sailing", "Flexible timing"],
    duration: "2 hours",
    city: "Aswan",
    rating: 4.8,
    reviewCount: 14,
    groupSize: "Private",
    departurePoint: "Aswan corniche",
    languages: ["English", "Arabic"],
    priceFrom: 45,
    priceCurrency: "USD",
    included: ["Felucca", "Local coordination"],
    excluded: ["Meals", "Transfers unless requested"],
    itinerary: [],
    heroImage: "/photos/felucca.jpg",
    images: ["/photos/felucca.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-sound-and-light-show",
    title: "Sound & Light Show",
    category: "Activity",
    shortDescription: "An atmospheric evening at Egypt's monuments with smooth transfer planning.",
    overview: "A classic evening experience with comfortable logistics and local timing advice.",
    highlights: ["Evening monument show", "Transfer coordination", "Flexible add-ons"],
    duration: "2 hours",
    city: "Luxor",
    rating: 4.7,
    reviewCount: 11,
    groupSize: "Private arrangements",
    departurePoint: "Luxor hotel or cruise",
    languages: ["English", "Arabic"],
    priceFrom: 55,
    priceCurrency: "USD",
    included: ["Planning support", "Transfer coordination"],
    excluded: ["Show tickets", "Meals"],
    itinerary: [],
    heroImage: "/photos/karnak.jpg",
    images: ["/photos/karnak.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-private-airport-transfer",
    title: "Private Airport Transfer",
    category: "Activity",
    shortDescription: "A calm arrival or departure transfer with WhatsApp coordination.",
    overview: "A simple, private transfer option for airports, hotels, and Nile cruise docks.",
    highlights: ["Private vehicle", "WhatsApp timing", "Airport meet-and-assist"],
    duration: "1 hour",
    city: "Egypt",
    rating: 4.9,
    reviewCount: 22,
    groupSize: "Private",
    departurePoint: "Airport or hotel",
    languages: ["English", "Arabic"],
    priceFrom: 35,
    priceCurrency: "USD",
    included: ["Private vehicle", "Driver coordination"],
    excluded: ["Extra stops", "Tips"],
    itinerary: [],
    heroImage: "/photos/luxor-temple.jpg",
    images: ["/photos/luxor-temple.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-desert-safari-experience",
    title: "Desert Safari Experience",
    category: "Activity",
    shortDescription: "A guided desert outing with warm light, viewpoints, and flexible pacing.",
    overview: "A scenic desert activity arranged with local operators and careful timing.",
    highlights: ["Desert drive", "Viewpoints", "Local support"],
    duration: "Half day",
    city: "Hurghada",
    rating: 4.8,
    reviewCount: 16,
    groupSize: "Private or small group",
    departurePoint: "Hotel pickup",
    languages: ["English", "Arabic"],
    priceFrom: 75,
    priceCurrency: "USD",
    included: ["Pickup", "Safari coordination"],
    excluded: ["Meals unless requested"],
    itinerary: [],
    heroImage: "/photos/red-sea.jpg",
    images: ["/photos/red-sea.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-local-food-experience",
    title: "Local Food Experience",
    category: "Activity",
    shortDescription: "Taste everyday Egyptian favorites with a local-led, easygoing route.",
    overview: "A friendly food-led activity designed around comfort, timing, and trusted stops.",
    highlights: ["Local dishes", "Trusted stops", "Private pacing"],
    duration: "3 hours",
    city: "Cairo",
    rating: 4.8,
    reviewCount: 13,
    groupSize: "Private",
    departurePoint: "Central meeting point",
    languages: ["English", "Arabic"],
    priceFrom: 60,
    priceCurrency: "USD",
    included: ["Local host", "Planning support"],
    excluded: ["Food bill unless requested"],
    itinerary: [],
    heroImage: "/photos/alexandria.jpg",
    images: ["/photos/alexandria.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-nile-sunset-sailing",
    title: "Nile Sunset Sailing",
    category: "Activity",
    shortDescription: "A soft sunset sail with simple pickup coordination and unrushed timing.",
    overview: "An elegant Nile moment for travelers who want a calm break between sightseeing.",
    highlights: ["Sunset timing", "Nile sailing", "Private coordination"],
    duration: "2 hours",
    city: "Luxor",
    rating: 4.9,
    reviewCount: 17,
    groupSize: "Private",
    departurePoint: "Luxor riverfront",
    languages: ["English", "Arabic"],
    priceFrom: 50,
    priceCurrency: "USD",
    included: ["Sailing coordination", "Local support"],
    excluded: ["Meals", "Transfers unless requested"],
    itinerary: [],
    heroImage: "/photos/nile.jpg",
    images: ["/photos/nile.jpg"],
    featured: true,
  },
  {
    contentType: "ACTIVITY",
    slug: "demo-abu-simbel-day-activity",
    title: "Abu Simbel Day Activity",
    category: "Activity",
    shortDescription: "A carefully timed southern extension to one of Egypt's great icons.",
    overview: "A long but rewarding day activity planned with early timing and private logistics.",
    highlights: ["Abu Simbel timing", "Private transfer option", "Southern Egypt planning"],
    duration: "Full day",
    city: "Abu Simbel",
    rating: 4.9,
    reviewCount: 19,
    groupSize: "Private",
    departurePoint: "Aswan hotel or cruise",
    languages: ["English", "Arabic"],
    priceFrom: 165,
    priceCurrency: "USD",
    included: ["Transfer planning", "Local support"],
    excluded: ["Entrance fees", "Meals"],
    itinerary: [],
    heroImage: "/photos/abu-simbel.jpg",
    images: ["/photos/abu-simbel.jpg"],
    featured: true,
  },
];

const demoHotels: Tour[] = [
  {
    contentType: "HOTEL",
    slug: "demo-luxury-nile-view-hotel-luxor",
    title: "Luxury Nile View Hotel Luxor",
    category: "Hotel",
    shortDescription: "A refined Luxor stay with Nile views and easy access to the west bank.",
    overview: "A polished hotel option for travelers who want comfort between private touring days.",
    highlights: ["Nile view", "Luxor access", "Premium comfort"],
    duration: "Per night",
    city: "Luxor",
    rating: 4.8,
    reviewCount: 21,
    groupSize: "Rooms on request",
    departurePoint: "Luxor",
    languages: ["English", "Arabic"],
    priceFrom: 140,
    priceCurrency: "USD",
    included: ["Hotel coordination"],
    excluded: ["City taxes", "Extras"],
    itinerary: [],
    heroImage: "/photos/nile.jpg",
    images: ["/photos/nile.jpg"],
    featured: true,
  },
  {
    contentType: "HOTEL",
    slug: "demo-boutique-hotel-downtown-cairo",
    title: "Boutique Hotel in Downtown Cairo",
    category: "Hotel",
    shortDescription: "A characterful Cairo base for museums, food, and city touring.",
    overview: "A city stay option for travelers who prefer atmosphere and central access.",
    highlights: ["Central Cairo", "Boutique feel", "City access"],
    duration: "Per night",
    city: "Cairo",
    rating: 4.7,
    reviewCount: 15,
    groupSize: "Rooms on request",
    departurePoint: "Cairo",
    languages: ["English", "Arabic"],
    priceFrom: 125,
    priceCurrency: "USD",
    included: ["Hotel coordination"],
    excluded: ["City taxes", "Extras"],
    itinerary: [],
    heroImage: "/photos/pyramids.jpg",
    images: ["/photos/pyramids.jpg"],
    featured: true,
  },
  {
    contentType: "HOTEL",
    slug: "demo-aswan-nubian-stay",
    title: "Aswan Nubian Stay",
    category: "Hotel",
    shortDescription: "A warm Nubian-style stay with color, river calm, and southern character.",
    overview: "A softer Aswan stay for travelers who want local texture and quiet pacing.",
    highlights: ["Nubian character", "Aswan calm", "River atmosphere"],
    duration: "Per night",
    city: "Aswan",
    rating: 4.8,
    reviewCount: 12,
    groupSize: "Rooms on request",
    departurePoint: "Aswan",
    languages: ["English", "Arabic"],
    priceFrom: 95,
    priceCurrency: "USD",
    included: ["Stay coordination"],
    excluded: ["Meals unless requested"],
    itinerary: [],
    heroImage: "/photos/aswan.jpg",
    images: ["/photos/aswan.jpg"],
    featured: true,
  },
  {
    contentType: "HOTEL",
    slug: "demo-red-sea-beach-resort",
    title: "Red Sea Beach Resort",
    category: "Hotel",
    shortDescription: "A coastal finale with beach time, clear water, and easy decompression.",
    overview: "A Red Sea stay option for travelers ending an Egypt itinerary with rest.",
    highlights: ["Beach resort", "Red Sea water", "Relaxed finale"],
    duration: "Per night",
    city: "Hurghada",
    rating: 4.7,
    reviewCount: 20,
    groupSize: "Rooms on request",
    departurePoint: "Hurghada",
    languages: ["English", "Arabic"],
    priceFrom: 160,
    priceCurrency: "USD",
    included: ["Resort coordination"],
    excluded: ["Resort extras"],
    itinerary: [],
    heroImage: "/photos/hurghada.jpg",
    images: ["/photos/hurghada.jpg"],
    featured: true,
  },
  {
    contentType: "HOTEL",
    slug: "demo-nile-cruise-floating-hotel",
    title: "Nile Cruise Floating Hotel",
    category: "Hotel",
    shortDescription: "A floating stay between Luxor and Aswan with temple days built around it.",
    overview: "A cruise-as-hotel option for travelers who want route, rest, and river views together.",
    highlights: ["Floating hotel", "Luxor to Aswan", "River views"],
    duration: "3 nights",
    city: "Luxor",
    rating: 4.8,
    reviewCount: 18,
    groupSize: "Cabins on request",
    departurePoint: "Luxor or Aswan",
    languages: ["English", "Arabic"],
    priceFrom: 420,
    priceCurrency: "USD",
    included: ["Cruise coordination"],
    excluded: ["Optional excursions"],
    itinerary: [],
    heroImage: "/photos/felucca.jpg",
    images: ["/photos/felucca.jpg"],
    featured: true,
  },
  {
    contentType: "HOTEL",
    slug: "demo-private-desert-lodge-experience",
    title: "Private Desert Lodge Experience",
    category: "Hotel",
    shortDescription: "A quiet desert lodge concept for travelers seeking stillness and stars.",
    overview: "A special stay idea for slower custom routes beyond the classic circuit.",
    highlights: ["Desert lodge", "Quiet pacing", "Custom route"],
    duration: "Per night",
    city: "Egypt",
    rating: 4.9,
    reviewCount: 9,
    groupSize: "Private arrangements",
    departurePoint: "Custom route",
    languages: ["English", "Arabic"],
    priceFrom: 210,
    priceCurrency: "USD",
    included: ["Stay coordination"],
    excluded: ["Transfers unless requested"],
    itinerary: [],
    heroImage: "/photos/hatshepsut.jpg",
    images: ["/photos/hatshepsut.jpg"],
    featured: true,
  },
];

function fallbackContentForType(contentType: PublicContentType) {
  if (contentType === "ACTIVITY") return demoActivities;
  if (contentType === "HOTEL") return demoHotels;
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
  return {
    contentType: tour.contentType ?? "TOUR",
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
          contentType: "TOUR",
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
            question: faq.question,
            answer: faq.answer,
          }))
        : faqs;
    },
    faqs,
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
        : `A curated ${category} album from private Jack Egypt Tour journeys.`,
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
    alt: image.alt,
    title: image.title || image.alt,
    caption: image.caption || undefined,
    description:
      image.description ||
      image.caption ||
      (category === "Experiences"
        ? "A private Egypt travel moment from the gallery."
        : `A ${category} gallery image from Jack Egypt Tour.`),
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
                album.description ||
                (category === "Experiences"
                  ? "Private moments, ancient places, and Nile light captured across Egypt."
                  : `A curated ${category} album from private Jack Egypt Tour journeys.`),
              imageCount: images.length,
              images,
              slug: album.slug,
              title: album.title,
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
