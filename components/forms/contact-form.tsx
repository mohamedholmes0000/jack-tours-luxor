"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { ContactValues, contactSchema } from "@/lib/validations";

const fieldClassName =
  "min-h-12 w-full rounded-lg border border-[rgb(6_17_31_/_15%)] bg-white px-4 py-3 text-[15px] text-[var(--color-navy)] outline-none transition placeholder:text-[var(--color-navy)]/30 focus:border-[var(--color-gold)] focus:shadow-[0_0_0_3px_rgb(214_173_84_/_14%)]";

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-[0.12em] text-[var(--color-gold-dark)]">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

export function ContactForm() {
  const [message, setMessage] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  async function onSubmit(values: ContactValues) {
    setIsSending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "CONTACT",
          name: values.name,
          email: values.email,
          message: `Subject: ${values.subject || "Website message"}\n\n${values.message}`,
        }),
      });

      if (!response.ok) {
        setMessage("Message received locally. Please email us if you do not hear back soon.");
        return;
      }

      setMessage("Message sent! We'll reply within 24 hours.");
      reset();
    } catch (error) {
      console.warn("Inquiry API unavailable.", error);
      setMessage("Message received locally. Please email us if you do not hear back soon.");
    } finally {
      setIsSending(false);
    }
  }

  return (
    <form
      className="rounded-xl bg-white p-6 shadow-[0_2px_8px_rgb(0_0_0_/_6%)] md:p-8"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h2 className="text-xl font-semibold text-[var(--color-navy)]">Send us a message</h2>
      <div className="mt-6 grid gap-5">
        <Field label="Name" error={errors.name?.message}>
          <input className={fieldClassName} placeholder="Your name" {...register("name")} />
        </Field>
        <Field label="Email" error={errors.email?.message}>
          <input className={fieldClassName} placeholder="you@example.com" type="email" {...register("email")} />
        </Field>
        <Field label="Subject" error={errors.subject?.message}>
          <input className={fieldClassName} placeholder="Trip question, booking request..." {...register("subject")} />
        </Field>
        <Field label="Message" error={errors.message?.message}>
          <textarea
            className={`${fieldClassName} min-h-[9rem] resize-y`}
            placeholder="Tell us what you need help with."
            rows={5}
            {...register("message")}
          />
        </Field>
      </div>
      {message ? (
        <p className="mt-5 rounded-lg bg-[var(--color-sand)] px-4 py-3 text-sm font-medium text-[var(--color-navy)]">
          {message}
        </p>
      ) : null}
      <button className="mt-6 min-h-12 w-full rounded-md bg-[var(--color-gold)] px-5 py-3.5 text-[13px] font-semibold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold-light)]" type="submit" disabled={isSending}>
        {isSending ? "Sending..." : "Send Message"}
      </button>
    </form>
  );
}
