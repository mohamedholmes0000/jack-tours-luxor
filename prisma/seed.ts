import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { blogArticles } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  const password = await bcrypt.hash("Admin2024!", 12);

  await prisma.adminUser.upsert({
    where: { email: "admin@jacktoursluxor.com" },
    update: { password, name: "Jack Egypt Tour Admin" },
    create: {
      email: "admin@jacktoursluxor.com",
      password,
      name: "Jack Egypt Tour Admin",
    },
  });

  const destinations = [
    { slug: "luxor", name: "Luxor", subtitle: "Heart of Ancient Egypt", region: "Upper Egypt", type: "CITY" as const, heroImage: "/photos/luxor-temple.jpg", overview: "Temples, tombs, and private Egyptologist-led journeys through ancient Thebes." },
    { slug: "aswan", name: "Aswan", subtitle: "Gateway to Nubia", region: "Upper Egypt", type: "CITY" as const, heroImage: "/photos/aswan.jpg", overview: "Nubian culture, river islands, Philae Temple, and relaxed Nile scenery." },
    { slug: "cairo", name: "Cairo", subtitle: "Pyramids & Beyond", region: "Lower Egypt", type: "CITY" as const, heroImage: "/photos/pyramids.jpg", overview: "Pyramids, museums, Islamic Cairo, and tailored city experiences." },
    { slug: "hurghada", name: "Hurghada", subtitle: "Red Sea Coast", region: "Red Sea Coast", type: "COASTAL" as const, heroImage: "/photos/hurghada.jpg", overview: "Red Sea extensions with beach time, diving, and family-friendly resorts." },
    { slug: "abu-simbel", name: "Abu Simbel", subtitle: "Ramesses' Legacy", region: "Upper Egypt", type: "SITE" as const, heroImage: "/photos/abu-simbel.jpg", overview: "A dramatic southern temple extension near Lake Nasser and the Nubian frontier." },
    { slug: "red-sea", name: "Red Sea", subtitle: "Coral & Coastline", region: "Red Sea Coast", type: "COASTAL" as const, heroImage: "/photos/red-sea.jpg", overview: "Coastal Egypt for reefs, clear water, and a restful finale after ancient sites." },
    { slug: "alexandria", name: "Alexandria", subtitle: "Mediterranean Heritage", region: "Lower Egypt", type: "CITY" as const, heroImage: "/photos/alexandria.jpg", overview: "Mediterranean heritage, coastal food, and Greco-Roman landmarks." },
  ];

  for (const destination of destinations) {
    await prisma.destination.upsert({
      where: { slug: destination.slug },
      update: {
        name: destination.name,
        subtitle: destination.subtitle,
        region: destination.region,
        heroImage: destination.heroImage,
        overview: destination.overview,
        type: destination.type,
      },
      create: {
        slug: destination.slug,
        name: destination.name,
        subtitle: destination.subtitle,
        region: destination.region,
        heroImage: destination.heroImage,
        overview: destination.overview,
        type: destination.type,
        highlights: ["Private guiding", "Tailor-made pacing", "Premium local support"],
        published: true,
      },
    });
  }

  const tours = [
    ["private-valley-of-the-kings-karnak-temple-tour", "Private Valley of the Kings & Karnak Temple Tour", "Day Tours", "A refined private Luxor day tour with an expert Egyptologist.", "Luxor", 4.9, 12],
    ["3-day-luxor-aswan-nile-cruise-experience", "3-Day Luxor & Aswan Nile Cruise Experience", "Nile Cruises", "A compact Nile cruise experience between Luxor and Aswan.", "Aswan", 4.8, 9],
    ["7-day-egypt-highlights-cairo-luxor-aswan", "7-Day Egypt Highlights: Cairo, Luxor & Aswan", "Multi-Day Packages", "A private Egypt itinerary connecting the country's essential landmarks.", "Cairo", 4.9, 14],
    ["luxury-luxor-private-egyptologist-hot-air-balloon", "Luxury Luxor: Private Egyptologist & Hot Air Balloon", "Luxury Tours", "A premium Luxor experience with sunrise ballooning and private guiding.", "Luxor", 4.9, 7],
    ["tailor-made-egypt-journey", "Tailor-Made Egypt Journey", "Custom Egypt Tours", "A flexible private journey designed around your dates, pace, and interests.", "Luxor", 0, 0],
  ];

  for (const [slug, title, category, shortDescription, city, rating, reviewCount] of tours) {
    await prisma.tour.upsert({
      where: { slug },
      update: { city, rating, reviewCount },
      create: {
        slug,
        title,
        category,
        shortDescription,
        overview:
          "Designed for travelers who want Egypt handled with taste, local knowledge, and responsive support from the first WhatsApp message to the final transfer.",
        highlights: ["Private expert guide", "Flexible itinerary", "Premium transport", "WhatsApp support"],
        duration: category === "Day Tours" ? "1 day" : "Custom",
        city,
        rating,
        reviewCount,
        groupSize: "Private",
        departurePoint: "Luxor",
        languages: ["English", "Arabic"],
        priceFrom: 180,
        included: ["Private guide", "Air-conditioned vehicle", "Pickup and drop-off"],
        excluded: ["Entrance fees", "Meals unless listed", "Personal expenses"],
        itinerary: [{ title: "Curated experience", description: "A tailored itinerary managed by the Jack Egypt Tour team." }],
        images: [],
        published: true,
        featured: true,
      },
    });
  }

  const faqs = [
    ["What is the best time to visit Luxor?", "October through April is generally the most comfortable period for sightseeing."],
    ["Are your tours private or group?", "The MVP offering focuses on private and tailor-made tours."],
    ["How far in advance should I book?", "A few weeks is ideal, but WhatsApp us for close-date availability."],
    ["Do you offer child-friendly tours?", "Yes, tours can be paced and shaped for families with children."],
    ["What payment methods do you accept?", "Payment options are confirmed during inquiry based on the tour and timing."],
  ];

  for (const [index, [question, answer]] of faqs.entries()) {
    await prisma.fAQ.upsert({
      where: { id: `seed-faq-${index}` },
      update: { question, answer, order: index },
      create: { id: `seed-faq-${index}`, question, answer, order: index },
    });
  }

  const testimonials = [
    ["Amelia Carter", "United Kingdom", "The Luxor day tour felt personal, calm, and beautifully organized from start to finish."],
    ["Marco Bellini", "Italy", "Fast WhatsApp replies, a superb guide, and a Nile cruise plan that matched our pace perfectly."],
    ["Sofia Martinez", "Spain", "Jack Egypt Tour made Egypt feel effortless. Every transfer and temple visit was handled with care."],
  ];

  for (const [name, nationality, text] of testimonials) {
    await prisma.testimonial.create({
      data: { name, nationality, text, rating: 5, source: "Guest review", featured: true },
    });
  }

  for (const article of blogArticles) {
    await prisma.blogPost.upsert({
      where: { slug: article.slug },
      update: {
        title: article.title,
        excerpt: article.excerpt,
        contentText: article.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n"),
        category: "Travel Guide",
        tags: ["Egypt", "Planning"],
        content: article.sections,
        heroImage: article.heroImage,
        published: true,
      },
      create: {
        slug: article.slug,
        title: article.title,
        excerpt: article.excerpt,
        contentText: article.sections.map((section) => `${section.heading}\n${section.body}`).join("\n\n"),
        category: "Travel Guide",
        tags: ["Egypt", "Planning"],
        content: article.sections,
        heroImage: article.heroImage,
        published: true,
      },
    });
  }

  const settings = {
    companyName: "Jack Egypt Tour",
    phone: "+20XXXXXXXXXX",
    whatsappNumber: "+20XXXXXXXXXX",
    email: "info@jackegypttour.com",
    address: "Luxor, Egypt",
    defaultMetaTitle: "Jack Egypt Tour | Luxury Egypt Private Tours",
    defaultMetaDescription: "Private tailor-made Egypt tours and DMC services from Luxor-based experts.",
    heroHeadline: "Discover Egypt Beyond Expectations",
    heroSubheadline: "Private tailor-made journeys through Egypt, curated by Luxor-based local experts.",
  };

  for (const [key, value] of Object.entries(settings)) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
