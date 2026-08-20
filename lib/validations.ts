import { z } from "zod";
import { isAllowedAdminImageSrc } from "@/lib/images";

const phoneLike = z
  .string()
  .trim()
  .min(6, "Add a WhatsApp number or phone we can reply to.");

function localDateInputValue(date = new Date()) {
  const localDate = new Date(date.getTime() - date.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function addDaysToDateInput(value: string, days: number) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return "";
  }

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day) + days);
  return localDateInputValue(date);
}

const adminImageSource = z
  .string()
  .trim()
  .refine(
    isAllowedAdminImageSrc,
    "Use an https image URL from a trusted host or a local /photos/ or /images/ path.",
  );

export const optionalAdminImageSource = adminImageSource.optional().or(z.literal(""));
const adminImageListItem = adminImageSource.or(z.literal(""));

export const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
});

export const tripPlannerSchema = z
  .object({
    arrivalDate: z.string().min(1, "Choose an arrival date."),
    departureDate: z.string().min(1, "Choose a departure date."),
    travelers: z.number().int().min(1, "Add at least one traveler."),
    nationality: z.string().trim().min(2, "Add your nationality."),
    destinations: z.array(z.string()).min(1, "Choose at least one destination."),
    interests: z.array(z.string()).min(1, "Choose at least one interest."),
    budgetRange: z.string().min(1, "Choose a budget range."),
    approximateBudget: z.string().trim().optional(),
    hotelCategory: z.string().min(1, "Choose a hotel preference."),
    name: z.string().trim().min(2, "Add your name."),
    email: z.string().trim().email("Add a valid email."),
    whatsapp: phoneLike,
    specialRequests: z.string().trim().optional(),
  })
  .superRefine((value, context) => {
    const today = localDateInputValue();

    if (value.arrivalDate && value.arrivalDate < today) {
      context.addIssue({
        code: "custom",
        message: "Arrival date cannot be in the past.",
        path: ["arrivalDate"],
      });
    }

    if (value.arrivalDate && value.departureDate && value.departureDate < addDaysToDateInput(value.arrivalDate, 1)) {
      context.addIssue({
        code: "custom",
        message: "Departure date must be after arrival date.",
        path: ["departureDate"],
      });
    }
  });

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Add your name."),
  email: z.string().trim().email("Add a valid email."),
  phone: z.string().trim().optional(),
  subject: z.string().trim().optional(),
  message: z.string().trim().min(10, "Add a little more detail."),
});

export const tourInquirySchema = z.object({
  preferredDate: z.string().min(1, "Choose a preferred date."),
  travelers: z.number().int().min(1, "Add at least one traveler."),
  name: z.string().trim().min(2, "Add your name."),
  phone: phoneLike,
  notes: z.string().trim().optional(),
});

export const adminTourSchema = z.object({
  contentType: z.enum(["TOUR", "ACTIVITY", "HOTEL"]),
  title: z.string().trim().min(3, "Add a tour title."),
  slug: z
    .string()
    .trim()
    .min(3, "Add a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  category: z.string().trim().min(2, "Add a category."),
  shortDescription: z.string().trim().min(10, "Add a short description."),
  overview: z.string().trim().min(20, "Add an overview."),
  duration: z.string().trim().min(1, "Add duration."),
  city: z.string().trim().optional(),
  rating: z.number().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  groupSize: z.string().trim().min(1, "Add group size."),
  departurePoint: z.string().trim().optional(),
  languages: z.array(z.string().trim()),
  priceFrom: z.number().min(0).optional(),
  heroImage: optionalAdminImageSource,
  images: z.array(adminImageListItem),
  highlights: z.array(z.string().trim().min(1)).min(1, "Add at least one highlight."),
  included: z.array(z.string().trim()),
  excluded: z.array(z.string().trim()),
  itinerary: z
    .array(
      z.object({
        title: z.string().trim().min(1, "Add an itinerary title."),
        description: z.string().trim().min(1, "Add itinerary details."),
      }),
    ),
  published: z.boolean(),
  featured: z.boolean(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export const inquiryStatusSchema = z.object({
  status: z.enum(["NEW", "CONTACTED", "QUOTED", "BOOKED", "CLOSED"]),
});

export const adminBlogPostSchema = z.object({
  title: z.string().trim().min(3, "Add a title."),
  slug: z.string().trim().min(3).regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase slug format."),
  excerpt: z.string().trim().min(10, "Add an excerpt."),
  contentText: z.string().trim().min(20, "Add article content."),
  category: z.string().trim().min(2, "Add a category."),
  tags: z.array(z.string().trim()),
  heroImage: optionalAdminImageSource,
  published: z.boolean(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export const adminFaqSchema = z.object({
  question: z.string().trim().min(5, "Add a question."),
  answer: z.string().trim().min(10, "Add an answer."),
  category: z.string().trim().min(2, "Add a category."),
  order: z.number().int().min(0),
  active: z.boolean(),
});

export const adminTestimonialSchema = z.object({
  name: z.string().trim().min(2, "Add the traveler name."),
  country: z.string().trim().max(80).optional().or(z.literal("")),
  nationality: z.string().trim().max(80).optional().or(z.literal("")),
  rating: z.number().int().min(1, "Choose a rating from 1 to 5.").max(5, "Choose a rating from 1 to 5."),
  text: z.string().trim().min(10, "Add the traveler review.").max(4000, "Keep the review under 4000 characters."),
  avatarImage: optionalAdminImageSource,
  source: z.string().trim().max(80).optional().or(z.literal("")),
  order: z.number().int().min(0),
  active: z.boolean(),
  featured: z.boolean(),
});

export const adminGalleryImageSchema = z.object({
  url: adminImageSource,
  publicId: z.string().trim().optional(),
  alt: z.string().trim().optional(),
  title: z.string().trim().optional(),
  caption: z.string().trim().optional(),
  description: z.string().trim().optional(),
  albumId: z.string().trim().optional(),
  category: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  relatedTourSlug: z.string().trim().optional(),
  order: z.number().int().min(0),
  active: z.boolean().optional(),
});

export const adminGalleryAlbumSchema = z.object({
  title: z.string().trim().min(2, "Add an album title."),
  slug: z
    .string()
    .trim()
    .min(2, "Add a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  description: z.string().trim().optional(),
  coverImage: adminImageSource,
  coverImagePublicId: z.string().trim().optional(),
  categoryId: z.string().trim().optional(),
  displayOrder: z.number().int().min(0),
  active: z.boolean(),
});

export const adminGalleryCategorySchema = z.object({
  name: z.string().trim().min(2, "Add a category name."),
  slug: z
    .string()
    .trim()
    .min(2, "Add a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  order: z.number().int().min(0),
  active: z.boolean(),
});

export const adminDestinationSchema = z.object({
  name: z.string().trim().min(2, "Add a destination name."),
  slug: z
    .string()
    .trim()
    .min(3, "Add a slug.")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens."),
  subtitle: z.string().trim().optional(),
  region: z.string().trim().min(2, "Add a region."),
  type: z.enum(["CITY", "SITE", "COASTAL", "RIVER_ROUTE"]),
  heroImage: optionalAdminImageSource,
  overview: z.string().trim().min(10, "Add an overview."),
  highlights: z.array(z.string().trim().min(1)).min(1, "Add at least one highlight."),
  published: z.boolean(),
  metaTitle: z.string().trim().optional(),
  metaDescription: z.string().trim().optional(),
});

export const adminSettingsSchema = z.object({
  companyName: z.string().trim().min(2),
  phone: z.string().trim().optional(),
  whatsappNumber: z.string().trim().optional(),
  email: z.string().trim().email().optional().or(z.literal("")),
  address: z.string().trim().optional(),
  facebookUrl: z.string().trim().url().optional().or(z.literal("")),
  instagramUrl: z.string().trim().url().optional().or(z.literal("")),
  tripAdvisorUrl: z.string().trim().url().optional().or(z.literal("")),
  defaultSeoTitle: z.string().trim().optional(),
  defaultSeoDescription: z.string().trim().optional(),
  homepageHeroEyebrow: z.string().trim().optional(),
  homepageHeroHeadline: z.string().trim().optional(),
  homepageHeroHeadlineAccent: z.string().trim().optional(),
  homepageHeroSubheadline: z.string().trim().optional(),
  homepageHeroPrimaryCtaLabel: z.string().trim().optional(),
  homepageHeroPrimaryCtaHref: z
    .string()
    .trim()
    .refine((value) => !value || value.startsWith("/"), "Use a local path starting with /.")
    .optional(),
  homepageHeroImage: optionalAdminImageSource,
  homepageTrustItem1: z.string().trim().optional(),
  homepageTrustItem2: z.string().trim().optional(),
  homepageTrustItem3: z.string().trim().optional(),
});

const optionalUrl = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Use a full http:// or https:// URL.")
  .optional();
const optionalPlatformRating = z
  .string()
  .trim()
  .refine((value) => {
    if (!value) return true;
    const rating = Number(value);
    return /^\d+(?:\.\d+)?$/.test(value) && Number.isFinite(rating) && rating >= 0 && rating <= 5;
  }, "Use a rating from 0 to 5.")
  .optional();
const optionalReviewCount = z
  .string()
  .trim()
  .refine((value) => !value || (/^\d+$/.test(value) && Number.isSafeInteger(Number(value))), "Use a non-negative whole number.")
  .optional();
const localPath = z
  .string()
  .trim()
  .refine((value) => !value || value.startsWith("/") || value.startsWith("http"), "Use a local path or full URL.");

export const adminGlobalSettingsSchema = z.object({
  globalWhatsappNumber: z.string().trim().optional(),
  globalPhoneNumber: z.string().trim().optional(),
  globalEmail: z.string().trim().email("Add a valid email.").optional().or(z.literal("")),
  googleRating: optionalPlatformRating,
  googleReviewCount: optionalReviewCount,
  socialFacebook: optionalUrl,
  socialGoogleBusiness: optionalUrl,
  socialInstagram: optionalUrl,
  socialTripadvisor: optionalUrl,
  socialTwitter: optionalUrl,
  socialYoutube: optionalUrl,
  tripadvisorRating: optionalPlatformRating,
  tripadvisorReviewCount: optionalReviewCount,
});

export const adminHeaderSettingsSchema = z.object({
  logoLine1: z.string().trim().min(1, "Add logo line 1."),
  logoLine2: z.string().trim().min(1, "Add logo line 2."),
  navLink1Label: z.string().trim().min(1),
  navLink1Url: localPath,
  navLink2Label: z.string().trim().min(1),
  navLink2Url: localPath,
  navLink3Label: z.string().trim().min(1),
  navLink3Url: localPath,
  navLink4Label: z.string().trim().min(1),
  navLink4Url: localPath,
  bookNowLabel: z.string().trim().min(1),
});

export const adminFooterSettingsSchema = z.object({
  footerTagline: z.string().trim().optional(),
  footerDescription: z.string().trim().optional(),
  footerCol1Heading: z.string().trim().min(1),
  footerCol1Links: z.array(z.object({ label: z.string().trim().min(1), url: localPath })).min(1),
  footerCol2Heading: z.string().trim().min(1),
  footerCopyright: z.string().trim().optional(),
});

export const adminContactMapSchema = z.object({
  contactMapLocation: z.string().trim().min(2, "Add a map location."),
  contactMapZoom: z.number().int().min(1).max(20),
  contactMapVisible: z.boolean(),
});

const adminRoleSchema = z.enum(["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"]);
const adminPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/[A-Za-z]/, "Password must include at least one letter.")
  .regex(/\d/, "Password must include at least one number.");

export const adminUserCreateSchema = z
  .object({
    name: z.string().trim().min(2, "Add a name."),
    email: z.string().trim().email("Add a valid email.").toLowerCase(),
    password: adminPasswordSchema,
    confirmPassword: z.string(),
    role: adminRoleSchema,
    active: z.boolean(),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const adminUserUpdateSchema = z
  .object({
    name: z.string().trim().min(2, "Add a name."),
    email: z.string().trim().email("Add a valid email.").toLowerCase(),
    role: adminRoleSchema,
    active: z.boolean(),
    password: adminPasswordSchema.optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
  })
  .refine((value) => !value.password || value.password === value.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export type TripPlannerValues = z.infer<typeof tripPlannerSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type TourInquiryValues = z.infer<typeof tourInquirySchema>;
export type AdminTourValues = z.infer<typeof adminTourSchema>;
export type AdminBlogPostValues = z.infer<typeof adminBlogPostSchema>;
export type AdminFaqValues = z.infer<typeof adminFaqSchema>;
export type AdminTestimonialValues = z.infer<typeof adminTestimonialSchema>;
export type AdminGalleryImageValues = z.infer<typeof adminGalleryImageSchema>;
export type AdminGalleryAlbumValues = z.infer<typeof adminGalleryAlbumSchema>;
export type AdminGalleryCategoryValues = z.infer<typeof adminGalleryCategorySchema>;
export type AdminDestinationValues = z.infer<typeof adminDestinationSchema>;
export type AdminSettingsValues = z.infer<typeof adminSettingsSchema>;
export type AdminGlobalSettingsValues = z.infer<typeof adminGlobalSettingsSchema>;
export type AdminHeaderSettingsValues = z.infer<typeof adminHeaderSettingsSchema>;
export type AdminFooterSettingsValues = z.infer<typeof adminFooterSettingsSchema>;
export type AdminContactMapValues = z.infer<typeof adminContactMapSchema>;
export type AdminUserCreateValues = z.infer<typeof adminUserCreateSchema>;
export type AdminUserUpdateValues = z.infer<typeof adminUserUpdateSchema>;
