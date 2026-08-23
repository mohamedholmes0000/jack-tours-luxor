"use client";

import Image from "next/image";
import { useRef, useState, type FormEvent } from "react";
import { InteractiveImageCropper } from "@/components/admin/interactive-image-cropper";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import type { FooterLink, PublicHeaderFooterSettings } from "@/lib/data/settings";
import { isAllowedAdminImageSrc, safeImageSrc } from "@/lib/images";

function formatLinks(links: FooterLink[]) {
  return JSON.stringify(links, null, 2);
}

const allowedLogoImageTypes = ["image/jpeg", "image/png", "image/webp"];
const logoCropAspectRatio = 4 / 1;

function validateLogoImageFile(file: File) {
  if (!allowedLogoImageTypes.includes(file.type)) {
    return "Use a JPG, PNG, or WebP image.";
  }

  if (file.size > 5 * 1024 * 1024) {
    return "Image must be 5MB or smaller.";
  }

  return null;
}

function WebsiteLogoField({
  clearLabel,
  disabled,
  emptyStateMessage,
  onChange,
  previewAlt,
  title,
  usage,
  value,
}: {
  clearLabel: string;
  disabled: boolean;
  emptyStateMessage: string;
  onChange: (value: string) => void;
  previewAlt: string;
  title: string;
  usage: string;
  value: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [pendingCropFile, setPendingCropFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const rawValue = value.trim();
  const previewSrc = rawValue ? safeImageSrc(rawValue, "") : "";
  const previewIsUnavailable = Boolean(rawValue && !previewSrc);

  function openCropStep(file: File) {
    const validationError = validateLogoImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError(null);
    setPendingCropFile(file);
  }

  async function uploadLogo(file: File) {
    setUploading(true);
    setError(null);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/admin/uploads/homepage", { method: "POST", body: payload });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; url?: string } | null;

      if (!response.ok || !result?.ok || !result.url) {
        const message = result?.message || "Unable to upload logo.";
        setError(message);
        throw new Error(message);
      }

      if (!isAllowedAdminImageSrc(result.url)) {
        const message = "Upload returned an unsupported image source.";
        setError(message);
        throw new Error(message);
      }

      onChange(result.url);
      setPendingCropFile(null);
    } finally {
      setUploading(false);
    }
  }

  return (
    <section className="grid gap-3 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)]/45 p-4">
      <div>
        <p className="text-sm font-semibold text-[var(--color-navy)]">{title}</p>
        <p className="mt-1 text-xs leading-5 text-[var(--color-gray-600)]">
          {usage} Upload a JPG, PNG, or WebP logo. It is cropped to a fixed 4:1 horizontal ratio before saving.
        </p>
      </div>
      <div className="relative grid min-h-32 place-items-center overflow-hidden rounded-xl border border-dashed border-[rgb(214_173_84_/_45%)] bg-[var(--color-ivory)] p-4">
        {previewSrc ? (
          <Image
            src={previewSrc}
            alt={previewAlt}
            width={640}
            height={160}
            unoptimized
            className="h-20 w-full max-w-md object-contain"
          />
        ) : previewIsUnavailable ? (
          <p className="text-center text-sm text-red-700">The saved logo cannot be displayed. Replace it with a supported image.</p>
        ) : (
          <p className="text-center text-sm text-[var(--color-gray-600)]">{emptyStateMessage}</p>
        )}
        {uploading ? (
          <div className="absolute inset-0 grid place-items-center bg-[var(--color-navy)]/70 text-sm font-bold uppercase tracking-[0.12em] text-white">
            Uploading...
          </div>
        ) : null}
      </div>
      <input
        ref={inputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        disabled={disabled}
        onChange={(event) => {
          const file = event.target.files?.[0];
          if (file) openCropStep(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" disabled={disabled || uploading} type="button" onClick={() => inputRef.current?.click()}>
          {rawValue ? `Replace ${title}` : `Upload ${title}`}
        </button>
        <button
          className="btn-secondary"
          disabled={disabled || uploading || !rawValue}
          type="button"
          onClick={() => onChange("")}
        >
          {clearLabel}
        </button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
      {pendingCropFile ? (
        <InteractiveImageCropper
          key={`${pendingCropFile.name}-${pendingCropFile.lastModified}-${pendingCropFile.size}`}
          aspectRatio={logoCropAspectRatio}
          aspectRatioLabel="4:1"
          backgroundColor={null}
          file={pendingCropFile}
          fileNamePrefix="website-logo"
          maxOutputWidth={1600}
          outputType="image/png"
          onCancel={() => setPendingCropFile(null)}
          onChooseDifferent={() => inputRef.current?.click()}
          onCrop={uploadLogo}
          processing={uploading}
        />
      ) : null}
    </section>
  );
}

export function HeaderFooterSettingsForm({ initialValues }: { initialValues: PublicHeaderFooterSettings }) {
  const [values, setValues] = useState(initialValues);
  const [linksText, setLinksText] = useState(formatLinks(initialValues.footerCol1Links));
  const [openHeader, setOpenHeader] = useState(true);
  const [openFooter, setOpenFooter] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function update(name: keyof PublicHeaderFooterSettings, value: string) {
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    let footerCol1Links: FooterLink[];
    try {
      footerCol1Links = JSON.parse(linksText) as FooterLink[];
      if (!Array.isArray(footerCol1Links)) throw new Error("Links must be an array.");
    } catch {
      setLoading(false);
      setError('Column 1 links must be valid JSON like [{"label":"Tours","url":"/tours"}].');
      return;
    }

    const response = await fetch("/api/admin/settings/header-footer", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...values, footerCol1Links }),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to save header/footer settings.");
      return;
    }

    setValues((current) => ({ ...current, footerCol1Links }));
    setMessage("Header & footer settings saved.");
  }

  return (
    <form className="space-y-5" onSubmit={save}>
      <p className="rounded-xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)] p-4 text-sm leading-6 text-[var(--color-gray-600)]">
        Live source for the public website logo, fallback logo text, header navigation labels/URLs, Book Now label, footer explore links, footer description, and copyright. Contact details and social links come from Global Settings.
      </p>
      <section className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">
        <button
          className="flex w-full items-center justify-between text-left"
          type="button"
          onClick={() => setOpenHeader((current) => !current)}
        >
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Header</span>
            <span className="mt-2 block font-serif text-3xl font-semibold text-[var(--color-navy)]">Logo and navigation</span>
          </span>
          <span className="text-xl text-[var(--color-gold-dark)]">{openHeader ? "−" : "+"}</span>
        </button>

        {openHeader ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <div className="grid gap-4 md:col-span-2">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Logo Settings</p>
                <p className="mt-1 text-sm text-[var(--color-gray-600)]">Manage independent desktop and mobile navigation logos.</p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                <WebsiteLogoField
                  clearLabel="Use Text Fallback"
                  disabled={loading}
                  emptyStateMessage="No custom desktop logo. The current JACK / EGYPT TOUR logo remains the public fallback."
                  previewAlt="Current desktop logo"
                  title="Desktop Logo"
                  usage="Used in the desktop navigation."
                  value={values.logoImage || ""}
                  onChange={(value) => update("logoImage", value)}
                />
                <WebsiteLogoField
                  clearLabel="Use Desktop Logo"
                  disabled={loading}
                  emptyStateMessage="No mobile logo. The desktop logo will be used automatically."
                  previewAlt="Current mobile logo"
                  title="Mobile Logo"
                  usage="Optional logo optimized for the mobile header. If empty, the desktop logo will be used automatically."
                  value={values.mobileLogoImage || ""}
                  onChange={(value) => update("mobileLogoImage", value)}
                />
              </div>
            </div>
            <FormField label="Logo line 1">
              <input className={inputClassName} value={values.logoLine1} onChange={(event) => update("logoLine1", event.target.value)} />
            </FormField>
            <FormField label="Logo line 2">
              <input className={inputClassName} value={values.logoLine2} onChange={(event) => update("logoLine2", event.target.value)} />
            </FormField>
            {[1, 2, 3, 4].map((index) => {
              const labelKey = `navLink${index}Label` as keyof PublicHeaderFooterSettings;
              const urlKey = `navLink${index}Url` as keyof PublicHeaderFooterSettings;
              return (
                <div key={index} className="grid gap-5 rounded-xl border border-[var(--color-gray-100)] p-4 md:col-span-2 md:grid-cols-2">
                  <FormField label={`Nav link ${index} label`}>
                    <input className={inputClassName} value={String(values[labelKey] || "")} onChange={(event) => update(labelKey, event.target.value)} />
                  </FormField>
                  <FormField label={`Nav link ${index} URL`}>
                    <input className={inputClassName} value={String(values[urlKey] || "")} onChange={(event) => update(urlKey, event.target.value)} />
                  </FormField>
                </div>
              );
            })}
            <FormField label="Book Now button label">
              <input className={inputClassName} value={values.bookNowLabel} onChange={(event) => update("bookNowLabel", event.target.value)} />
            </FormField>
            <p className="self-end rounded-xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)] p-4 text-sm text-[var(--color-gray-600)]">
              Book Now URL stays locked to /trip-planner for now.
            </p>
          </div>
        ) : null}
      </section>

      <section className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">
        <button
          className="flex w-full items-center justify-between text-left"
          type="button"
          onClick={() => setOpenFooter((current) => !current)}
        >
          <span>
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Footer</span>
            <span className="mt-2 block font-serif text-3xl font-semibold text-[var(--color-navy)]">Footer columns and copy</span>
          </span>
          <span className="text-xl text-[var(--color-gold-dark)]">{openFooter ? "−" : "+"}</span>
        </button>

        {openFooter ? (
          <div className="mt-6 grid gap-5 md:grid-cols-2">
            <FormField label="Footer tagline">
              <input className={inputClassName} value={values.footerTagline || ""} onChange={(event) => update("footerTagline", event.target.value)} />
            </FormField>
            <FormField label="Column heading 1">
              <input className={inputClassName} value={values.footerCol1Heading} onChange={(event) => update("footerCol1Heading", event.target.value)} />
            </FormField>
            <div className="md:col-span-2">
              <FormField label="Footer description">
                <textarea className={textareaClassName} rows={3} value={values.footerDescription || ""} onChange={(event) => update("footerDescription", event.target.value)} />
              </FormField>
            </div>
            <div className="md:col-span-2">
              <FormField label="Column 1 links JSON">
                <textarea className={textareaClassName} rows={8} value={linksText} onChange={(event) => setLinksText(event.target.value)} />
              </FormField>
            </div>
            <FormField label="Column heading 2">
              <input className={inputClassName} value={values.footerCol2Heading} onChange={(event) => update("footerCol2Heading", event.target.value)} />
            </FormField>
            <p className="self-end rounded-xl border border-[rgb(214_173_84_/_24%)] bg-[var(--color-ivory)] p-4 text-sm text-[var(--color-gray-600)]">
              Contact column pulls phone, email, address, and social links from Global Settings.
            </p>
            <div className="md:col-span-2">
              <FormField label="Copyright text">
                <input className={inputClassName} value={values.footerCopyright || ""} onChange={(event) => update("footerCopyright", event.target.value)} />
              </FormField>
            </div>
          </div>
        ) : null}
      </section>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <button className="btn-primary w-full" disabled={loading} type="submit">
        {loading ? "Saving..." : "Save Header & Footer"}
      </button>
    </form>
  );
}
