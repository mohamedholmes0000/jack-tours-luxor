import type { Tour } from "@/lib/content";

export type TourJourneyType = "one-day" | "multi-day";

type JourneyTypeSource = Pick<
  Tour,
  "category" | "duration" | "overview" | "shortDescription" | "title"
>;

function dayCountFromText(value: string) {
  const match = value.match(/(\d+)\s*[- ]?days?/);
  return match ? Number(match[1]) : null;
}

export function getTourJourneyType(tour: JourneyTypeSource): TourJourneyType | null {
  const duration = tour.duration.trim().toLowerCase();
  const categoryAndTitle = `${tour.category} ${tour.title}`.toLowerCase();
  const content = [
    tour.category,
    tour.title,
    tour.shortDescription,
    tour.overview,
  ]
    .join(" ")
    .toLowerCase();

  if (/\b(?:custom|tailor-made)\b/.test(categoryAndTitle)) {
    return null;
  }

  const dayRange = duration.match(/(\d+)\s*(?:-|to)\s*(\d+)\s*days?/);
  if (dayRange) {
    return Number(dayRange[2]) > 1 ? "multi-day" : "one-day";
  }

  const durationDayCount = dayCountFromText(duration);
  if (durationDayCount !== null) {
    return durationDayCount > 1 ? "multi-day" : "one-day";
  }

  if (/(\d+)\s*(?:hours?|hrs?)/.test(duration)) {
    return "one-day";
  }

  const contentDayCount = dayCountFromText(content);
  if (contentDayCount !== null) {
    return contentDayCount > 1 ? "multi-day" : "one-day";
  }

  if (/\b(?:multi[\s-]?day|nile cruise|tour package|longer journey)\b/.test(content)) {
    return "multi-day";
  }

  if (/\b(?:one[\s-]?day|day tour|day trip|full day|half day|private day)\b/.test(content)) {
    return "one-day";
  }

  return null;
}