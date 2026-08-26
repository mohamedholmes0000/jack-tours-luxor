export type Tour = {
  contentType?: "TOUR" | "ACTIVITY" | "HOTEL";
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  overview: string;
  highlights: string[];
  duration: string;
  city: string;
  rating: number;
  reviewCount: number;
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
  description: string;
  bestTime: string;
  duration: string;
  region: string;
  type: "City" | "Archaeological Site" | "Coastal / Beach" | "River / Cruise Route";
  coverImage: string;
  highlights: Array<{
    title: string;
    image: string;
    description: string;
  }>;
  heroImage: string;
};

export type HomepageCityDestination = {
  slug: string;
  name: string;
  subtitle: string;
  image: string;
  href: string;
  tourSearchTerms: string[];
};

export type FAQItem = {
  category: "Booking" | "Tours" | "Payments" | "Safety" | "Custom Trips";
  question: string;
  answer: string;
};

export type GalleryImage = {
  id?: string;
  url: string;
  alt: string;
  title: string;
  description: string;
  caption?: string;
  category: "Luxor" | "Nile Cruise" | "Cairo" | "Experiences" | string;
  order?: number;
};

export type GalleryAlbum = {
  id?: string;
  title: string;
  slug: string;
  description: string;
  coverImage: string;
  category: string;
  imageCount: number;
  images: GalleryImage[];
};

export const homepageCityDestinations: HomepageCityDestination[] = [
  {
    slug: "luxor",
    name: "Luxor",
    subtitle: "Heart of Ancient Egypt",
    image: "/photos/luxor-temple.jpg",
    href: "/destinations/luxor",
    tourSearchTerms: ["luxor", "karnak", "valley of the kings", "thebes", "west bank"],
  },
  {
    slug: "aswan",
    name: "Aswan",
    subtitle: "Gateway to Nubia",
    image: "/photos/aswan.jpg",
    href: "/destinations/aswan",
    tourSearchTerms: ["aswan", "nubian", "philae", "kom ombo", "edfu"],
  },
  {
    slug: "cairo",
    name: "Cairo",
    subtitle: "Pyramids & Beyond",
    image: "/photos/pyramids.jpg",
    href: "/destinations/cairo",
    tourSearchTerms: ["cairo", "pyramids", "giza", "museum"],
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    subtitle: "Red Sea Coast",
    image: "/photos/hurghada.jpg",
    href: "/destinations/hurghada",
    tourSearchTerms: ["hurghada"],
  },
  {
    slug: "abu-simbel",
    name: "Abu Simbel",
    subtitle: "Ramesses' Legacy",
    image: "/photos/abu-simbel.jpg",
    href: "/tours?city=abu-simbel",
    tourSearchTerms: ["abu simbel", "ramesses", "lake nasser"],
  },
  {
    slug: "red-sea",
    name: "Red Sea",
    subtitle: "Coral & Coastline",
    image: "/photos/red-sea.jpg",
    href: "/destinations/hurghada",
    tourSearchTerms: ["red sea", "hurghada", "diving", "snorkeling", "reef"],
  },
];

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
    city: "Luxor",
    rating: 4.9,
    reviewCount: 12,
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
      "A graceful short Nile journey pairing temple visits with unhurried river time. Jack Luxor Tour coordinates cruise selection, transfers, guiding, and on-the-ground support so the route feels seamless.",
    highlights: [
      "Curated Nile cruise planning",
      "Luxor and Aswan landmark visits",
      "Private transfers and local support",
      "Ideal for compact Egypt itineraries",
    ],
    duration: "3 days",
    city: "Aswan",
    rating: 4.8,
    reviewCount: 9,
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
    city: "Cairo",
    rating: 4.9,
    reviewCount: 14,
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
    city: "Luxor",
    rating: 4.9,
    reviewCount: 7,
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
      "Share your dates, travel style, preferred hotels, and dream stops. Jack Luxor Tour turns the brief into a practical, elegant Egypt itinerary with WhatsApp-first planning from a local team.",
    highlights: [
      "Built around your dates and priorities",
      "Luxor-based local planning",
      "Private guides, transfers, and cruise options",
      "Simple WhatsApp-led inquiry flow",
    ],
    duration: "Custom",
    city: "Luxor",
    rating: 0,
    reviewCount: 0,
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
      "The home base of Jack Luxor Tour, where temples, tombs, river light, and private Egyptologist-led touring come together with rare depth.",
    description:
      "Luxor is the open-air heart of ancient Egypt, where daily life moves beside temples, tombs, and the Nile. The city gives travelers rare access to both monumental history and quiet local rhythm, from sunrise balloon views to golden afternoons at Karnak. It is the natural base for private Egyptologist-led touring because the great sites are close, layered, and best experienced with time to pause.",
    bestTime: "October to April",
    duration: "2-4 days",
    region: "Upper Egypt",
    type: "City",
    coverImage: "/photos/luxor-temple.jpg",
    highlights: [
      {
        title: "Valley of the Kings",
        image: "/photos/valley-of-kings.jpg",
        description:
          "Explore royal tombs cut deep into the Theban mountains, including beautifully preserved chambers shaped for eternity.",
      },
      {
        title: "Karnak Temple",
        image: "/photos/karnak.jpg",
        description:
          "Walk through vast courts, pylons, and the Great Hypostyle Hall, one of Egypt's most atmospheric temple spaces.",
      },
      {
        title: "Luxor Temple",
        image: "/photos/luxor-temple.jpg",
        description:
          "See the city glow around a riverside temple that connects ancient ceremony with modern Luxor life.",
      },
      {
        title: "West Bank villages",
        image: "/photos/hatshepsut.jpg",
        description:
          "Balance the major monuments with quieter roads, local villages, and desert-edge views across the west bank.",
      },
    ],
    heroImage:
      "/photos/karnak.jpg",
  },
  {
    slug: "cairo",
    name: "Cairo",
    overview:
      "Egypt's grand opening chapter: pyramids, museums, Islamic Cairo, and modern city energy shaped into a private, polished itinerary.",
    description:
      "Cairo is where ancient grandeur and contemporary Egypt meet at full volume. The pyramids anchor the city's story, while museums, medieval lanes, mosques, markets, and Nile views reveal a capital with many layers. For travelers, Cairo works best as a carefully paced private experience that turns a vast city into a clear, elegant introduction to Egypt.",
    bestTime: "October to April",
    duration: "2-3 days",
    region: "Lower Egypt",
    type: "City",
    coverImage: "/photos/pyramids.jpg",
    highlights: [
      {
        title: "Giza Pyramids",
        image: "/photos/pyramids.jpg",
        description:
          "Stand beside Egypt's most iconic monuments with time for viewpoints, context, and unhurried photography.",
      },
      {
        title: "Grand Egyptian Museum",
        image: "/photos/pyramids.jpg",
        description:
          "Follow the story of ancient Egypt through a world-class collection near the Giza plateau.",
      },
      {
        title: "Islamic Cairo",
        image: "/photos/alexandria.jpg",
        description:
          "Move through historic streets, mosques, and gates where medieval Cairo still feels vivid and lived-in.",
      },
      {
        title: "Khan el-Khalili",
        image: "/photos/pyramids.jpg",
        description:
          "Add a lively market stop for brass, textiles, coffee houses, and the atmosphere of old Cairo.",
      },
    ],
    heroImage:
      "/photos/pyramids.jpg",
  },
  {
    slug: "aswan",
    name: "Aswan",
    overview:
      "A softer Nile rhythm with Nubian culture, island landscapes, and graceful temple visits that pair beautifully with Luxor.",
    description:
      "Aswan has a gentler rhythm than Egypt's larger cities, shaped by granite islands, feluccas, Nubian color, and wide Nile light. Its temples and villages feel especially rewarding when the day is planned around the river, not rushed from stop to stop. For travelers continuing from Luxor, Aswan adds softness, scenery, and a deeper sense of southern Egypt.",
    bestTime: "October to March",
    duration: "2-3 days",
    region: "Upper Egypt",
    type: "City",
    coverImage: "/photos/aswan.jpg",
    highlights: [
      {
        title: "Philae Temple",
        image: "/photos/aswan.jpg",
        description:
          "Reach the island sanctuary by boat and explore one of Egypt's most elegant late temples.",
      },
      {
        title: "Nubian village",
        image: "/photos/nile.jpg",
        description:
          "Meet the color, hospitality, and riverside culture that make Aswan distinct from the rest of Egypt.",
      },
      {
        title: "Nile islands",
        image: "/photos/felucca.jpg",
        description:
          "Slow the pace with felucca sailing, botanical views, and quiet stretches of the river.",
      },
      {
        title: "Abu Simbel extensions",
        image: "/photos/abu-simbel.jpg",
        description:
          "Add a dramatic journey south to the colossal temples of Ramesses II near Lake Nasser.",
      },
    ],
    heroImage:
      "/photos/felucca.jpg",
  },
  {
    slug: "hurghada",
    name: "Hurghada",
    overview:
      "A Red Sea extension for travelers who want beach time, diving, or a restful finish after temples and Nile touring.",
    description:
      "Hurghada brings the Red Sea into an Egypt itinerary with clear water, easy resort comfort, and a slower coastal tempo. It is a useful finale after temple-heavy touring, especially for families or travelers who want diving, snorkeling, and rest. From Luxor, it can be planned as a simple transfer extension without losing the private, coordinated feel of the journey.",
    bestTime: "March to June, September to November",
    duration: "2-5 days",
    region: "Red Sea Coast",
    type: "Coastal / Beach",
    coverImage: "/photos/hurghada.jpg",
    highlights: [
      {
        title: "Red Sea resorts",
        image: "/photos/hurghada.jpg",
        description:
          "Choose a relaxed coastal base with beach time, pools, and easy access to marine activities.",
      },
      {
        title: "Diving and snorkeling",
        image: "/photos/red-sea.jpg",
        description:
          "Discover reefs, clear water, and boat trips suited to both beginners and experienced divers.",
      },
      {
        title: "Family stays",
        image: "/photos/hurghada.jpg",
        description:
          "Add a comfortable pause with space, swimming, and a lighter rhythm after cultural touring.",
      },
      {
        title: "Luxor extensions",
        image: "/photos/karnak.jpg",
        description:
          "Connect the Red Sea with Luxor temples and tombs through a private overland transfer.",
      },
    ],
    heroImage:
      "/photos/hurghada.jpg",
  },
  {
    slug: "abu-simbel",
    name: "Abu Simbel",
    overview:
      "A monumental southern extension where the temples of Ramesses II rise beside Lake Nasser with rare scale and drama.",
    description:
      "Abu Simbel is one of Egypt's most powerful destination moments, remote enough to feel like a true journey and monumental enough to reward the effort. The twin temples were carved for Ramesses II and later moved in a modern engineering rescue that adds another layer to the story. For private travelers, Abu Simbel works best as a carefully timed extension from Aswan, with space to absorb both the history and the desert setting.",
    bestTime: "October to March",
    duration: "1 day",
    region: "Upper Egypt",
    type: "Archaeological Site",
    coverImage: "/photos/abu-simbel.jpg",
    highlights: [
      {
        title: "Great Temple of Ramesses II",
        image: "/photos/abu-simbel.jpg",
        description:
          "Stand before the colossal seated statues that make Abu Simbel one of Egypt's most unforgettable facades.",
      },
      {
        title: "Temple of Nefertari",
        image: "/photos/abu-simbel.jpg",
        description:
          "Visit the elegant companion temple dedicated to Queen Nefertari and Hathor.",
      },
      {
        title: "Lake Nasser setting",
        image: "/photos/aswan.jpg",
        description:
          "Take in the southern desert light and wide lake views that make the site feel distinct from Luxor and Aswan.",
      },
      {
        title: "Aswan extension",
        image: "/photos/felucca.jpg",
        description:
          "Plan the route as a smooth private extension from Aswan with realistic timing and support.",
      },
    ],
    heroImage:
      "/photos/abu-simbel.jpg",
  },
  {
    slug: "red-sea",
    name: "Red Sea",
    overview:
      "Clear water, coral reefs, coastal resorts, and a calm finale after Egypt's temples, tombs, and Nile journeys.",
    description:
      "The Red Sea adds a lighter, restorative rhythm to an Egypt itinerary. After Cairo, Luxor, or a Nile cruise, the coast gives travelers time for swimming, snorkeling, diving, and resort comfort. It is especially useful for families, couples, and longer trips that need a graceful pause after intensive cultural touring.",
    bestTime: "March to June, September to November",
    duration: "2-5 days",
    region: "Red Sea Coast",
    type: "Coastal / Beach",
    coverImage: "/photos/red-sea.jpg",
    highlights: [
      {
        title: "Coral reefs",
        image: "/photos/red-sea.jpg",
        description:
          "Explore clear water and reef life through snorkeling or diving days arranged around your comfort level.",
      },
      {
        title: "Coastal resorts",
        image: "/photos/hurghada.jpg",
        description:
          "Choose a relaxed base for beach time, pools, dining, and slower mornings.",
      },
      {
        title: "Family-friendly pacing",
        image: "/photos/hurghada.jpg",
        description:
          "Balance temples and transfers with downtime that keeps the journey comfortable for every traveler.",
      },
      {
        title: "Luxor connection",
        image: "/photos/karnak.jpg",
        description:
          "Connect the coast to Luxor by private transfer for a simple temple-and-sea combination.",
      },
    ],
    heroImage:
      "/photos/red-sea.jpg",
  },
  {
    slug: "alexandria",
    name: "Alexandria",
    overview:
      "Mediterranean Egypt with coastal atmosphere, Greco-Roman history, and a distinct rhythm from Cairo and Upper Egypt.",
    description:
      "Alexandria offers a different face of Egypt, looking toward the Mediterranean rather than the desert or Nile. Its Greco-Roman layers, sea air, libraries, catacombs, and coastal dining make it a rewarding contrast to Cairo and Upper Egypt. The city works especially well as a private day or overnight extension when travelers want history with a breezier rhythm.",
    bestTime: "March to May, September to November",
    duration: "1-2 days",
    region: "Lower Egypt",
    type: "City",
    coverImage: "/photos/alexandria.jpg",
    highlights: [
      {
        title: "Mediterranean coast",
        image: "/photos/alexandria.jpg",
        description:
          "Take in sea views, corniche atmosphere, and a coastal mood unlike anywhere else in Egypt.",
      },
      {
        title: "Bibliotheca Alexandrina",
        image: "/photos/alexandria.jpg",
        description:
          "Visit the modern library and cultural complex inspired by Alexandria's ancient reputation for knowledge.",
      },
      {
        title: "Catacombs",
        image: "/photos/alexandria.jpg",
        description:
          "Descend into Greco-Roman burial chambers that blend Egyptian, Greek, and Roman imagery.",
      },
      {
        title: "Coastal dining",
        image: "/photos/red-sea.jpg",
        description:
          "Finish with seafood and Mediterranean views for a softer ending to a history-filled day.",
      },
    ],
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
      "Yes. Jack Luxor Tour can support selected B2B requests for local services, groups, and destination management basics without a full portal in this MVP.",
  },
];

export const galleryImages: GalleryImage[] = [
  {
    category: "Luxor",
    alt: "Aerial view of the Mortuary Temple of Hatshepsut at Deir el-Bahari, West Bank, Luxor",
    title: "Temple of Hatshepsut, Deir el-Bahari",
    description:
      "A terraced West Bank landmark framed by desert cliffs, one of Luxor's most recognizable ancient silhouettes.",
    url: "/photos/hatshepsut.jpg",
  },
  {
    category: "Luxor",
    alt: "Great Hypostyle Hall columns at Karnak Temple, Luxor",
    title: "Karnak Temple Hypostyle Hall",
    description:
      "Massive columns and temple scale inside Karnak, where Luxor's ceremonial architecture feels at its most powerful.",
    url: "/photos/karnak.jpg",
  },
  {
    category: "Nile Cruise",
    alt: "A traditional felucca sailing on the Nile in Upper Egypt",
    title: "Felucca on the Nile",
    description:
      "Traditional sailing on the Nile, a quieter way to feel the rhythm of Upper Egypt between temple days.",
    url: "/photos/felucca.jpg",
  },
  {
    category: "Nile Cruise",
    alt: "View across the Nile River in Egypt",
    title: "Nile River View",
    description:
      "A broad Nile view from Egypt. Exact location should be confirmed against the original source file.",
    url: "/photos/aswan.jpg",
  },
  {
    category: "Cairo",
    alt: "The Pyramids of Giza on the Giza Plateau near Cairo",
    title: "Giza Plateau",
    description:
      "The classic Cairo opening: the Pyramids of Giza rising from the desert plateau at the edge of the city.",
    url: "/photos/pyramids.jpg",
  },
  {
    category: "Cairo",
    alt: "The Great Pyramids of Giza in the desert near Cairo",
    title: "Pyramids of Giza",
    description:
      "A second Giza pyramid view. This duplicates the Cairo subject and should be replaced when a distinct Cairo image is available.",
    url: "/photos/pyramids.jpg",
  },
  {
    category: "Experiences",
    alt: "Aerial view of the Temple of Hatshepsut, West Bank, Luxor",
    title: "Deir el-Bahari from Above",
    description:
      "An elevated view over Deir el-Bahari and the West Bank cliffs. This is a temple image, not a hot-air balloon scene.",
    url: "/photos/hatshepsut.jpg",
  },
  {
    category: "Experiences",
    alt: "Temple of Hatshepsut at golden hour, West Bank, Luxor",
    title: "Golden Hour in Luxor",
    description:
      "Warm light across the Temple of Hatshepsut. This is another Deir el-Bahari view and should be replaced with a distinct experience image when available.",
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
        heading: "How Jack Luxor Tour plans timing",
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

export function formatPrice(tour: Tour, { includePrefix = true }: { includePrefix?: boolean } = {}) {
  if (!tour.priceFrom) {
    return "Custom quote";
  }

  const price = `${tour.priceCurrency} ${tour.priceFrom.toLocaleString("en-US")}`;
  return includePrefix ? `From ${price}` : price;
}
