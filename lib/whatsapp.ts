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

export function buildWhatsAppUrl(message = DEFAULT_MESSAGE): string {
  const configuredNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "";
  const phone = configuredNumber.replace(/[^\d]/g, "");
  const text = encodeURIComponent(message);

  return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
}

function line(label: string, value?: string | number | string[]) {
  if (Array.isArray(value)) {
    return value.length ? `${label}: ${value.join(", ")}` : "";
  }

  return value ? `${label}: ${value}` : "";
}

export function buildTripPlannerMessage(input: TripPlannerMessageInput): string {
  return [
    "Hello Jack Egypt Tour, I would like help planning a private Egypt trip.",
    "",
    line("Name", input.name),
    line("Email", input.email),
    line("WhatsApp", input.whatsapp),
    line("Nationality", input.nationality),
    line("Arrival", input.arrivalDate),
    line("Departure", input.departureDate),
    line("Travelers", input.travelers),
    line("Destinations", input.destinations),
    line("Interests", input.interests),
    line("Budget range", input.budgetRange),
    line("Hotel preference", input.hotelCategory),
    line("Special requests", input.specialRequests),
    "",
    "Please send availability and a suggested itinerary.",
  ]
    .filter(Boolean)
    .join("\n");
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
