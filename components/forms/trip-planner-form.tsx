"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { destinations } from "@/lib/content";
import { TripPlannerValues, tripPlannerSchema } from "@/lib/validations";
import { buildTripPlannerMessage, buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

const steps = ["Dates & travelers", "Destinations & interests", "Budget & hotel", "Contact"];
const interestOptions = ["Ancient sites", "Nile cruise", "Luxury", "Family trip", "Adventure", "Cultural experience"];
const budgetOptions = [
  "Flexible / Not sure yet",
  "Under USD 500",
  "USD 500–1,000",
  "USD 1,000–2,500",
  "USD 2,500–5,000",
  "USD 5,000+",
  "Custom budget",
];
const hotelOptions = ["Comfort 3-4 star", "Premium 4-5 star", "Luxury 5 star", "Not sure yet"];
const countryCodeOptions = [
  { label: "Egypt +20", value: "+20" },
  { label: "United States +1", value: "+1" },
  { label: "United Kingdom +44", value: "+44" },
  { label: "Germany +49", value: "+49" },
  { label: "France +33", value: "+33" },
  { label: "Italy +39", value: "+39" },
  { label: "Spain +34", value: "+34" },
  { label: "Saudi Arabia +966", value: "+966" },
  { label: "UAE +971", value: "+971" },
  { label: "Qatar +974", value: "+974" },
  { label: "Kuwait +965", value: "+965" },
  { label: "Australia +61", value: "+61" },
  { label: "Canada +1", value: "+1" },
  { label: "Other", value: "OTHER" },
];

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

function formatFullWhatsAppNumber(countryCode: string, value: string) {
  const trimmedValue = value.trim();

  if (countryCode === "OTHER" || trimmedValue.startsWith("+")) {
    return trimmedValue;
  }

  const localNumber = trimmedValue.replace(/^0+/, "");
  return `${countryCode} ${localNumber}`.trim();
}

export function TripPlannerForm({ whatsappNumber }: { whatsappNumber?: string }) {
  const [step, setStep] = useState(0);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [todayInput] = useState(() => localDateInputValue());
  const [phoneCountryCode, setPhoneCountryCode] = useState("+20");

  const {
    register,
    handleSubmit,
    trigger,
    control,
    getValues,
    setValue,
    formState: { errors },
  } = useForm<TripPlannerValues>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      travelers: 2,
      destinations: ["Luxor"],
      interests: ["Ancient sites"],
      budgetRange: "",
      approximateBudget: "",
      hotelCategory: "",
    },
  });
  const selectedBudgetRange = useWatch({ control, name: "budgetRange" });
  const arrivalDate = useWatch({ control, name: "arrivalDate" });
  const departureDate = useWatch({ control, name: "departureDate" });
  const isCustomBudget = selectedBudgetRange === "Custom budget";
  const minDepartureDate = arrivalDate ? addDaysToDateInput(arrivalDate, 1) : "";

  useEffect(() => {
    const tomorrow = addDaysToDateInput(todayInput, 1);

    if (!getValues("arrivalDate")) {
      setValue("arrivalDate", todayInput, { shouldValidate: false });
    }

    if (!getValues("departureDate")) {
      setValue("departureDate", tomorrow, { shouldValidate: false });
    }
  }, [getValues, setValue, todayInput]);

  useEffect(() => {
    if (!arrivalDate) {
      return;
    }

    const nextValidDeparture = addDaysToDateInput(arrivalDate, 1);

    if (!departureDate || departureDate < nextValidDeparture) {
      setValue("departureDate", nextValidDeparture, { shouldDirty: true, shouldValidate: true });
    }
  }, [arrivalDate, departureDate, setValue]);

  async function goNext() {
    const fieldsByStep: Array<Array<keyof TripPlannerValues>> = [
      ["arrivalDate", "departureDate", "travelers", "nationality"],
      ["destinations", "interests"],
      ["budgetRange", "hotelCategory"],
      ["name", "email", "whatsapp"],
    ];

    const isValid = await trigger(fieldsByStep[step]);
    if (isValid) {
      setStep((current) => Math.min(current + 1, steps.length - 1));
    }
  }

  async function onSubmit(values: TripPlannerValues) {
    setIsSending(true);
    setErrorMessage(null);
    const fullWhatsapp = formatFullWhatsAppNumber(phoneCountryCode, values.whatsapp);
    const submitValues = { ...values, whatsapp: fullWhatsapp };
    const message = buildTripPlannerMessage(submitValues);
    const url = buildWhatsAppUrlForNumber(message, whatsappNumber);
    const inquiryPayload = {
      type: "TRIP_PLANNER",
      status: "NEW",
      arrivalDate: values.arrivalDate,
      departureDate: values.departureDate,
      travelers: values.travelers,
      nationality: values.nationality,
      destinations: values.destinations,
      interests: values.interests,
      budgetRange: values.budgetRange,
      approximateBudget: values.approximateBudget,
      hotelCategory: values.hotelCategory,
      name: values.name,
      email: values.email,
      whatsapp: fullWhatsapp,
      message: values.specialRequests,
    };

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryPayload),
      });

      if (!response.ok) {
        setErrorMessage("We couldn't send your inquiry. Please try again.");
        setIsSending(false);
        return;
      }
    } catch (error) {
      console.warn("Inquiry API unavailable.", error);
      setErrorMessage("We couldn't send your inquiry. Please try again.");
      setIsSending(false);
      return;
    }

    setSuccessUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    window.localStorage.setItem("jackToursLastTripInquiry", JSON.stringify(inquiryPayload));
    setIsSending(false);
  }

  return (
    <div className="border border-[rgb(214_173_84_/_28%)] bg-white/90 p-5 shadow-[0_24px_70px_rgb(87_59_22_/_14%)] backdrop-blur md:p-8">
      <div className="grid gap-3 sm:grid-cols-4">
        {steps.map((label, index) => (
          <div key={label} className="min-w-0">
            <div
              className={`h-1.5 ${index <= step ? "bg-[var(--color-gold)]" : "bg-[rgb(214_173_84_/_18%)]"}`}
            />
            <p className="mt-3 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-navy)]">
              {index + 1}. {label}
            </p>
          </div>
        ))}
      </div>

      {successUrl ? (
        <div className="mt-10 border border-[rgb(214_173_84_/_26%)] bg-[var(--color-sand)] p-6">
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
            Opening WhatsApp...
          </h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
            Opening WhatsApp... If it didn&apos;t open,{" "}
            <a className="font-bold text-[var(--color-gold-dark)] underline" href={successUrl} target="_blank" rel="noreferrer">
              click here
            </a>{" "}
            to retry.
          </p>
          <a className="btn-primary mt-6" href={successUrl} target="_blank" rel="noreferrer">
            Open WhatsApp
          </a>
        </div>
      ) : (
        <form className="mt-10" onSubmit={handleSubmit(onSubmit)}>
          {step === 0 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Arrival date" error={errors.arrivalDate?.message}>
                <input className={inputClassName} type="date" min={todayInput || undefined} {...register("arrivalDate")} />
              </FormField>
              <FormField label="Departure date" error={errors.departureDate?.message}>
                <input
                  className={inputClassName}
                  type="date"
                  min={minDepartureDate || undefined}
                  {...register("departureDate")}
                />
              </FormField>
              <FormField label="Travelers" error={errors.travelers?.message}>
                <input
                  className={inputClassName}
                  type="number"
                  min="1"
                  {...register("travelers", { valueAsNumber: true })}
                />
              </FormField>
              <FormField label="Nationality" error={errors.nationality?.message}>
                <input className={inputClassName} placeholder="United States" {...register("nationality")} />
              </FormField>
            </div>
          ) : null}

          {step === 1 ? (
            <div className="grid gap-8 md:grid-cols-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                  Destinations
                </p>
                <div className="mt-4 grid gap-3">
                  {destinations.slice(0, 5).map((destination) => (
                    <label key={destination.name} className="flex min-h-12 items-center gap-3 border border-[rgb(214_173_84_/_24%)] bg-[rgba(255,250,240,0.68)] px-4">
                      <input type="checkbox" value={destination.name} {...register("destinations")} />
                      <span className="text-sm font-semibold text-[var(--color-gray-900)]">{destination.name}</span>
                    </label>
                  ))}
                </div>
                {errors.destinations ? <p className="mt-2 text-sm text-red-700">{errors.destinations.message}</p> : null}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">
                  Interests
                </p>
                <div className="mt-4 grid gap-3">
                  {interestOptions.map((interest) => (
                    <label key={interest} className="flex min-h-12 items-center gap-3 border border-[rgb(214_173_84_/_24%)] bg-[rgba(255,250,240,0.68)] px-4">
                      <input type="checkbox" value={interest} {...register("interests")} />
                      <span className="text-sm font-semibold text-[var(--color-gray-900)]">{interest}</span>
                    </label>
                  ))}
                </div>
                {errors.interests ? <p className="mt-2 text-sm text-red-700">{errors.interests.message}</p> : null}
              </div>
            </div>
          ) : null}

          {step === 2 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Budget range" error={errors.budgetRange?.message}>
                <select className={inputClassName} {...register("budgetRange")}>
                  <option value="">Select a range</option>
                  {budgetOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormField>
              <FormField label="Approximate budget amount" error={errors.approximateBudget?.message}>
                <input
                  className={`${inputClassName} ${
                    isCustomBudget
                      ? "border-[var(--color-gold)] bg-[rgb(214_173_84_/_10%)] shadow-[0_0_0_3px_rgb(214_173_84_/_14%)]"
                      : ""
                  }`}
                  placeholder="Example: USD 1,200 total, USD 150/day, or flexible"
                  {...register("approximateBudget")}
                />
                {isCustomBudget ? (
                  <p className="mt-2 text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-dark)]">
                    Recommended for custom budgets.
                  </p>
                ) : null}
              </FormField>
              <FormField label="Hotel preference" error={errors.hotelCategory?.message}>
                <select className={inputClassName} {...register("hotelCategory")}>
                  <option value="">Select hotel style</option>
                  {hotelOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Special requests" error={errors.specialRequests?.message}>
                  <textarea
                    className={textareaClassName}
                    placeholder="Tell us about pace, must-see sites, cruise ideas, children, accessibility, or special occasions."
                    {...register("specialRequests")}
                  />
                </FormField>
              </div>
            </div>
          ) : null}

          {step === 3 ? (
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Name" error={errors.name?.message}>
                <input className={inputClassName} {...register("name")} />
              </FormField>
              <FormField label="Email" error={errors.email?.message}>
                <input className={inputClassName} type="email" {...register("email")} />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="WhatsApp" error={errors.whatsapp?.message}>
                  <div className="grid gap-3 sm:grid-cols-[minmax(0,220px)_1fr]">
                    <select
                      className={inputClassName}
                      value={phoneCountryCode}
                      onChange={(event) => setPhoneCountryCode(event.target.value)}
                    >
                      {countryCodeOptions.map((option) => (
                        <option key={`${option.label}-${option.value}`} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    <input
                      className={inputClassName}
                      placeholder={phoneCountryCode === "OTHER" ? "+44 7700 900123" : "1065299917"}
                      {...register("whatsapp")}
                    />
                  </div>
                  <p className="mt-2 text-xs leading-5 text-[var(--color-gray-600)]">
                    Choose a country code, or select Other and type the full international number.
                  </p>
                </FormField>
              </div>
            </div>
          ) : null}

          <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
            <button
              className="btn-secondary"
              type="button"
              disabled={step === 0}
              onClick={() => setStep((current) => Math.max(current - 1, 0))}
            >
              Back
            </button>
            {step < steps.length - 1 ? (
              <button className="btn-primary" type="button" onClick={goNext}>
                Continue
              </button>
            ) : (
              <button className="btn-primary" type="submit" disabled={isSending}>
                {isSending ? "Sending..." : "Send to WhatsApp"}
              </button>
            )}
          </div>
          {errorMessage ? (
            <p className="mt-4 border border-red-200 bg-red-50 p-4 text-sm text-red-700">
              {errorMessage}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
