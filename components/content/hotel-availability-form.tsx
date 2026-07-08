"use client";

import { useState } from "react";
import type { FormEvent } from "react";
import type { ReactNode } from "react";
import { BedDouble, CalendarDays, Users } from "lucide-react";
import { FormField, textareaClassName } from "@/components/forms/form-field";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

const HOTEL_WHATSAPP_NUMBER = "201096586292";

type HotelAvailabilityFormProps = {
  hotelTitle: string;
  location: string;
  price: string;
};

type AvailabilityValues = {
  checkIn: string;
  checkOut: string;
  guests: string;
  rooms: string;
  notes: string;
};

type AvailabilityErrors = Partial<Record<keyof AvailabilityValues, string>>;

function toDateValue(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getLocalDateValue(offsetDays = 0) {
  const date = new Date();
  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + offsetDays);

  return toDateValue(date);
}

function addDays(value: string, days: number) {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day || 1);

  if (Number.isNaN(date.getTime())) {
    return getLocalDateValue(days);
  }

  date.setHours(12, 0, 0, 0);
  date.setDate(date.getDate() + days);

  return toDateValue(date);
}

function validate(values: AvailabilityValues, today: string) {
  const errors: AvailabilityErrors = {};
  const guests = Number(values.guests);
  const rooms = Number(values.rooms);

  if (!values.checkIn) {
    errors.checkIn = "Check-in date is required.";
  } else if (today && values.checkIn < today) {
    errors.checkIn = "Check-in cannot be before today.";
  }

  if (!values.checkOut) {
    errors.checkOut = "Check-out date is required.";
  }

  if (values.checkIn && values.checkOut && values.checkOut <= values.checkIn) {
    errors.checkOut = "Check-out must be after check-in.";
  }

  if (!Number.isFinite(guests) || guests < 1) {
    errors.guests = "Guests must be at least 1.";
  }

  if (!Number.isFinite(rooms) || rooms < 1) {
    errors.rooms = "Rooms must be at least 1.";
  }

  return errors;
}

function AvailabilityBox({
  children,
  error,
  icon,
  label,
}: {
  children: ReactNode;
  error?: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <label className="block rounded-2xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)]/80 p-3 shadow-inner transition focus-within:border-[var(--color-gold)] focus-within:bg-white">
      <span className="flex items-center gap-2 text-[0.68rem] font-bold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
        <span className="text-[var(--color-navy)]/38">{icon}</span>
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-xs leading-5 text-red-700">{error}</span> : null}
    </label>
  );
}

function buildHotelAvailabilityMessage({
  hotelTitle,
  location,
  price,
  values,
}: {
  hotelTitle: string;
  location: string;
  price: string;
  values: AvailabilityValues;
}) {
  const pageUrl = typeof window !== "undefined" ? window.location.href : "";

  return [
    "Hello Jack Egypt Tour, I want to check availability for:",
    `Hotel: ${hotelTitle}`,
    `Location: ${location}`,
    `Price: ${price}`,
    `Check-in: ${values.checkIn}`,
    `Check-out: ${values.checkOut}`,
    `Guests: ${values.guests}`,
    `Rooms: ${values.rooms}`,
    values.notes.trim() ? `Notes: ${values.notes.trim()}` : "",
    pageUrl ? `Page: ${pageUrl}` : "",
    "",
    "Please confirm availability and price.",
  ]
    .filter(Boolean)
    .join("\n");
}

export function HotelAvailabilityForm({ hotelTitle, location, price }: HotelAvailabilityFormProps) {
  const [defaultDates] = useState(() => {
    const today = getLocalDateValue();

    return {
      today,
      tomorrow: addDays(today, 1),
    };
  });
  const todayValue = defaultDates.today;
  const [values, setValues] = useState<AvailabilityValues>(() => ({
    checkIn: defaultDates.today,
    checkOut: defaultDates.tomorrow,
    guests: "2",
    rooms: "1",
    notes: "",
  }));
  const [errors, setErrors] = useState<AvailabilityErrors>({});
  const [successUrl, setSuccessUrl] = useState<string | null>(null);

  function updateCheckIn(value: string) {
    setValues((current) => {
      const nextCheckOut = value && current.checkOut > value ? current.checkOut : addDays(value || todayValue || getLocalDateValue(), 1);

      return {
        ...current,
        checkIn: value,
        checkOut: nextCheckOut,
      };
    });
    setErrors((current) => ({ ...current, checkIn: undefined, checkOut: undefined }));
  }

  function update(field: keyof AvailabilityValues, value: string) {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors = validate(values, todayValue || getLocalDateValue());

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      setSuccessUrl(null);
      return;
    }

    const message = buildHotelAvailabilityMessage({ hotelTitle, location, price, values });
    const url = buildWhatsAppUrlForNumber(message, HOTEL_WHATSAPP_NUMBER);
    setSuccessUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
  }

  return (
    <form id="hotel-availability" className="mt-6 space-y-4" noValidate onSubmit={submit}>
      <div className="grid gap-4 sm:grid-cols-2">
        <AvailabilityBox icon={<CalendarDays className="size-4" />} label="Check-in" error={errors.checkIn}>
          <input
            className="h-9 w-full bg-transparent text-sm font-semibold text-[var(--color-navy)] outline-none"
            min={todayValue}
            suppressHydrationWarning
            type="date"
            value={values.checkIn}
            onChange={(event) => updateCheckIn(event.target.value)}
          />
        </AvailabilityBox>
        <AvailabilityBox icon={<CalendarDays className="size-4" />} label="Check-out" error={errors.checkOut}>
          <input
            className="h-9 w-full bg-transparent text-sm font-semibold text-[var(--color-navy)] outline-none"
            min={values.checkIn ? addDays(values.checkIn, 1) : todayValue}
            suppressHydrationWarning
            type="date"
            value={values.checkOut}
            onChange={(event) => update("checkOut", event.target.value)}
          />
        </AvailabilityBox>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <AvailabilityBox icon={<Users className="size-4" />} label="Guests" error={errors.guests}>
          <input
            className="h-9 w-full bg-transparent text-sm font-semibold text-[var(--color-navy)] outline-none"
            min="1"
            type="number"
            value={values.guests}
            onChange={(event) => update("guests", event.target.value)}
          />
        </AvailabilityBox>
        <AvailabilityBox icon={<BedDouble className="size-4" />} label="Rooms" error={errors.rooms}>
          <input
            className="h-9 w-full bg-transparent text-sm font-semibold text-[var(--color-navy)] outline-none"
            min="1"
            type="number"
            value={values.rooms}
            onChange={(event) => update("rooms", event.target.value)}
          />
        </AvailabilityBox>
      </div>
      <FormField label="Notes / special request">
        <textarea
          className={`${textareaClassName} min-h-28`}
          placeholder="Preferred room view, arrival time, family needs..."
          value={values.notes}
          onChange={(event) => update("notes", event.target.value)}
        />
      </FormField>
      <button className="btn-primary w-full justify-center" type="submit">
        Check Availability on WhatsApp
      </button>
      <p className="text-xs leading-5 text-[var(--color-navy)]/48">
        No online payment. We confirm availability and details on WhatsApp.
      </p>
      {successUrl ? (
        <p className="rounded-2xl bg-[var(--color-sand)] px-4 py-3 text-xs leading-5 text-[var(--color-navy)]/62">
          Opening WhatsApp... If it did not open,{" "}
          <a className="font-semibold text-[var(--color-gold-dark)] underline" href={successUrl} target="_blank" rel="noreferrer">
            tap here
          </a>
          .
        </p>
      ) : null}
    </form>
  );
}
