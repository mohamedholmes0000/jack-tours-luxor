import { blogArticles, destinations, tours } from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import { customizeTripSiteSettingKeys, mapHomepageSettingsToEditorValues } from "@/lib/homepage-settings";
import { getPublicSettings } from "@/lib/data/settings";
import type {
  AdminBlogPostValues,
  AdminDestinationValues,
  AdminTourValues,
  AdminTestimonialValues,
} from "@/lib/validations";

export type AdminContentType = "TOUR" | "ACTIVITY" | "HOTEL";

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

export async function getAdminTours(contentType: AdminContentType = "TOUR") {
  return tryDatabase(
    async () => {
      const dbTours = await prisma.tour.findMany({
        where: { contentType },
        orderBy: { createdAt: "desc" },
        select: {
          id: true,
          contentType: true,
          slug: true,
          title: true,
          category: true,
          shortDescription: true,
          overview: true,
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

      return dbTours;
    },
    [],
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
          contentType: tour.contentType ?? "TOUR",
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
          languages: tour.languages,
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

      return null;
    },
    null,
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

export type AdminTestimonialListItem = {
  id: string;
  name: string;
  nationality: string | null;
  country: string | null;
  rating: number;
  text: string;
  source: string | null;
  active: boolean;
  featured: boolean;
  order: number;
  createdAt: Date;
};

export async function getAdminTestimonials(): Promise<AdminTestimonialListItem[]> {
  return tryDatabase(
    async () =>
      prisma.testimonial.findMany({
        orderBy: [{ featured: "desc" }, { order: "asc" }, { createdAt: "desc" }],
        select: {
          id: true,
          name: true,
          nationality: true,
          country: true,
          rating: true,
          text: true,
          source: true,
          active: true,
          featured: true,
          order: true,
          createdAt: true,
        },
      }),
    [],
  );
}

export async function getAdminTestimonial(id: string): Promise<(AdminTestimonialValues & { id: string }) | null> {
  return tryDatabase(
    async () => {
      const testimonial = await prisma.testimonial.findUnique({ where: { id } });

      if (!testimonial) return null;

      return {
        id: testimonial.id,
        name: testimonial.name,
        nationality: testimonial.nationality ?? "",
        country: testimonial.country ?? "",
        rating: testimonial.rating,
        text: testimonial.text,
        avatarImage: testimonial.avatarImage ?? "",
        source: testimonial.source ?? "",
        order: testimonial.order,
        active: testimonial.active,
        featured: testimonial.featured,
      };
    },
    null,
  );
}

export async function getAdminGalleryAlbums() {
  return tryDatabase(
    async () =>
      prisma.galleryAlbum.findMany({
        orderBy: [{ displayOrder: "asc" }, { createdAt: "desc" }],
        include: {
          category: true,
          _count: { select: { images: true } },
        },
      }),
    [],
  );
}

export async function getAdminGalleryAlbum(id: string) {
  return tryDatabase(
    async () =>
      prisma.galleryAlbum.findUnique({
        where: { id },
        include: {
          category: true,
          images: { orderBy: [{ order: "asc" }, { createdAt: "asc" }] },
        },
      }),
    null,
  );
}

export async function getAdminGalleryCategories() {
  return tryDatabase(
    async () =>
      prisma.galleryCategory.findMany({
        orderBy: [{ order: "asc" }, { name: "asc" }],
        include: { _count: { select: { albums: true } } },
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
