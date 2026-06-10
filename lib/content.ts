export type Tour = {
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  duration: string;
  groupSize: string;
  departurePoint: string;
  languages: string[];
  priceFrom: number;
  priceCurrency: string;
  included: string[];
  excluded: string[];
  itinerary: Array<{ title: string; description: string }>;
  heroImage: string;
  images: string[];
  featured: boolean;
};

export type Destination = {
  slug: string;
  name: string;
  overview: string;
  highlights: string[];
  heroImage: string;
};

export type FAQItem = {
  category: "Booking" | "Tours" | "Payments" | "Safety" | "Custom Trips";
  question: string;
  answer: string;
};

export type GalleryImage = {
  url: string;
  alt: string;
  category: "Luxor" | "Nile Cruise" | "Cairo" | "Experiences";
};

export type BlogArticle = {
  slug: string;
  title: string;
  excerpt: string;
  publishedAt: string;
  readTime: string;
  heroImage: string;
  sections: Array<{ heading: string; body: string }>;
};

export const tours: Tour[] = [
  {
    slug: "private-valley-of-the-kings-karnak-temple-tour",
    title: "Private Valley of the Kings & Karnak Temple Tour",
    category: "Day Tours",
    shortDescription: "A refined private Luxor day tour with an expert Egyptologist.",
    overview:
      "Trace the power and poetry of ancient Thebes with a private Egyptologist, quiet pacing, and flexible time at the monuments that matter most. This experience is designed for travelers who want Luxor handled beautifully without feeling rushed.",
    highlights: [
      "Private Egyptologist-led touring",
      "Valley of the Kings and Karnak Temple",
      "Air-conditioned private vehicle",
      "Flexible start time and WhatsApp support",
    ],
    duration: "1 day",
    groupSize: "Private",
    departurePoint: "Luxor hotel or Nile cruise",
    languages: ["English", "Arabic"],
    priceFrom: 180,
    priceCurrency: "USD",
    included: ["Private guide", "Air-conditioned vehicle", "Pickup and drop-off"],
    excluded: ["Entrance fees", "Meals unless listed", "Personal expenses"],
    itinerary: [
      {
        title: "West Bank arrival",
        description: "Begin with hotel or cruise pickup and cross to the Theban necropolis.",
      },
      {
        title: "Valley of the Kings",
        description: "Explore royal tombs with context from your private Egyptologist.",
      },
      {
        title: "Karnak Temple",
        description: "Continue to Karnak for a polished walkthrough of Egypt's largest temple complex.",
      },
    ],
    heroImage:
      "/photos/karnak.jpg",
    images: [
      "/photos/valley-of-kings.jpg",
      "/photos/hatshepsut.jpg",
      "/photos/luxor-temple.jpg",
    ],
    featured: true,
  },
  {
    slug: "3-day-luxor-aswan-nile-cruise-experience",
    title: "3-Day Luxor & Aswan Nile Cruise Experience",
    category: "Nile Cruises",
    shortDescription: "A compact Nile cruise experience between Luxor and Aswan.",
    overview:
      "A graceful short Nile journey pairing temple visits with unhurried river time. Jack Egypt Tour coordinates cruise selection, transfers, guiding, and on-the-ground support so the route feels seamless.",
    highlights: [
      "Curated Nile cruise planning",
      "Luxor and Aswan landmark visits",
      "Private transfers and local support",
      "Ideal for compact Egypt itineraries",
    ],
    duration: "3 days",
    groupSize: "Private arrangements",
    departurePoint: "Luxor",
    languages: ["English", "Arabic"],
    priceFrom: 520,
    priceCurrency: "USD",
    included: ["Cruise coordination", "Private transfers", "Guided sightseeing"],
    excluded: ["International flights", "Optional excursions", "Personal expenses"],
    itinerary: [
      {
        title: "Luxor embarkation",
        description: "Board your selected cruise and begin with guided Luxor sightseeing.",
      },
      {
        title: "Nile sailing",
        description: "Continue along the Nile with temple stops and quiet time on board.",
      },
      {
        title: "Aswan finish",
        description: "End with Aswan arrangements and onward transfer support.",
      },
    ],
    heroImage:
      "/photos/felucca.jpg",
    images: [
      "/photos/nile.jpg",
      "/photos/alexandria.jpg",
      "/photos/aswan.jpg",
    ],
    featured: true,
  },
  {
    slug: "7-day-egypt-highlights-cairo-luxor-aswan",
    title: "7-Day Egypt Highlights: Cairo, Luxor & Aswan",
    category: "Multi-Day Packages",
    shortDescription: "A private Egypt itinerary connecting the country's essential landmarks.",
    overview:
      "A polished first journey through Egypt, shaped around Cairo, Luxor, and Aswan with private guiding and carefully paced days. Built for travelers who want the classics without the template feel.",
    highlights: [
      "Cairo, Luxor, and Aswan in one private itinerary",
      "Pyramids, museums, temples, and Nile moments",
      "Handpicked guides and drivers",
      "Daily WhatsApp coordination",
    ],
    duration: "7 days",
    groupSize: "Private",
    departurePoint: "Cairo",
    languages: ["English", "Arabic"],
    priceFrom: 1250,
    priceCurrency: "USD",
    included: ["Private guiding", "Domestic coordination", "Airport and hotel transfers"],
    excluded: ["Flights", "Entry tickets", "Meals unless listed"],
    itinerary: [
      {
        title: "Cairo opening",
        description: "Start with the Pyramids, museum time, and a private city introduction.",
      },
      {
        title: "Luxor depth",
        description: "Move south for the temples and tombs of ancient Thebes.",
      },
      {
        title: "Aswan finale",
        description: "Finish with Nubian scenery, Philae Temple, and flexible onward arrangements.",
      },
    ],
    heroImage:
      "/photos/pyramids.jpg",
    images: [
      "/photos/pyramids.jpg",
      "/photos/abu-simbel.jpg",
      "/photos/luxor-temple.jpg",
    ],
    featured: true,
  },
  {
    slug: "luxury-luxor-private-egyptologist-hot-air-balloon",
    title: "Luxury Luxor: Private Egyptologist & Hot Air Balloon",
    category: "Luxury Tours",
    shortDescription: "A premium Luxor experience with sunrise ballooning and private guiding.",
    overview:
      "Begin above the West Bank at sunrise, then continue into a private day curated around Luxor's finest archaeological experiences. The day is built with comfort, timing, and atmosphere in mind.",
    highlights: [
      "Sunrise hot air balloon coordination",
      "Private Egyptologist and premium vehicle",
      "Elegant pacing for photography and rest",
      "Ideal for couples and milestone trips",
    ],
    duration: "1 day",
    groupSize: "Private",
    departurePoint: "Luxor",
    languages: ["English", "Arabic"],
    priceFrom: 320,
    priceCurrency: "USD",
    included: ["Balloon coordination", "Private guide", "Premium vehicle"],
    excluded: ["Entrance fees", "Meals unless listed", "Personal purchases"],
    itinerary: [
      {
        title: "Sunrise flight",
        description: "Early pickup and balloon experience over Luxor's West Bank landscape.",
      },
      {
        title: "Private temple touring",
        description: "Continue with an Egyptologist-led route tailored to your interests.",
      },
      {
        title: "Unhurried return",
        description: "End with flexible drop-off and support for evening plans.",
      },
    ],
    heroImage:
      "/photos/hatshepsut.jpg",
    images: [
      "/photos/valley-of-kings.jpg",
      "/photos/luxor-temple.jpg",
      "/photos/hatshepsut.jpg",
    ],
    featured: true,
  },
  {
    slug: "tailor-made-egypt-journey",
    title: "Tailor-Made Egypt Journey",
    category: "Custom Egypt Tours",
    shortDescription: "A flexible private journey designed around your dates, pace, and interests.",
    overview:
      "Share your dates, travel style, preferred hotels, and dream stops. Jack Egypt Tour turns the brief into a practical, elegant Egypt itinerary with WhatsApp-first planning from a local team.",
    highlights: [
      "Built around your dates and priorities",
      "Luxor-based local planning",
      "Private guides, transfers, and cruise options",
      "Simple WhatsApp-led inquiry flow",
    ],
    duration: "Custom",
    groupSize: "Private",
    departurePoint: "Flexible",
    languages: ["English", "Arabic"],
    priceFrom: 0,
    priceCurrency: "USD",
    included: ["Custom itinerary design", "Local supplier coordination", "WhatsApp planning"],
    excluded: ["Items confirmed after proposal", "Flights", "Travel insurance"],
    itinerary: [
      {
        title: "Share your brief",
        description: "Send dates, group size, interests, and hotel preferences.",
      },
      {
        title: "Receive a curated route",
        description: "Review a custom Egypt proposal shaped around your travel style.",
      },
      {
        title: "Travel with local support",
        description: "Move through Egypt with responsive coordination from Luxor.",
      },
    ],
    heroImage:
      "/photos/felucca.jpg",
    images: [
      "/photos/karnak.jpg",
      "/photos/aswan.jpg",
      "/photos/nile.jpg",
    ],
    featured: true,
  },
];

export const destinations: Destination[] = [
  {
    slug: "luxor",
    name: "Luxor",
    overview:
      "The home base of Jack Egypt Tour, where temples, tombs, river light, and private Egyptologist-led touring come together with rare depth.",
    highlights: ["Valley of the Kings", "Karnak Temple", "Luxor Temple", "West Bank villages"],
    heroImage:
      "/photos/karnak.jpg",
  },
  {
    slug: "cairo",
    name: "Cairo",
    overview:
      "Egypt's grand opening chapter: pyramids, museums, Islamic Cairo, and modern city energy shaped into a private, polished itinerary.",
    highlights: ["Giza Pyramids", "Grand Egyptian Museum", "Islamic Cairo", "Khan el-Khalili"],
    heroImage:
      "/photos/pyramids.jpg",
  },
  {
    slug: "aswan",
    name: "Aswan",
    overview:
      "A softer Nile rhythm with Nubian culture, island landscapes, and graceful temple visits that pair beautifully with Luxor.",
    highlights: ["Philae Temple", "Nubian village", "Nile islands", "Abu Simbel extensions"],
    heroImage:
      "/photos/felucca.jpg",
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    overview:
      "A Red Sea extension for travelers who want beach time, diving, or a restful finish after temples and Nile touring.",
    highlights: ["Red Sea resorts", "Diving and snorkeling", "Family stays", "Luxor extensions"],
    heroImage:
      "/photos/hurghada.jpg",
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    overview:
      "Mediterranean Egypt with coastal atmosphere, Greco-Roman history, and a distinct rhythm from Cairo and Upper Egypt.",
    highlights: ["Mediterranean coast", "Bibliotheca Alexandrina", "Catacombs", "Coastal dining"],
    heroImage:
      "/photos/alexandria.jpg",
  },
];

export const tourCategories = [
  "Day Tours",
  "Nile Cruises",
  "Luxury Tours",
  "Custom Egypt Tours",
  "Multi-Day Packages",
];

export const faqs: FAQItem[] = [
  {
    category: "Booking",
    question: "How far in advance should I book a private Luxor tour?",
    answer:
      "Two to four weeks is ideal for popular dates, especially during October through April. If your trip is close, message us on WhatsApp and we will confirm realistic availability quickly.",
  },
  {
    category: "Booking",
    question: "Can I change the start time of a tour?",
    answer:
      "Most private tours can be adjusted around hotel pickup, cruise schedules, heat, and photography preferences. We confirm the best timing during your WhatsApp planning conversation.",
  },
  {
    category: "Tours",
    question: "Are your tours private or group tours?",
    answer:
      "The MVP focuses on private tours and tailor-made arrangements. This gives you better pacing, clearer guide access, and more flexibility than a standard group itinerary.",
  },
  {
    category: "Tours",
    question: "Do you provide licensed Egyptologist guides?",
    answer:
      "Yes. For historical sightseeing, we prioritize professional guides with strong local knowledge and the ability to explain ancient sites in a clear, international style.",
  },
  {
    category: "Payments",
    question: "What payment methods do you accept?",
    answer:
      "Payment details depend on the tour, timing, and service mix. We keep this simple in the MVP and confirm the safest practical option before booking.",
  },
  {
    category: "Payments",
    question: "Do prices include entrance tickets?",
    answer:
      "Tour cards show guide pricing only unless noted otherwise. Entrance fees, meals, and optional extras are clarified in your final WhatsApp proposal.",
  },
  {
    category: "Safety",
    question: "Is Luxor safe for private tours?",
    answer:
      "Luxor is a well-established travel destination. We use trusted drivers, practical routing, and clear pickup details so travelers feel comfortable and supported.",
  },
  {
    category: "Safety",
    question: "Can you support families or older travelers?",
    answer:
      "Yes. Private pacing is useful for families, older travelers, and guests who prefer shade breaks, shorter walking sections, or calmer timing.",
  },
  {
    category: "Custom Trips",
    question: "Can you build a full Egypt itinerary?",
    answer:
      "Yes. Share your dates, interests, hotel preference, and must-see places through the Trip Planner. We can shape Luxor, Cairo, Aswan, Nile cruise, and Red Sea extensions.",
  },
  {
    category: "Custom Trips",
    question: "Can travel agents and tour operators work with you?",
    answer:
      "Yes. Jack Egypt Tour can support selected B2B requests for local services, groups, and destination management basics without a full portal in this MVP.",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    category: "Luxor",
    alt: "Karnak Temple columns in Luxor",
    url: "/photos/hatshepsut.jpg",
  },
  {
    category: "Luxor",
    alt: "Ancient Egyptian temple at golden hour",
    url: "/photos/karnak.jpg",
  },
  {
    category: "Nile Cruise",
    alt: "Nile river view from a cruise journey",
    url: "/photos/felucca.jpg",
  },
  {
    category: "Nile Cruise",
    alt: "River landscape in Upper Egypt",
    url: "/photos/aswan.jpg",
  },
  {
    category: "Cairo",
    alt: "Giza pyramids near Cairo",
    url: "/photos/pyramids.jpg",
  },
  {
    category: "Cairo",
    alt: "Egyptian pyramids and desert",
    url: "/photos/pyramids.jpg",
  },
  {
    category: "Experiences",
    alt: "Hot air balloon experience above desert landscape",
    url: "/photos/hatshepsut.jpg",
  },
  {
    category: "Experiences",
    alt: "Egypt travel experience in warm light",
    url: "/photos/hatshepsut.jpg",
  },
];

export const blogArticles: BlogArticle[] = [
  {
    slug: "best-time-to-visit-luxor",
    title: "Best Time to Visit Luxor",
    excerpt:
      "A practical guide to Luxor's travel seasons, comfortable sightseeing hours, and when private touring makes the biggest difference.",
    publishedAt: "2026-01-12",
    readTime: "4 min read",
    heroImage:
      "/photos/karnak.jpg",
    sections: [
      {
        heading: "The most comfortable months",
        body: "October through April is generally the most comfortable window for Luxor sightseeing. Days are cooler, temple visits feel easier, and private pacing can be shaped around soft morning and afternoon light.",
      },
      {
        heading: "Summer can still work with planning",
        body: "Summer requires an early start, shaded breaks, and realistic expectations. A private guide and driver help reduce waiting, unnecessary walking, and heat exposure.",
      },
      {
        heading: "How Jack Egypt Tour plans timing",
        body: "We recommend pickup times around your hotel, cruise schedule, and priority sites rather than forcing every traveler into the same fixed template.",
      },
    ],
  },
  {
    slug: "how-many-days-do-you-need-in-egypt",
    title: "How Many Days Do You Need in Egypt?",
    excerpt:
      "A simple way to think about Egypt itinerary length, from a focused Luxor stay to a full Cairo, Luxor, Aswan journey.",
    publishedAt: "2026-01-18",
    readTime: "5 min read",
    heroImage:
      "/photos/felucca.jpg",
    sections: [
      {
        heading: "Four to five days",
        body: "A short Egypt trip can work when it is focused. Cairo plus Luxor gives first-time travelers a strong introduction without trying to include every region.",
      },
      {
        heading: "Seven to ten days",
        body: "This is the most balanced range for Cairo, Luxor, Aswan, and perhaps a Nile cruise. It allows depth without overloading travel days.",
      },
      {
        heading: "Two weeks or more",
        body: "Longer trips can include the Red Sea, Alexandria, Abu Simbel, or slower luxury pacing. Custom planning becomes especially useful at this length.",
      },
    ],
  },
  {
    slug: "private-tours-vs-group-tours-in-egypt",
    title: "Private Tours vs Group Tours in Egypt",
    excerpt:
      "How to decide between private touring and group touring when comfort, timing, guide access, and flexibility matter.",
    publishedAt: "2026-01-25",
    readTime: "4 min read",
    heroImage:
      "/photos/luxor-temple.jpg",
    sections: [
      {
        heading: "Private tours give better pacing",
        body: "Egypt's major sites reward context and time. Private touring lets you pause for questions, adjust walking pace, and avoid the rhythm of a large bus group.",
      },
      {
        heading: "Group tours can be economical",
        body: "Group tours can suit travelers who prioritize price and do not mind fixed schedules. The tradeoff is usually less flexibility and less direct guide access.",
      },
      {
        heading: "Who should choose private",
        body: "Families, couples, older travelers, photographers, and guests with a short time window usually benefit most from private arrangements.",
      },
    ],
  },
  {
    slug: "first-time-traveler-guide-to-egypt",
    title: "First-Time Traveler Guide to Egypt",
    excerpt:
      "A calm, practical primer for first-time visitors: pacing, WhatsApp planning, guide quality, and how to avoid itinerary overload.",
    publishedAt: "2026-02-02",
    readTime: "6 min read",
    heroImage:
      "/photos/abu-simbel.jpg",
    sections: [
      {
        heading: "Do fewer places better",
        body: "Egypt is rich and intense. A stronger first trip usually includes fewer destinations with better guiding, more rest, and well-timed transfers.",
      },
      {
        heading: "Use WhatsApp for clarity",
        body: "Fast messaging is useful for pickups, timing changes, and small questions. It also makes the planning stage feel more human and practical.",
      },
      {
        heading: "Keep room for atmosphere",
        body: "The best Egypt trips are not only checklists. Leave time for river light, quiet temple corners, and local guidance that responds to the day.",
      },
    ],
  },
];

export function getBlogArticleBySlug(slug: string) {
  return blogArticles.find((article) => article.slug === slug);
}

export function getTourBySlug(slug: string) {
  return tours.find((tour) => tour.slug === slug);
}

export function getDestinationBySlug(slug: string) {
  return destinations.find((destination) => destination.slug === slug);
}

export function formatPrice(tour: Tour) {
  if (!tour.priceFrom) {
    return "Custom quote";
  }

  return `From ${tour.priceCurrency} ${tour.priceFrom.toLocaleString("en-US")}`;
}
