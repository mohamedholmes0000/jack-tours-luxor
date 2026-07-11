import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma, tryDatabase } from "@/lib/data/safe-db";

const inquiryApiSchema = z.object({
  type: z.string().default("GENERAL"),
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: z.string().optional(),
  whatsapp: z.string().optional(),
  arrivalDate: z.string().optional(),
  departureDate: z.string().optional(),
  travelers: z.number().int().min(1).optional(),
  nationality: z.string().optional(),
  budgetRange: z.string().optional(),
  approximateBudget: z.string().optional(),
  hotelCategory: z.string().optional(),
  destinations: z.array(z.string()).optional(),
  interests: z.array(z.string()).optional(),
  tourSlug: z.string().optional(),
  message: z.string().optional(),
});

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

function parseDate(value?: string) {
  if (!value) {
    return undefined;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export async function POST(request: Request) {
  const payload = await request.json().catch(() => null);
  const parsed = inquiryApiSchema.safeParse(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, message: "Invalid inquiry payload.", errors: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const data = parsed.data;
  const message = [
    data.message?.trim(),
    data.interests?.length ? `Interests: ${data.interests.join(", ")}` : "",
    data.approximateBudget?.trim() ? `Approximate budget: ${data.approximateBudget.trim()}` : "",
  ]
    .filter(Boolean)
    .join("\n\n");

  if (data.arrivalDate || data.departureDate) {
    const today = localDateInputValue();

    if (data.arrivalDate && data.arrivalDate < today) {
      return NextResponse.json(
        { ok: false, message: "Arrival date cannot be in the past." },
        { status: 400 },
      );
    }

    if (
      data.arrivalDate &&
      data.departureDate &&
      data.departureDate < addDaysToDateInput(data.arrivalDate, 1)
    ) {
      return NextResponse.json(
        { ok: false, message: "Departure date must be after arrival date." },
        { status: 400 },
      );
    }
  }
  const saved = await tryDatabase(
    async () => {
      await prisma.inquiry.create({
        data: {
          type: data.type,
          name: data.name,
          email: data.email || undefined,
          phone: data.phone,
          whatsapp: data.whatsapp,
          arrivalDate: parseDate(data.arrivalDate),
          departureDate: parseDate(data.departureDate),
          travelers: data.travelers,
          nationality: data.nationality,
          budgetRange: data.budgetRange,
          hotelCategory: data.hotelCategory,
          destinations: data.destinations ?? [],
          tourSlug: data.tourSlug,
          message: message || undefined,
        },
      });
      return true;
    },
    false,
  );

  if (!saved) {
    console.error("Inquiry persistence failed. No success response returned.", data);
    return NextResponse.json(
      { ok: false, persisted: false, message: "Inquiry could not be saved. Please try again." },
      { status: 503 },
    );
  }

  return NextResponse.json({ ok: true, persisted: saved });
}
