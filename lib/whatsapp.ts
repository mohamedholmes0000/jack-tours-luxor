const DEFAULT_MESSAGE =
  "Hello Jack Egypt Tour, I am interested in planning a trip to Egypt.";

export type TripPlannerMessageInput = {
  arrivalDate: string;
  departureDate: string;
  travelers: number;
  nationality: string;
  destinations: string[];
  interests: string[];
  budgetRange: string;
  hotelCategory: string;
  name: string;
  email: string;
  whatsapp: string;
  specialRequests?: string;
};

export type TourInquiryMessageInput = {
  tourTitle: string;
  preferredDate: string;
  travelers: number;
  name: string;
  phone: string;
  notes?: string;
};

export type ContactMessageInput = {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
};

export function buildWhatsAppUrlForNumber(message = DEFAULT_MESSAGE, number?: string): string {
  const configuredNumber = number ?? process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const phone = configuredNumber.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);

  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
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

export function buildTripPlannerMessage(input: TripPlannerMessageInput): string {
  return [
    "Hello Jack Egypt Tour,",
    "I'd like to plan a trip. Here are my details:",
    "",
    tripPlannerLine("Arrival date", input.arrivalDate),
    tripPlannerLine("Departure date", input.departureDate),
    tripPlannerLine("Travelers", input.travelers),
    tripPlannerLine("Nationality", input.nationality),
    tripPlannerLine("Destinations", input.destinations),
    tripPlannerLine("Interests", input.interests),
    tripPlannerLine("Budget range", input.budgetRange),
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
