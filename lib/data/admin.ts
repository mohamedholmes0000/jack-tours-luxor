import { blogArticles, destinations, tours } from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import { mapHomepageSettingsToEditorValues } from "@/lib/homepage-settings";
import { getPublicSettings } from "@/lib/data/settings";
import type {
  AdminBlogPostValues,
  AdminDestinationValues,
  AdminTourValues,
} from "@/lib/validations";

function destinationTypeValue(type: string): AdminDestinationValues["type"] {
  if (type === "City") return "CITY";
  if (type === "Coastal / Beach") return "COASTAL";
  if (type === "River / Cruise Route") return "RIVER_ROUTE";
  return "SITE";
}

export async function getAdminSummary() {
  return tryDatabase(
    async () => {
      const [tourCount, destinationCount, blogPostCount, newInquiryCount, recentInquiries] =
        await Promise.all([
          prisma.tour.count(),
          prisma.destination.count(),
          prisma.blogPost.count(),
          prisma.inquiry.count({ where: { status: "NEW" } }),
          prisma.inquiry.findMany({
            orderBy: { createdAt: "desc" },
            take: 5,
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              whatsapp: true,
              type: true,
              status: true,
              createdAt: true,
            },
          }),
        ]);

      return { tourCount, destinationCount, blogPostCount, newInquiryCount, recentInquiries };
    },
    {
      tourCount: tours.length,
      destinationCount: destinations.length,
      blogPostCount: blogArticles.length,
      newInquiryCount: 0,
      recentInquiries: [],
    },
  );
}

export async function getAdminTours() {
  return tryDatabase(
    async () => {
      const dbTours = await prisma.tour.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          title: true,
          category: true,
          shortDescription: true,
          duration: true,
          city: true,
          rating: true,
          reviewCount: true,
          groupSize: true,
          priceFrom: true,
          priceCurrency: true,
          heroImage: true,
          published: true,
          featured: true,
          createdAt: true,
        },
      });

      return dbTours.length
        ? dbTours
        : tours.map((tour) => ({
            id: tour.slug,
            slug: tour.slug,
            title: tour.title,
            category: tour.category,
            shortDescription: tour.shortDescription,
            duration: tour.duration,
            city: tour.city,
            rating: tour.rating,
            reviewCount: tour.reviewCount,
            groupSize: tour.groupSize,
            priceFrom: tour.priceFrom,
            priceCurrency: tour.priceCurrency,
            heroImage: tour.heroImage,
            published: true,
            featured: tour.featured,
            createdAt: new Date(),
          }));
    },
    tours.map((tour) => ({
      id: tour.slug,
      slug: tour.slug,
      title: tour.title,
      category: tour.category,
      shortDescription: tour.shortDescription,
      duration: tour.duration,
      city: tour.city,
      rating: tour.rating,
      reviewCount: tour.reviewCount,
      groupSize: tour.groupSize,
      priceFrom: tour.priceFrom,
      priceCurrency: tour.priceCurrency,
      heroImage: tour.heroImage,
      published: true,
      featured: tour.featured,
      createdAt: new Date(),
    })),
  );
}

export async function getAdminDestinations() {
  return tryDatabase(
    async () => {
      const dbDestinations = await prisma.destination.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          slug: true,
          name: true,
          subtitle: true,
          region: true,
          type: true,
          published: true,
          updatedAt: true,
        },
      });

      return dbDestinations.length
        ? dbDestinations
        : destinations.map((destination) => ({
            id: destination.slug,
            slug: destination.slug,
            name: destination.name,
            subtitle: destination.overview,
            region: destination.region,
            type: destinationTypeValue(destination.type),
            published: true,
            updatedAt: new Date(),
          }));
    },
    destinations.map((destination) => ({
      id: destination.slug,
      slug: destination.slug,
      name: destination.name,
      subtitle: destination.overview,
      region: destination.region,
      type: destinationTypeValue(destination.type),
      published: true,
      updatedAt: new Date(),
    })),
  );
}

export async function getAdminDestination(id: string): Promise<(AdminDestinationValues & { id: string }) | null> {
  return tryDatabase(
    async () => {
      const destination = await prisma.destination.findFirst({
        where: { OR: [{ id }, { slug: id }] },
      });

      if (destination) {
        return {
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          subtitle: destination.subtitle ?? "",
          region: destination.region ?? "",
          type: destination.type,
          heroImage: destination.heroImage ?? "",
          overview: destination.overview,
          highlights: destination.highlights,
          published: destination.published,
          metaTitle: destination.metaTitle ?? "",
          metaDescription: destination.metaDescription ?? "",
        };
      }

      const fallback = destinations.find((item) => item.slug === id);
      return fallback
        ? {
            id: fallback.slug,
            name: fallback.name,
            slug: fallback.slug,
            subtitle: fallback.overview,
            region: fallback.region,
            type: destinationTypeValue(fallback.type),
            heroImage: fallback.heroImage,
            overview: fallback.overview,
            highlights: fallback.highlights.map((highlight) => highlight.title),
            published: true,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    },
    (() => {
      const fallback = destinations.find((item) => item.slug === id);
      return fallback
        ? {
            id: fallback.slug,
            name: fallback.name,
            slug: fallback.slug,
            subtitle: fallback.overview,
            region: fallback.region,
            type: destinationTypeValue(fallback.type),
            heroImage: fallback.heroImage,
            overview: fallback.overview,
            highlights: fallback.highlights.map((highlight) => highlight.title),
            published: true,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    })(),
  );
}

export async function getAdminTour(id: string) {
  return tryDatabase(
    async () => {
      const tour = await prisma.tour.findFirst({
        where: {
          OR: [{ id }, { slug: id }],
        },
      });

      if (tour) {
        return {
          id: tour.id,
          title: tour.title,
          slug: tour.slug,
          category: tour.category,
          shortDescription: tour.shortDescription,
          overview: tour.overview,
          duration: tour.duration,
          city: tour.city ?? "",
          rating: tour.rating ?? 0,
          reviewCount: tour.reviewCount ?? 0,
          groupSize: tour.groupSize,
          departurePoint: tour.departurePoint ?? "",
          priceFrom: tour.priceFrom ?? 0,
          heroImage: tour.heroImage ?? "",
          images: tour.images,
          highlights: tour.highlights,
          included: tour.included,
          excluded: tour.excluded,
          itinerary: Array.isArray(tour.itinerary)
            ? (tour.itinerary as AdminTourValues["itinerary"])
            : [],
          published: tour.published,
          featured: tour.featured,
          metaTitle: tour.metaTitle ?? "",
          metaDescription: tour.metaDescription ?? "",
        };
      }

      const staticTour = tours.find((item) => item.slug === id);
      return staticTour
        ? {
            id: staticTour.slug,
            title: staticTour.title,
            slug: staticTour.slug,
            category: staticTour.category,
            shortDescription: staticTour.shortDescription,
            overview: staticTour.overview,
            duration: staticTour.duration,
            city: staticTour.city,
            rating: staticTour.rating,
            reviewCount: staticTour.reviewCount,
            groupSize: staticTour.groupSize,
            departurePoint: staticTour.departurePoint,
            priceFrom: staticTour.priceFrom,
            heroImage: staticTour.heroImage,
            images: staticTour.images,
            highlights: staticTour.highlights,
            included: staticTour.included,
            excluded: staticTour.excluded,
            itinerary: staticTour.itinerary,
            published: true,
            featured: staticTour.featured,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    },
    (() => {
      const staticTour = tours.find((item) => item.slug === id);
      return staticTour
        ? {
            id: staticTour.slug,
            title: staticTour.title,
            slug: staticTour.slug,
            category: staticTour.category,
            shortDescription: staticTour.shortDescription,
            overview: staticTour.overview,
            duration: staticTour.duration,
            city: staticTour.city,
            rating: staticTour.rating,
            reviewCount: staticTour.reviewCount,
            groupSize: staticTour.groupSize,
            departurePoint: staticTour.departurePoint,
            priceFrom: staticTour.priceFrom,
            heroImage: staticTour.heroImage,
            images: staticTour.images,
            highlights: staticTour.highlights,
            included: staticTour.included,
            excluded: staticTour.excluded,
            itinerary: staticTour.itinerary,
            published: true,
            featured: staticTour.featured,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    })(),
  );
}

export async function getAdminInquiries() {
  return tryDatabase(
    async () =>
      prisma.inquiry.findMany({
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          createdAt: true,
          name: true,
          email: true,
          phone: true,
          whatsapp: true,
          type: true,
          tourSlug: true,
          travelers: true,
          status: true,
          message: true,
          destinations: true,
          arrivalDate: true,
          departureDate: true,
          budgetRange: true,
          hotelCategory: true,
          nationality: true,
        },
      }),
    [],
  );
}

export async function getAdminBlogPosts() {
  return tryDatabase(
    async () => {
      const posts = await prisma.blogPost.findMany({ orderBy: { createdAt: "desc" } });
      return posts.length
        ? posts.map((post) => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            category: post.category,
            published: post.published,
            updatedAt: post.updatedAt,
          }))
        : blogArticles.map((article) => ({
            id: article.slug,
            title: article.title,
            slug: article.slug,
            category: "Travel Guide",
            published: true,
            updatedAt: new Date(article.publishedAt),
          }));
    },
    blogArticles.map((article) => ({
      id: article.slug,
      title: article.title,
      slug: article.slug,
      category: "Travel Guide",
      published: true,
      updatedAt: new Date(article.publishedAt),
    })),
  );
}

export async function getAdminBlogPost(id: string): Promise<(AdminBlogPostValues & { id: string }) | null> {
  return tryDatabase(
    async () => {
      const post = await prisma.blogPost.findFirst({ where: { OR: [{ id }, { slug: id }] } });
      if (post) {
        return {
          id: post.id,
          title: post.title,
          slug: post.slug,
          excerpt: post.excerpt,
          contentText: post.contentText,
          category: post.category,
          tags: post.tags,
          heroImage: post.heroImage ?? "",
          published: post.published,
          metaTitle: post.metaTitle ?? "",
          metaDescription: post.metaDescription ?? "",
        };
      }
      const fallback = blogArticles.find((article) => article.slug === id);
      return fallback
        ? {
            id: fallback.slug,
            title: fallback.title,
            slug: fallback.slug,
            excerpt: fallback.excerpt,
            contentText: fallback.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n"),
            category: "Travel Guide",
            tags: [],
            heroImage: fallback.heroImage,
            published: true,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    },
    (() => {
      const fallback = blogArticles.find((article) => article.slug === id);
      return fallback
        ? {
            id: fallback.slug,
            title: fallback.title,
            slug: fallback.slug,
            excerpt: fallback.excerpt,
            contentText: fallback.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n"),
            category: "Travel Guide",
            tags: [],
            heroImage: fallback.heroImage,
            published: true,
            metaTitle: "",
            metaDescription: "",
          }
        : null;
    })(),
  );
}

export async function getAdminFaqs() {
  return tryDatabase(
    async () => prisma.fAQ.findMany({ orderBy: [{ order: "asc" }, { category: "asc" }] }),
    [],
  );
}

export async function getAdminGalleryImages() {
  return tryDatabase(
    async () =>
      prisma.galleryImage.findMany({
        orderBy: [{ order: "asc" }, { createdAt: "desc" }],
        include: { categoryRef: true },
      }),
    [],
  );
}

export async function getAdminGalleryImage(id: string) {
  return tryDatabase(
    async () =>
      prisma.galleryImage.findUnique({
        where: { id },
        include: { categoryRef: true },
      }),
    null,
  );
}

export async function getAdminGalleryCategories() {
  return tryDatabase(
    async () =>
      prisma.galleryCategory.findMany({
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: { _count: { select: { images: true } } },
      }),
    [],
  );
}

export async function getAdminSettings() {
  return getPublicSettings();
}

export async function getAdminHomepageSettings() {
  return tryDatabase(
    async () => {
      const settings = await prisma.homepageSettings.findUnique({ where: { id: "homepage" } });
      return mapHomepageSettingsToEditorValues(settings);
    },
    mapHomepageSettingsToEditorValues(null),
  );
}
