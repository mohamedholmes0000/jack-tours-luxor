"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { ContactValues, contactSchema } from "@/lib/validations";
import { buildContactMessage, buildWhatsAppUrl } from "@/lib/whatsapp";

export function ContactForm() {
  const [successUrl, setSuccessUrl] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
  });

  async function onSubmit(values: ContactValues) {
    setIsSending(true);
    const url = buildWhatsAppUrl(buildContactMessage(values));

    try {
      await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          name: values.name,
          email: values.email,
          phone: values.phone,
          whatsapp: values.phone,
          message: `Subject: ${values.subject}\n\n${values.message}`,
        }),
      });
    } catch (error) {
      console.warn("Inquiry API unavailable; continuing to WhatsApp.", error);
    }

    setSuccessUrl(url);
    window.open(url, "_blank", "noopener,noreferrer");
    setIsSending(false);
  }

  if (successUrl) {
    return (
      <div className="border border-[var(--color-gray-100)] bg-[var(--color-sand)] p-6">
        <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
          Message prepared for WhatsApp.
        </h2>
        <p className="mt-3 text-sm leading-7 text-[var(--color-gray-600)]">
          We opened WhatsApp with your contact message. Use this button if your browser blocked it.
        </p>
        <a className="btn-primary mt-6" href={successUrl} target="_blank" rel="noreferrer">
          Open WhatsApp
        </a>
      </div>
    );
  }

  return (
    <form className="border border-[var(--color-gray-100)] bg-white p-5 shadow-xl md:p-8" onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Name" error={errors.name?.message}>
          <input className={inputClassName} {...register("name")} />
        </FormField>
        <FormField label="Email" error={errors.email?.message}>
          <input className={inputClassName} type="email" {...register("email")} />
        </FormField>
        <FormField label="WhatsApp / phone" error={errors.phone?.message}>
          <input className={inputClassName} {...register("phone")} />
        </FormField>
        <FormField label="Subject" error={errors.subject?.message}>
          <input className={inputClassName} {...register("subject")} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Message" error={errors.message?.message}>
            <textarea className={textareaClassName} {...register("message")} />
          </FormField>
        </div>
      </div>
      <button className="btn-primary mt-8 w-full sm:w-auto" type="submit" disabled={isSending}>
        {isSending ? "Preparing..." : "Send on WhatsApp"}
      </button>
    </form>
  );
}
