"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { TourInquiryValues, tourInquirySchema } from "@/lib/validations";
import { buildTourInquiryMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

type TourInquiryFormProps = {
  tourTitle: string;
  tourSlug: string;
};

export function TourInquiryForm({ tourTitle, tourSlug }: TourInquiryFormProps) {
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
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
    const url = buildWhatsAppUrl(buildTourInquiryMessage({ ...values, tourTitle }));

    try {
      await fetch("/api/inquiries", {
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
    } catch (error) {
      console.warn("Inquiry API unavailable; continuing to WhatsApp.", error);
    }

    setSuccessUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsSending(false);
  }

  return (
    <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-xl md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-[var(--color-gold)]">
            Tour inquiry
          </p>
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
        <p className="mt-5 bg-[var(--color-sand)] p-4 text-sm leading-7 text-[var(--color-gray-600)]">
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
        </form>
      )}
    </div>
  );
}
