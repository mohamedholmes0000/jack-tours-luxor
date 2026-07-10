"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { TourInquiryValues, tourInquirySchema } from "@/lib/validations";
import { buildTourInquiryMessage, buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

type TourInquiryFormProps = {
  tourTitle: string;
  tourSlug: string;
  whatsappNumber?: string;
};

export function TourInquiryForm({ tourTitle, tourSlug, whatsappNumber }: TourInquiryFormProps) {
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
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
    const url = buildWhatsAppUrlForNumber(buildTourInquiryMessage({ ...values, tourTitle }), whatsappNumber);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "TOUR",
          name: values.name,
          phone: values.phone,
          whatsapp: values.phone,
          travelers: values.travelers,
          tourSlug,
          message: `Tour: ${tourTitle}\nPreferred date: ${values.preferredDate}\nNotes: ${values.notes ?? ""}`,
        }),
      });

      if (!response.ok) {
        setErrorMessage("We couldn't send your inquiry. Please try again or contact us on WhatsApp.");
        setIsSending(false);
        return;
      }
    } catch (error) {
      console.warn("Inquiry API unavailable.", error);
      setErrorMessage("We couldn't send your inquiry. Please try again or contact us on WhatsApp.");
      setIsSending(false);
      return;
    }

    setSuccessUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsSending(false);
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
        {successUrl ? (
          <a className="btn-primary" href={successUrl} target="_blank" rel="noreferrer">
            Open WhatsApp
          </a>
        ) : null}
      </div>
      {successUrl ? (
        <p className="mt-5 border border-[rgb(214_173_84_/_22%)] bg-[var(--color-sand)] p-4 text-sm leading-7 text-[var(--color-gray-600)]">
          Your inquiry message is ready. WhatsApp should have opened in a new tab.
        </p>
      ) : (
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
          <div className="md:col-span-2">
            <button className="btn-primary w-full sm:w-auto" type="submit" disabled={isSending}>
              {isSending ? "Preparing..." : "Send Inquiry on WhatsApp"}
            </button>
          </div>
          {errorMessage ? (
            <p className="border border-red-200 bg-red-50 p-4 text-sm text-red-700 md:col-span-2">
              {errorMessage}
            </p>
          ) : null}
        </form>
      )}
    </div>
  );
}
