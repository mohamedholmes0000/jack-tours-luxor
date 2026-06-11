import { blogArticles, destinations, tours } from "@/lib/content";
import { prisma, tryDatabase } from "@/lib/data/safe-db";
import { getPublicSettings } from "@/lib/data/settings";
import type {
  AdminBlogPostValues,
  AdminTourValues,
} from "@/lib/validations";

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
          priceFrom: true,
          priceCurrency: true,
          published: true,
          featured: true,
        },
      });

      return dbTours.length
        ? dbTours
        : tours.map((tour) => ({
            id: tour.slug,
            slug: tour.slug,
            title: tour.title,
            category: tour.category,
            priceFrom: tour.priceFrom,
            priceCurrency: tour.priceCurrency,
            published: true,
            featured: tour.featured,
          }));
    },
    tours.map((tour) => ({
      id: tour.slug,
      slug: tour.slug,
      title: tour.title,
      category: tour.category,
      priceFrom: tour.priceFrom,
      priceCurrency: tour.priceCurrency,
      published: true,
      featured: tour.featured,
    })),
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
    async () => prisma.galleryImage.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] }),
    [],
  );
}

export async function getAdminSettings() {
  return getPublicSettings();
}
