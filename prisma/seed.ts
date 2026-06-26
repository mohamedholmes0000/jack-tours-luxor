import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import { blogArticles } from "../lib/content";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = "admin@jacktoursluxor.com";
  const adminPassword = "JackAdmin2026!";
  const password = await bcrypt.hash(adminPassword, 12);

  const existingSuperAdmin = await prisma.adminUser.findFirst({ where: { role: "SUPER_ADMIN" } });
  const existingUsersCount = await prisma.adminUser.count();

  if (!existingSuperAdmin && existingUsersCount > 0) {
    const firstUser = await prisma.adminUser.findFirst({ orderBy: { createdAt: "asc" } });
    if (firstUser) {
      await prisma.adminUser.update({
        where: { id: firstUser.id },
        data: { role: "SUPER_ADMIN", active: true },
      });
      console.log(`Super Admin: ${firstUser.email} / existing password`);
    }
  }

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password, name: "Jack Egypt Tour Admin", role: "SUPER_ADMIN", active: true },
    create: {
      email: adminEmail,
      password,
      name: "Jack Egypt Tour Admin",
      role: "SUPER_ADMIN",
      active: true,
    },
  });
  console.log(`Super Admin: ${adminEmail} / ${adminPassword}`);

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
    phone: "+20 1096586292",
    whatsappNumber: "201096586292",
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

  await prisma.homepageSettings.upsert({
    where: { id: "homepage" },
    update: {
      heroBackgroundImage: "/photos/karnak.jpg",
      heroEyebrow: "Private Egypt · est. Luxor",
      heroHeadline: "Egypt, privately composed.",
      heroHeadlineAccent: "composed.",
      heroSubheadline:
        "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.",
      heroPrimaryCtaLabel: "Plan My Egypt Journey",
      heroPrimaryCtaHref: "/trip-planner",
      heroSecondaryLinkLabel: "Or Book Now",
      heroSecondaryLinkHref: "/trip-planner",
      heroTrustBadges: [
        "Local Egypt Travel Experts",
        "Private Tailor-Made Tours",
        "WhatsApp Support 24/7",
      ],
      destinationsEyebrow: "Where we travel",
      destinationsHeading: "From the Nile,",
      destinationsHeadingAccent: "outward.",
      destinationsViewAllLabel: "All destinations →",
      destinationsViewAllHref: "/destinations",
      featuredEyebrow: "Featured journeys",
      featuredHeading: "Polished private experiences,",
      featuredHeadingAccent: "ready to tailor.",
      featuredViewAllLabel: "View all tours",
      featuredViewAllHref: "/tours",
      whyEyebrow: "WHY JACK EGYPT TOUR",
      whyHeading: "Everything you need for a",
      whyHeadingAccent: "perfect Egypt journey",
      whyDescription:
        "From private guides to seamless logistics, we handle every detail of your Egypt experience — so you can focus on the wonder.",
      whyCtaLabel: "Plan Your Journey",
      whyCtaHref: "/trip-planner",
      whyCollageImage1: "/photos/karnak.jpg",
      whyCollageImage2: "/photos/hatshepsut.jpg",
      whyCollageImage3: "/photos/felucca.jpg",
      whyIncludedHeading: "What's included in every journey",
      whyServices: [
        { icon: "user-check", label: "Private Guides" },
        { icon: "hotel", label: "Hotel Bookings" },
        { icon: "car", label: "Airport Transfers" },
        { icon: "ship", label: "Nile Cruises" },
        { icon: "message", label: "24/7 WhatsApp" },
        { icon: "sparkles", label: "Tailor-Made" },
      ],
      ourWorldEyebrow: "Our world",
      ourWorldHeading: "A small team,",
      ourWorldHeadingAccent: "quietly capable.",
      ourWorldBody:
        "We are based in Luxor. We arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. We work in small numbers, with trusted guides, on WhatsApp time. Everything else is negotiable.",
      ourWorldImage: "/photos/hatshepsut.jpg",
      statsItems: [
        { value: "10+", label: "Years on the ground" },
        { value: "1,000+", label: "Travelers hosted" },
        { value: "50+", label: "Private routes" },
        { value: "24/7", label: "WhatsApp support" },
      ],
      statsBackgroundImage: "/photos/felucca.jpg",
      testimonialsEyebrow: "Traveler stories",
      testimonialsHeading: "Loved quietly,",
      testimonialsHeadingAccent: "from everywhere.",
      finalCtaBackgroundImage: "/photos/felucca.jpg",
      finalCtaEyebrow: "Start your booking",
      finalCtaHeading: "Ready when",
      finalCtaHeadingAccent: "you are.",
      finalCtaDescription:
        "Tell us what you have in mind. We will shape the route, guide style, pacing, and logistics around you.",
      finalCtaPrimaryButtonLabel: "Book Now",
      finalCtaPrimaryButtonHref: "/trip-planner",
      finalCtaSecondaryLinkLabel: "WhatsApp Us",
      finalCtaSecondaryLinkHref: "/trip-planner",
    },
    create: {
      id: "homepage",
      heroBackgroundImage: "/photos/karnak.jpg",
      heroEyebrow: "Private Egypt · est. Luxor",
      heroHeadline: "Egypt, privately composed.",
      heroHeadlineAccent: "composed.",
      heroSubheadline:
        "Tailor-made Egypt journeys with private guides, elegant pacing, and calm planning from a Luxor-based team.",
      heroPrimaryCtaLabel: "Plan My Egypt Journey",
      heroPrimaryCtaHref: "/trip-planner",
      heroSecondaryLinkLabel: "Or Book Now",
      heroSecondaryLinkHref: "/trip-planner",
      heroTrustBadges: [
        "Local Egypt Travel Experts",
        "Private Tailor-Made Tours",
        "WhatsApp Support 24/7",
      ],
      destinationsEyebrow: "Where we travel",
      destinationsHeading: "From the Nile,",
      destinationsHeadingAccent: "outward.",
      destinationsViewAllLabel: "All destinations →",
      destinationsViewAllHref: "/destinations",
      featuredEyebrow: "Featured journeys",
      featuredHeading: "Polished private experiences,",
      featuredHeadingAccent: "ready to tailor.",
      featuredViewAllLabel: "View all tours",
      featuredViewAllHref: "/tours",
      whyEyebrow: "WHY JACK EGYPT TOUR",
      whyHeading: "Everything you need for a",
      whyHeadingAccent: "perfect Egypt journey",
      whyDescription:
        "From private guides to seamless logistics, we handle every detail of your Egypt experience — so you can focus on the wonder.",
      whyCtaLabel: "Plan Your Journey",
      whyCtaHref: "/trip-planner",
      whyCollageImage1: "/photos/karnak.jpg",
      whyCollageImage2: "/photos/hatshepsut.jpg",
      whyCollageImage3: "/photos/felucca.jpg",
      whyIncludedHeading: "What's included in every journey",
      whyServices: [
        { icon: "user-check", label: "Private Guides" },
        { icon: "hotel", label: "Hotel Bookings" },
        { icon: "car", label: "Airport Transfers" },
        { icon: "ship", label: "Nile Cruises" },
        { icon: "message", label: "24/7 WhatsApp" },
        { icon: "sparkles", label: "Tailor-Made" },
      ],
      ourWorldEyebrow: "Our world",
      ourWorldHeading: "A small team,",
      ourWorldHeadingAccent: "quietly capable.",
      ourWorldBody:
        "We are based in Luxor. We arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. We work in small numbers, with trusted guides, on WhatsApp time. Everything else is negotiable.",
      ourWorldImage: "/photos/hatshepsut.jpg",
      statsItems: [
        { value: "10+", label: "Years on the ground" },
        { value: "1,000+", label: "Travelers hosted" },
        { value: "50+", label: "Private routes" },
        { value: "24/7", label: "WhatsApp support" },
      ],
      statsBackgroundImage: "/photos/felucca.jpg",
      testimonialsEyebrow: "Traveler stories",
      testimonialsHeading: "Loved quietly,",
      testimonialsHeadingAccent: "from everywhere.",
      finalCtaBackgroundImage: "/photos/felucca.jpg",
      finalCtaEyebrow: "Start your booking",
      finalCtaHeading: "Ready when",
      finalCtaHeadingAccent: "you are.",
      finalCtaDescription:
        "Tell us what you have in mind. We will shape the route, guide style, pacing, and logistics around you.",
      finalCtaPrimaryButtonLabel: "Book Now",
      finalCtaPrimaryButtonHref: "/trip-planner",
      finalCtaSecondaryLinkLabel: "WhatsApp Us",
      finalCtaSecondaryLinkHref: "/trip-planner",
    },
  });

  await prisma.toursListingPage.upsert({
    where: { id: "tours-listing" },
    update: {
      heroBackgroundImage: "/photos/karnak.jpg",
      heroEyebrow: "Explore our tours",
      heroHeading: "Private Egypt Experiences",
      heroSubtitle: "{count} tours available",
      emptyStateMessage: "No tours match these filters yet.",
    },
    create: {
      id: "tours-listing",
      heroBackgroundImage: "/photos/karnak.jpg",
      heroEyebrow: "Explore our tours",
      heroHeading: "Private Egypt Experiences",
      heroSubtitle: "{count} tours available",
      emptyStateMessage: "No tours match these filters yet.",
    },
  });

  await prisma.destinationsListingPage.upsert({
    where: { id: "destinations-listing" },
    update: {
      heroBackgroundImage: "/photos/aswan.jpg",
      heroEyebrow: "Where We Travel",
      heroHeading: "Destinations Across Egypt",
      heroSubtitle: "{count} destinations to explore",
      emptyStateMessage: "No destinations are published yet.",
    },
    create: {
      id: "destinations-listing",
      heroBackgroundImage: "/photos/aswan.jpg",
      heroEyebrow: "Where We Travel",
      heroHeading: "Destinations Across Egypt",
      heroSubtitle: "{count} destinations to explore",
      emptyStateMessage: "No destinations are published yet.",
    },
  });

  await prisma.aboutPage.upsert({
    where: { id: "about" },
    update: {
      heroImage: "/photos/hatshepsut.jpg",
      heroEyebrow: "Our Story",
      heroHeading: "Jack Egypt Tour",
      heroSubtitle: "Luxor-based. Privately run.",
      whoEyebrow: "Who We Are",
      whoHeading: "A Luxor team, quietly capable.",
      whoBody:
        "Jack Egypt Tour is a Luxor-based team arranging private Egypt travel with local knowledge, calm communication, and polished delivery.\n\nWe arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. The work is practical and personal: clear timings, trusted guides, private vehicles, and responsive support.\n\nThe goal is not to sell every possible package. It is to help each traveler choose the right route, the right guide, and the right pace.",
      whoImage: "/photos/karnak.jpg",
      valuesEyebrow: "How We Work",
      valuesHeading: "Premium travel standards with Egyptian warmth.",
      valuesItems: [
        { eyebrow: "01", title: "Luxor-based", text: "We plan from the city where Egypt's archaeological days begin, not from a desk in another country." },
        { eyebrow: "02", title: "Private by default", text: "Trusted guides, private vehicles, and pacing shaped around your interests, your dates, and your light." },
        { eyebrow: "03", title: "On WhatsApp time", text: "Short inquiry flow, quick replies, and practical coordination before, during, and after travel." },
        { eyebrow: "04", title: "Tailored, not templated", text: "Day tours, Nile cruises, and multi-day routes composed for you, not pulled from a catalog." },
      ],
      statsItems: [
        { value: "10+", label: "Years" },
        { value: "1,000+", label: "Travelers" },
        { value: "50+", label: "Routes" },
        { value: "24/7", label: "Support" },
      ],
      ctaBackgroundImage: "/photos/felucca.jpg",
      ctaEyebrow: "Start your booking",
      ctaHeading: "Have questions? Let's talk.",
      ctaButtonLabel: "Book Now",
      ctaButtonHref: "/trip-planner",
    },
    create: {
      id: "about",
      heroImage: "/photos/hatshepsut.jpg",
      heroEyebrow: "Our Story",
      heroHeading: "Jack Egypt Tour",
      heroSubtitle: "Luxor-based. Privately run.",
      whoEyebrow: "Who We Are",
      whoHeading: "A Luxor team, quietly capable.",
      whoBody:
        "Jack Egypt Tour is a Luxor-based team arranging private Egypt travel with local knowledge, calm communication, and polished delivery.\n\nWe arrange private days at Karnak and the Valley of the Kings, slow Nile journeys to Aswan, dawn at Abu Simbel, and Red Sea finales. The work is practical and personal: clear timings, trusted guides, private vehicles, and responsive support.\n\nThe goal is not to sell every possible package. It is to help each traveler choose the right route, the right guide, and the right pace.",
      whoImage: "/photos/karnak.jpg",
      valuesEyebrow: "How We Work",
      valuesHeading: "Premium travel standards with Egyptian warmth.",
      valuesItems: [
        { eyebrow: "01", title: "Luxor-based", text: "We plan from the city where Egypt's archaeological days begin, not from a desk in another country." },
        { eyebrow: "02", title: "Private by default", text: "Trusted guides, private vehicles, and pacing shaped around your interests, your dates, and your light." },
        { eyebrow: "03", title: "On WhatsApp time", text: "Short inquiry flow, quick replies, and practical coordination before, during, and after travel." },
        { eyebrow: "04", title: "Tailored, not templated", text: "Day tours, Nile cruises, and multi-day routes composed for you, not pulled from a catalog." },
      ],
      statsItems: [
        { value: "10+", label: "Years" },
        { value: "1,000+", label: "Travelers" },
        { value: "50+", label: "Routes" },
        { value: "24/7", label: "Support" },
      ],
      ctaBackgroundImage: "/photos/felucca.jpg",
      ctaEyebrow: "Start your booking",
      ctaHeading: "Have questions? Let's talk.",
      ctaButtonLabel: "Book Now",
      ctaButtonHref: "/trip-planner",
    },
  });

  await prisma.contactPage.upsert({
    where: { id: "contact" },
    update: {
      heroImage: "/photos/luxor-temple.jpg",
      heroEyebrow: "Get In Touch",
      heroHeading: "Contact Us",
      heroSubtitle: "We reply within 24 hours",
      whatsappIcon: "message-circle",
      whatsappLabel: "WhatsApp",
      whatsappSubtitle: "Fastest way to reach us",
      emailIcon: "mail",
      emailLabel: "Email",
      emailSubtitle: "We reply within 24 hours",
      locationIcon: "map-pin",
      locationLabel: "Visit Us",
      locationSubtitle: "By appointment only",
      formHeading: "Send an inquiry",
      formSubheading: "Tell us a little about your Egypt plans.",
      successMessage: "Thank you. We will reply soon.",
      inquiryEmailRecipient: "info@jackegypttour.com",
      contactMapLocation: "Luxor, Egypt",
      contactMapZoom: 12,
      contactMapVisible: true,
    },
    create: {
      id: "contact",
      heroImage: "/photos/luxor-temple.jpg",
      heroEyebrow: "Get In Touch",
      heroHeading: "Contact Us",
      heroSubtitle: "We reply within 24 hours",
      whatsappIcon: "message-circle",
      whatsappLabel: "WhatsApp",
      whatsappSubtitle: "Fastest way to reach us",
      emailIcon: "mail",
      emailLabel: "Email",
      emailSubtitle: "We reply within 24 hours",
      locationIcon: "map-pin",
      locationLabel: "Visit Us",
      locationSubtitle: "By appointment only",
      formHeading: "Send an inquiry",
      formSubheading: "Tell us a little about your Egypt plans.",
      successMessage: "Thank you. We will reply soon.",
      inquiryEmailRecipient: "info@jackegypttour.com",
      contactMapLocation: "Luxor, Egypt",
      contactMapZoom: 12,
      contactMapVisible: true,
    },
  });

  await prisma.galleryPage.upsert({
    where: { id: "gallery" },
    update: {
      heroImage: "/photos/felucca.jpg",
      heroEyebrow: "Our Gallery",
      heroHeading: "Moments from Egypt",
      heroSubtitle: "Scenes from our private journeys",
      ctaHeading: "Want a private Egypt itinerary around these places?",
      ctaSubtext: "Tell us which destinations caught your eye, and we'll build the route.",
      ctaButtonLabel: "Book Now",
      ctaButtonHref: "/trip-planner",
    },
    create: {
      id: "gallery",
      heroImage: "/photos/felucca.jpg",
      heroEyebrow: "Our Gallery",
      heroHeading: "Moments from Egypt",
      heroSubtitle: "Scenes from our private journeys",
      ctaHeading: "Want a private Egypt itinerary around these places?",
      ctaSubtext: "Tell us which destinations caught your eye, and we'll build the route.",
      ctaButtonLabel: "Book Now",
      ctaButtonHref: "/trip-planner",
    },
  });

  await prisma.tripPlannerPage.upsert({
    where: { id: "trip-planner" },
    update: {
      heroImage: "/photos/pyramids.jpg",
      heroEyebrow: "Trip Planner",
      heroHeading: "Shape your private Egypt journey",
      heroHeadingAccent: "in four short steps.",
      heroSubtitle:
        "Share dates, destinations, travel style, and contact details. We prepare a clean WhatsApp brief so the Luxor team can reply quickly.",
      directWhatsappLabel: "Prefer direct WhatsApp?",
      stepLabels: ["Dates", "Destinations", "Style", "Contact"],
      successRedirectMessage: "Opening WhatsApp…",
      whatsappMessageTemplate:
        "Hello Jack Egypt Tour,\nI'd like to plan a trip. Here are my details:\n\n{fields}\n\nLooking forward to your reply.",
    },
    create: {
      id: "trip-planner",
      heroImage: "/photos/pyramids.jpg",
      heroEyebrow: "Trip Planner",
      heroHeading: "Shape your private Egypt journey",
      heroHeadingAccent: "in four short steps.",
      heroSubtitle:
        "Share dates, destinations, travel style, and contact details. We prepare a clean WhatsApp brief so the Luxor team can reply quickly.",
      directWhatsappLabel: "Prefer direct WhatsApp?",
      stepLabels: ["Dates", "Destinations", "Style", "Contact"],
      successRedirectMessage: "Opening WhatsApp…",
      whatsappMessageTemplate:
        "Hello Jack Egypt Tour,\nI'd like to plan a trip. Here are my details:\n\n{fields}\n\nLooking forward to your reply.",
    },
  });

  await prisma.globalSettings.upsert({
    where: { id: "global" },
    update: {
      whatsappNumber: "201096586292",
      globalWhatsappNumber: "201096586292",
      phone: "+20 1096586292",
      globalPhoneNumber: "+20 1096586292",
      email: "info@jackegypttour.com",
      globalEmail: "info@jackegypttour.com",
      address: "Luxor, Egypt",
      facebookUrl: "",
      socialFacebook: "",
      instagramUrl: "",
      socialInstagram: "",
      tripAdvisorUrl: "",
      socialTripadvisor: "",
      socialTwitter: "",
      socialYoutube: "",
      siteFavicon: "/favicon.ico",
      defaultSeoTitle: "Jack Egypt Tour | Luxury Egypt Private Tours",
      defaultSeoDescription:
        "Private tailor-made Egypt tours and DMC services from Luxor-based experts.",
      defaultOgImage: "/photos/karnak.jpg",
    },
    create: {
      id: "global",
      whatsappNumber: "201096586292",
      globalWhatsappNumber: "201096586292",
      phone: "+20 1096586292",
      globalPhoneNumber: "+20 1096586292",
      email: "info@jackegypttour.com",
      globalEmail: "info@jackegypttour.com",
      address: "Luxor, Egypt",
      facebookUrl: "",
      socialFacebook: "",
      instagramUrl: "",
      socialInstagram: "",
      tripAdvisorUrl: "",
      socialTripadvisor: "",
      socialTwitter: "",
      socialYoutube: "",
      siteFavicon: "/favicon.ico",
      defaultSeoTitle: "Jack Egypt Tour | Luxury Egypt Private Tours",
      defaultSeoDescription:
        "Private tailor-made Egypt tours and DMC services from Luxor-based experts.",
      defaultOgImage: "/photos/karnak.jpg",
    },
  });

  await prisma.headerFooter.upsert({
    where: { id: "header-footer" },
    update: {
      logoText: "JACK",
      logoLine1: "JACK",
      logoSubtitle: "EGYPT TOUR",
      logoLine2: "EGYPT TOUR",
      headerNavLinks: [
        { label: "Tours", url: "/tours" },
        { label: "Activities", url: "/activities" },
        { label: "Hotels", url: "/hotels" },
        { label: "Gallery", url: "/gallery" },
        { label: "About", url: "/about" },
      ],
      navLink1Label: "Tours",
      navLink1Url: "/tours",
      navLink2Label: "Activities",
      navLink2Url: "/activities",
      navLink3Label: "Gallery",
      navLink3Url: "/gallery",
      navLink4Label: "About",
      navLink4Url: "/about",
      bookNowLabel: "BOOK NOW",
      bookNowHref: "/trip-planner",
      footerTagline: "Luxor-based luxury tours",
      footerDescription:
        "Luxury Egypt tours, Nile cruise planning, and practical DMC support from a Luxor-based team.",
      footerCol1Heading: "Explore",
      footerCol1Links: [
        { label: "Tours", url: "/tours" },
        { label: "Destinations", url: "/destinations" },
        { label: "Gallery", url: "/gallery" },
        { label: "Blog", url: "/blog" },
        { label: "Trip Planner", url: "/trip-planner" },
        { label: "Contact", url: "/contact" },
        { label: "FAQ", url: "/faq" },
      ],
      footerCol2Heading: "Contact",
      footerExploreLinks: [
        { label: "Tours", url: "/tours" },
        { label: "Destinations", url: "/destinations" },
        { label: "Gallery", url: "/gallery" },
        { label: "Blog", url: "/blog" },
        { label: "Trip Planner", url: "/trip-planner" },
        { label: "Contact", url: "/contact" },
        { label: "FAQ", url: "/faq" },
      ],
      footerCopyright: "© 2026 Jack Egypt Tour. All rights reserved.",
      footerCopyrightText: "All rights reserved.",
      footerWhatsappLabel: "Book Now",
    },
    create: {
      id: "header-footer",
      logoText: "JACK",
      logoLine1: "JACK",
      logoSubtitle: "EGYPT TOUR",
      logoLine2: "EGYPT TOUR",
      headerNavLinks: [
        { label: "Tours", url: "/tours" },
        { label: "Activities", url: "/activities" },
        { label: "Hotels", url: "/hotels" },
        { label: "Gallery", url: "/gallery" },
        { label: "About", url: "/about" },
      ],
      navLink1Label: "Tours",
      navLink1Url: "/tours",
      navLink2Label: "Activities",
      navLink2Url: "/activities",
      navLink3Label: "Gallery",
      navLink3Url: "/gallery",
      navLink4Label: "About",
      navLink4Url: "/about",
      bookNowLabel: "BOOK NOW",
      bookNowHref: "/trip-planner",
      footerTagline: "Luxor-based luxury tours",
      footerDescription:
        "Luxury Egypt tours, Nile cruise planning, and practical DMC support from a Luxor-based team.",
      footerCol1Heading: "Explore",
      footerCol1Links: [
        { label: "Tours", url: "/tours" },
        { label: "Destinations", url: "/destinations" },
        { label: "Gallery", url: "/gallery" },
        { label: "Blog", url: "/blog" },
        { label: "Trip Planner", url: "/trip-planner" },
        { label: "Contact", url: "/contact" },
        { label: "FAQ", url: "/faq" },
      ],
      footerCol2Heading: "Contact",
      footerExploreLinks: [
        { label: "Tours", url: "/tours" },
        { label: "Destinations", url: "/destinations" },
        { label: "Gallery", url: "/gallery" },
        { label: "Blog", url: "/blog" },
        { label: "Trip Planner", url: "/trip-planner" },
        { label: "Contact", url: "/contact" },
        { label: "FAQ", url: "/faq" },
      ],
      footerCopyright: "© 2026 Jack Egypt Tour. All rights reserved.",
      footerCopyrightText: "All rights reserved.",
      footerWhatsappLabel: "Book Now",
    },
  });

  const galleryCategories = ["Luxor", "Nile Cruise", "Cairo", "Experiences"];

  for (const [order, name] of galleryCategories.entries()) {
    await prisma.galleryCategory.upsert({
      where: { slug: name.toLowerCase().replace(/\s+/g, "-") },
      update: { name, order, active: true },
      create: {
        slug: name.toLowerCase().replace(/\s+/g, "-"),
        name,
        order,
        active: true,
      },
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
