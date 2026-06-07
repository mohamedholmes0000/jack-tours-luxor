import { z } from "zod";

const phoneLike = z
  .string()
  .trim()
  .min(6, "Add a WhatsApp number or phone we can reply to.");

export const inquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  message: z.string().optional(),
});

export const tripPlannerSchema = z.object({
  arrivalDate: z.string().min(1, "Choose an arrival date."),
  departureDate: z.string().min(1, "Choose a departure date."),
  travelers: z.number().int().min(1, "Add at least one traveler."),
  nationality: z.string().trim().min(2, "Add your nationality."),
  destinations: z.array(z.string()).min(1, "Choose at least one destination."),
  interests: z.array(z.string()).min(1, "Choose at least one interest."),
  budgetRange: z.string().min(1, "Choose a budget range."),
  hotelCategory: z.string().min(1, "Choose a hotel preference."),
  name: z.string().trim().min(2, "Add your name."),
  email: z.string().trim().email("Add a valid email."),
  whatsapp: phoneLike,
  specialRequests: z.string().trim().optional(),
});

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Add your name."),
  email: z.string().trim().email("Add a valid email."),
  phone: phoneLike,
  subject: z.string().trim().min(3, "Add a short subject."),
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
  groupSize: z.string().trim().min(1, "Add group size."),
  departurePoint: z.string().trim().optional(),
  priceFrom: z.number().min(0).optional(),
  heroImage: z.string().trim().url("Use a valid image URL.").optional().or(z.literal("")),
  images: z.array(z.string().trim().url("Use valid gallery image URLs.").or(z.literal(""))),
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
  heroImage: z.string().trim().url("Use a valid image URL.").optional().or(z.literal("")),
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

export const adminGalleryImageSchema = z.object({
  url: z.string().trim().url("Use a valid image URL."),
  alt: z.string().trim().min(3, "Add alt text."),
  category: z.string().trim().min(2, "Add a category."),
  relatedTourSlug: z.string().trim().optional(),
  order: z.number().int().min(0),
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
});

export type TripPlannerValues = z.infer<typeof tripPlannerSchema>;
export type ContactValues = z.infer<typeof contactSchema>;
export type TourInquiryValues = z.infer<typeof tourInquirySchema>;
export type AdminTourValues = z.infer<typeof adminTourSchema>;
export type AdminBlogPostValues = z.infer<typeof adminBlogPostSchema>;
export type AdminFaqValues = z.infer<typeof adminFaqSchema>;
export type AdminGalleryImageValues = z.infer<typeof adminGalleryImageSchema>;
export type AdminSettingsValues = z.infer<typeof adminSettingsSchema>;
