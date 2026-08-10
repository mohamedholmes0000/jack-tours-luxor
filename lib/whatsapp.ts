const DEFAULT_MESSAGE =
  "Hello Jack Egypt Tour, I am interested in planning a trip to Egypt.";
const DEFAULT_WHATSAPP_NUMBER = "201096586292";

export type TripPlannerMessageInput = {
  arrivalDate: string;
  departureDate: string;
  travelers: number;
  nationality: string;
  destinations: string[];
  interests: string[];
  budgetRange: string;
  approximateBudget?: string;
  hotelCategory: string;
  name: string;
  email: string;
  whatsapp: string;
  specialRequests?: string;
};

export type TourInquiryMessageInput = {
  tourTitle: string;
  tourRoute: string;
  preferredDate: string;
  travelers: number;
  name: string;
  phone: string;
  notes?: string;
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
};

function resolveWhatsAppNumber(number?: string): string {
  const configuredNumber = number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? DEFAULT_WHATSAPP_NUMBER;
  const parsedPhone = configuredNumber.replace(/[^\d]/g, "");
  return parsedPhone.length >= 8 ? parsedPhone : DEFAULT_WHATSAPP_NUMBER;
}

export function buildWhatsAppUrlForNumber(message = DEFAULT_MESSAGE, number?: string): string {
  const phone = resolveWhatsAppNumber(number);
  const text = encodeURIComponent(message);

  return `https://wa.me/${phone}?text=${text}`;
}

export function buildWhatsAppAppUrl(message = DEFAULT_MESSAGE, number?: string): string {
  const phone = resolveWhatsAppNumber(number);
  const fallbackUrl = buildWhatsAppUrlForNumber(message, number);

  return `intent://send?phone=${phone}&text=${encodeURIComponent(message)}#Intent;scheme=whatsapp;package=com.whatsapp;S.browser_fallback_url=${encodeURIComponent(fallbackUrl)};end`;
}

export function buildWhatsAppUrl(message = DEFAULT_MESSAGE): string {
  return buildWhatsAppUrlForNumber(message);
}

function line(label: string, value?: string | number | string[]) {
  if (Array.isArray(value)) {
    return value.length ? `${label}: ${value.join(", ")}` : "";
  }

  return value ? `${label}: ${value}` : "";
}

function tripPlannerLine(label: string, value?: string | number | string[]) {
  let displayValue = "—";

  if (Array.isArray(value)) {
    displayValue = value.length ? value.join(", ") : "—";
  } else if (value !== undefined && value !== null && String(value).trim()) {
    displayValue = String(value);
  }

  return `- ${label}: ${displayValue}`;
}

function formatTripPlannerDate(value: string) {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})$/);

  if (!match) {
    return value;
  }

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

export function buildTripPlannerMessage(input: TripPlannerMessageInput): string {
  return [
    "Hello Jack Egypt Tour,",
    "I'd like to plan a trip. Here are my details:",
    "",
    tripPlannerLine("Arrival date", formatTripPlannerDate(input.arrivalDate)),
    tripPlannerLine("Departure date", formatTripPlannerDate(input.departureDate)),
    tripPlannerLine("Travelers", input.travelers),
    tripPlannerLine("Nationality", input.nationality),
    tripPlannerLine("Destinations", input.destinations),
    tripPlannerLine("Interests", input.interests),
    tripPlannerLine("Budget range", input.budgetRange),
    tripPlannerLine("Approximate budget", input.approximateBudget),
    tripPlannerLine("Hotel preference", input.hotelCategory),
    tripPlannerLine("Special requests", input.specialRequests),
    tripPlannerLine("Name", input.name),
    tripPlannerLine("Email", input.email),
    tripPlannerLine("WhatsApp", input.whatsapp),
    "",
    "Looking forward to your reply.",
  ].join("\n");
}

export function buildTourInquiryMessage(input: TourInquiryMessageInput): string {
  return [
    "Hello Jack Egypt Tour, I would like to inquire about a private tour.",
    "",
    line("Tour", input.tourTitle),
    line("Tour route", input.tourRoute),
    line("Preferred date", input.preferredDate),
    line("Travelers", input.travelers),
    line("Name", input.name),
    line("WhatsApp/phone", input.phone),
    line("Notes", input.notes),
    "",
    "Please send details, availability, and pricing.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function buildContactMessage(input: ContactMessageInput): string {
  return [
    "Hello Jack Egypt Tour, I am contacting you from the website.",
    "",
    line("Name", input.name),
    line("Email", input.email),
    line("WhatsApp/phone", input.phone),
    line("Subject", input.subject),
    line("Message", input.message),
    "",
    "Please reply when convenient.",
  ]
    .filter(Boolean)
    .join("\n");
}
