"use client";

import { useState, type FormEvent } from "react";
import { FormField, inputClassName } from "@/components/forms/form-field";
import type { AdminGlobalSettingsValues } from "@/lib/validations";

export function GlobalSettingsForm({ initialValues }: { initialValues: AdminGlobalSettingsValues }) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(name: keyof AdminGlobalSettingsValues, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/settings/global", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to save global settings.");
      return;
    }

    setMessage("Global settings saved.");
  }

  return (
    <form className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm" onSubmit={submit}>
      <div className="grid gap-6">
        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Contact</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <FormField label="WhatsApp number">
              <input className={inputClassName} value={values.globalWhatsappNumber || ""} onChange={(event) => update("globalWhatsappNumber", event.target.value)} placeholder="+20XXXXXXXXX" />
              <p className="mt-2 text-xs text-[var(--color-gray-600)]">Used in ALL Book Now buttons site-wide</p>
            </FormField>
            <FormField label="Phone number">
              <input className={inputClassName} value={values.globalPhoneNumber || ""} onChange={(event) => update("globalPhoneNumber", event.target.value)} placeholder="(+20) 123 456 7890" />
              <p className="mt-2 text-xs text-[var(--color-gray-600)]">Shown in header utility bar</p>
            </FormField>
            <FormField label="Email">
              <input className={inputClassName} type="email" value={values.globalEmail || ""} onChange={(event) => update("globalEmail", event.target.value)} />
              <p className="mt-2 text-xs text-[var(--color-gray-600)]">Shown in header utility bar and footer</p>
            </FormField>
          </div>
        </section>

        <section>
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Social Media</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <FormField label="Facebook URL">
              <input className={inputClassName} value={values.socialFacebook || ""} onChange={(event) => update("socialFacebook", event.target.value)} />
            </FormField>
            <FormField label="Instagram URL">
              <input className={inputClassName} value={values.socialInstagram || ""} onChange={(event) => update("socialInstagram", event.target.value)} />
            </FormField>
            <FormField label="TripAdvisor URL">
              <input className={inputClassName} value={values.socialTripadvisor || ""} onChange={(event) => update("socialTripadvisor", event.target.value)} />
            </FormField>
            <FormField label="Twitter/X URL">
              <input className={inputClassName} value={values.socialTwitter || ""} onChange={(event) => update("socialTwitter", event.target.value)} />
            </FormField>
            <FormField label="YouTube URL">
              <input className={inputClassName} value={values.socialYoutube || ""} onChange={(event) => update("socialYoutube", event.target.value)} />
            </FormField>
          </div>
        </section>
      </div>

      {message ? <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Global Settings"}
      </button>
    </form>
  );
}
