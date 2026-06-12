"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { destinations } from "@/lib/content";
import { TripPlannerValues, tripPlannerSchema } from "@/lib/validations";
import { buildTripPlannerMessage, buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

const steps = ["Dates & travelers", "Destinations & interests", "Budget & hotel", "Contact"];
const interestOptions = ["Ancient sites", "Nile cruise", "Luxury", "Family trip", "Adventure", "Cultural experience"];
const budgetOptions = ["Under USD 1,000", "USD 1,000-2,500", "USD 2,500-5,000", "USD 5,000+"];
const hotelOptions = ["Comfort 3-4 star", "Premium 4-5 star", "Luxury 5 star", "Not sure yet"];

export function TripPlannerForm({ whatsappNumber }: { whatsappNumber?: string }) {
  const [step, setStep] = useState(0);
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<TripPlannerValues>({
    resolver: zodResolver(tripPlannerSchema),
    defaultValues: {
      travelers: 2,
      destinations: ["Luxor"],
      interests: ["Ancient sites"],
      budgetRange: "",
      hotelCategory: "",
    },
  });

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
    const message = buildTripPlannerMessage(values);
    const url = buildWhatsAppUrlForNumber(message, whatsappNumber);
    const inquiryPayload = {
      type: "TRIP_PLANNER",
      status: "NEW",
      arrivalDate: values.arrivalDate,
      departureDate: values.departureDate,
      travelers: values.travelers,
      nationality: values.nationality,
      destinations: values.destinations,
      budgetRange: values.budgetRange,
      hotelCategory: values.hotelCategory,
      name: values.name,
      email: values.email,
      whatsapp: values.whatsapp,
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
                <input className={inputClassName} type="date" {...register("arrivalDate")} />
              </FormField>
              <FormField label="Departure date" error={errors.departureDate?.message}>
                <input className={inputClassName} type="date" {...register("departureDate")} />
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
                  <input className={inputClassName} placeholder="+1 555 000 0000" {...register("whatsapp")} />
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
