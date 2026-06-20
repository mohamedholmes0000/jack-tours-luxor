"use client";

import { useState, type FormEvent } from "react";
import { FormField, inputClassName } from "@/components/forms/form-field";
import type { AdminContactMapValues } from "@/lib/validations";

export function ContactMapSettingsForm({ initialValues }: { initialValues: AdminContactMapValues }) {
  const [values, setValues] = useState(initialValues);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    const response = await fetch("/api/admin/pages/contact", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to save contact map settings.");
      return;
    }

    setMessage("Contact map settings saved.");
  }

  return (
    <form className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm" onSubmit={submit}>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <FormField label="Map location">
            <input
              className={inputClassName}
              value={values.contactMapLocation}
              onChange={(event) => setValues((current) => ({ ...current, contactMapLocation: event.target.value }))}
            />
            <p className="mt-2 text-xs text-[var(--color-gray-600)]">
              Type an address or place name (e.g., Karnak Temple, Luxor, Egypt).
            </p>
          </FormField>
        </div>
        <FormField label="Map zoom level">
          <input
            className={inputClassName}
            min={1}
            max={20}
            type="number"
            value={values.contactMapZoom}
            onChange={(event) => setValues((current) => ({ ...current, contactMapZoom: Number(event.target.value) }))}
          />
        </FormField>
        <label className="mt-7 flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] px-4 text-sm font-medium text-[var(--color-navy)]">
          <input
            checked={values.contactMapVisible}
            type="checkbox"
            onChange={(event) => setValues((current) => ({ ...current, contactMapVisible: event.target.checked }))}
          />
          Map visible
        </label>
      </div>

      {message ? <p className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <button className="btn-primary mt-6 w-full" disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Contact Map"}
      </button>
    </form>
  );
}
