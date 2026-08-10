"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { TourInquiryValues, tourInquirySchema } from "@/lib/validations";
import {
  buildTourInquiryMessage,
  buildWhatsAppAppUrl,
  buildWhatsAppUrlForNumber,
} from "@/lib/whatsapp";

type TourInquiryFormProps = {
  tourTitle: string;
  tourSlug: string;
  tourRoute: string;
  whatsappNumber?: string;
};

export function TourInquiryForm({
  tourTitle,
  tourSlug,
  tourRoute,
  whatsappNumber,
}: TourInquiryFormProps) {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TourInquiryValues>({
    resolver: zodResolver(tourInquirySchema),
    defaultValues: {
      travelers: 2,
    },
  });

  async function onSubmit(values: TourInquiryValues) {
    setIsSending(true);
    setErrorMessage(null);
    const tourMessage = buildTourInquiryMessage({ ...values, tourTitle, tourRoute });
    const whatsappUrl = /Android/i.test(navigator.userAgent)
      ? buildWhatsAppAppUrl(tourMessage, whatsappNumber)
      : buildWhatsAppUrlForNumber(tourMessage, whatsappNumber);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TOUR",
          name: values.name,
          phone: values.phone,
          whatsapp: values.phone,
          arrivalDate: values.preferredDate,
          travelers: values.travelers,
          tourSlug,
          message: [
            `Tour: ${tourTitle}`,
            `Tour route: ${tourRoute}`,
            `Travel date: ${values.preferredDate}`,
            `Travelers: ${values.travelers}`,
            `Notes: ${values.notes ?? ""}`,
          ].join("\n"),
        }),
      });

      if (!response.ok) {
        const responseBody = await response.json().catch(() => null);
        setErrorMessage(
          responseBody?.message ?? "We couldn't send your inquiry. Please try again.",
        );
        setIsSending(false);
        return;
      }
    } catch (error) {
      console.warn("Inquiry API unavailable.", error);
      setErrorMessage("We couldn't send your inquiry. Please try again or contact us on WhatsApp.");
      setIsSending(false);
      return;
    }

    window.location.assign(whatsappUrl);
  }

  return (
    <div className="border border-[rgb(214_173_84_/_28%)] bg-white/90 p-5 shadow-[0_24px_70px_rgb(87_59_22_/_14%)] backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="eyebrow">Tour inquiry</p>
          <h2 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">
            Ask for dates and availability.
          </h2>
        </div>
      </div>
      {errorMessage ? (
        <p className="mt-5 border border-red-200 bg-red-50 p-4 text-sm text-red-700" role="alert">
          {errorMessage}
        </p>
      ) : null}
      <form className="mt-8 grid gap-5 md:grid-cols-2" onSubmit={handleSubmit(onSubmit)}>
          <FormField label="Preferred date" error={errors.preferredDate?.message}>
            <input className={inputClassName} type="date" {...register("preferredDate")} />
          </FormField>
          <FormField label="Travelers" error={errors.travelers?.message}>
            <input
              className={inputClassName}
              type="number"
              min="1"
              {...register("travelers", { valueAsNumber: true })}
            />
          </FormField>
          <FormField label="Name" error={errors.name?.message}>
            <input className={inputClassName} {...register("name")} />
          </FormField>
          <FormField label="WhatsApp / phone" error={errors.phone?.message}>
            <input className={inputClassName} {...register("phone")} />
          </FormField>
          <div className="md:col-span-2">
            <FormField label="Notes" error={errors.notes?.message}>
              <textarea
                className={textareaClassName}
                placeholder="Tell us about pickup location, children, preferred start time, or anything we should know."
                {...register("notes")}
              />
            </FormField>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row md:col-span-2">
            <button className="btn-primary w-full sm:w-auto" type="submit" disabled={isSending}>
              {isSending ? "Saving your inquiry..." : "Continue on WhatsApp"}
            </button>
          </div>
        </form>
    </div>
  );
}
