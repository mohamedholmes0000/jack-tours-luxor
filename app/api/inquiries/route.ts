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
  hotelCategory: z.string().optional(),
  destinations: z.array(z.string()).optional(),
  tourSlug: z.string().optional(),
  message: z.string().optional(),
});

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
          message: data.message,
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
