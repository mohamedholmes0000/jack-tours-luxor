"use client";

import Image from "next/image";
import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import { useMemo, useRef, useState } from "react";
import {
  ChevronDown,
  Sparkles,
  type LucideProps,
} from "lucide-react";
import {
  curatedHomepageIcons,
  normalizeHomepageIconName,
  type HomepageEditorValues,
} from "@/lib/homepage-settings";
import { safeImageSrc } from "@/lib/images";

type DynamicLucideIcon = ComponentType<LucideProps>;

const iconMap: Record<string, DynamicLucideIcon> = {
  Anchor: dynamic(() => import("lucide-react").then((mod) => mod.Anchor)),
  Award: dynamic(() => import("lucide-react").then((mod) => mod.Award)),
  Calendar: dynamic(() => import("lucide-react").then((mod) => mod.Calendar)),
  Camera: dynamic(() => import("lucide-react").then((mod) => mod.Camera)),
  Car: dynamic(() => import("lucide-react").then((mod) => mod.Car)),
  Clock: dynamic(() => import("lucide-react").then((mod) => mod.Clock)),
  Coffee: dynamic(() => import("lucide-react").then((mod) => mod.Coffee)),
  Compass: dynamic(() => import("lucide-react").then((mod) => mod.Compass)),
  Globe: dynamic(() => import("lucide-react").then((mod) => mod.Globe)),
  Heart: dynamic(() => import("lucide-react").then((mod) => mod.Heart)),
  Hotel: dynamic(() => import("lucide-react").then((mod) => mod.Hotel)),
  Mail: dynamic(() => import("lucide-react").then((mod) => mod.Mail)),
  Map: dynamic(() => import("lucide-react").then((mod) => mod.Map)),
  MapPin: dynamic(() => import("lucide-react").then((mod) => mod.MapPin)),
  MessageCircle: dynamic(() => import("lucide-react").then((mod) => mod.MessageCircle)),
  Moon: dynamic(() => import("lucide-react").then((mod) => mod.Moon)),
  Mountain: dynamic(() => import("lucide-react").then((mod) => mod.Mountain)),
  Phone: dynamic(() => import("lucide-react").then((mod) => mod.Phone)),
  Plane: dynamic(() => import("lucide-react").then((mod) => mod.Plane)),
  Shield: dynamic(() => import("lucide-react").then((mod) => mod.Shield)),
  Ship: dynamic(() => import("lucide-react").then((mod) => mod.Ship)),
  Sparkles: dynamic(() => import("lucide-react").then((mod) => mod.Sparkles)),
  Star: dynamic(() => import("lucide-react").then((mod) => mod.Star)),
  Sun: dynamic(() => import("lucide-react").then((mod) => mod.Sun)),
  Sunrise: dynamic(() => import("lucide-react").then((mod) => mod.Sunrise)),
  Tent: dynamic(() => import("lucide-react").then((mod) => mod.Tent)),
  TreePine: dynamic(() => import("lucide-react").then((mod) => mod.TreePine)),
  UserCheck: dynamic(() => import("lucide-react").then((mod) => mod.UserCheck)),
  Users: dynamic(() => import("lucide-react").then((mod) => mod.Users)),
  Utensils: dynamic(() => import("lucide-react").then((mod) => mod.Utensils)),
};

type SectionKey = "hero" | "why" | "finalCta";
type ImageField =
  | "finalCtaBackgroundImage"
  | "heroBackgroundImage"
  | "whyCollageImage1"
  | "whyCollageImage2"
  | "whyCollageImage3";

function TextInput({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
      {label}
      <input
        className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function TextArea({
  disabled,
  label,
  onChange,
  rows = 3,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  rows?: number;
  value?: string;
}) {
  return (
    <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
      {label}
      <textarea
        className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm leading-6 outline-none transition focus:border-[var(--color-gold)] focus:bg-white disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        rows={rows}
        value={value || ""}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
}

function Toggle({
  checked,
  disabled,
  label,
  onChange,
}: {
  checked: boolean;
  disabled: boolean;
  label: string;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] bg-white px-4 text-sm font-semibold text-[var(--color-navy)]">
      <input
        checked={checked}
        disabled={disabled}
        type="checkbox"
        onChange={(event) => onChange(event.target.checked)}
      />
      {label}
    </label>
  );
}

function IconPreview({ name }: { name: string }) {
  const normalized = normalizeHomepageIconName(name);
  const Icon = iconMap[normalized] || Sparkles;
  return <Icon aria-hidden="true" className="h-5 w-5" />;
}

function IconPicker({
  disabled,
  onChange,
  value,
}: {
  disabled: boolean;
  onChange: (value: string) => void;
  value: string;
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const normalized = normalizeHomepageIconName(value);
  const visibleIcons = useMemo(
    () => curatedHomepageIcons.filter((name) => name.toLowerCase().includes(search.trim().toLowerCase())),
    [search],
  );

  return (
    <div className="relative">
      <button
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-left text-sm font-medium text-[var(--color-navy)] transition hover:border-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-60"
        disabled={disabled}
        type="button"
        onClick={() => setOpen((current) => !current)}
      >
        <span className="flex items-center gap-2">
          <IconPreview name={normalized} />
          {normalized}
        </span>
        <ChevronDown className={`h-4 w-4 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open ? (
        <div className="absolute z-40 mt-2 w-[min(22rem,calc(100vw-3rem))] rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-2xl">
          <input
            className="mb-3 w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-3 py-2 text-sm outline-none focus:border-[var(--color-gold)]"
            placeholder="Search icons"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <div className="grid max-h-72 grid-cols-4 gap-2 overflow-y-auto">
            {visibleIcons.map((name) => (
              <button
                key={name}
                className={`grid gap-1 rounded-xl border p-2 text-center text-[10px] font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-[var(--color-sand)] ${
                  normalized === name ? "border-[var(--color-gold)] bg-[var(--color-sand)]" : "border-[var(--color-gray-100)]"
                }`}
                type="button"
                onClick={() => {
                  onChange(name);
                  setOpen(false);
                  setSearch("");
                }}
              >
                <span className="mx-auto text-[var(--color-gold-dark)]">
                  <IconPreview name={name} />
                </span>
                <span className="truncate">{name}</span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ImageUploadField({
  disabled,
  label,
  onChange,
  value,
}: {
  disabled: boolean;
  label: string;
  onChange: (value: string) => void;
  value?: string;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function uploadFile(file: File) {
    setError(null);

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setError("Use a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be 5MB or smaller.");
      return;
    }

    setUploading(true);
    const payload = new FormData();
    payload.append("file", file);

    try {
      const response = await fetch("/api/admin/uploads/homepage", { method: "POST", body: payload });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; url?: string } | null;

      if (!response.ok || !result?.ok || !result.url) {
        setError(result?.message || "Unable to upload image.");
        return;
      }

      onChange(result.url);
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <p className="text-sm font-medium text-[var(--color-navy)]">{label}</p>
      <div
        role="button"
        tabIndex={disabled ? -1 : 0}
        onClick={() => {
          if (!disabled) inputRef.current?.click();
        }}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          if (disabled) return;
          const file = event.dataTransfer.files[0];
          if (file) void uploadFile(file);
        }}
        onKeyDown={(event) => {
          if (!disabled && (event.key === "Enter" || event.key === " ")) inputRef.current?.click();
        }}
        className="relative grid min-h-52 cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-[rgb(214_173_84_/_45%)] bg-[var(--color-ivory)] text-center transition hover:border-[var(--color-gold)]"
      >
        {value ? (
          <Image src={safeImageSrc(value)} alt={label} fill sizes="480px" className="object-cover" />
        ) : (
          <div className="px-6">
            <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Upload image</p>
            <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">Drag and drop, or click to choose an image.</p>
          </div>
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
          if (file) void uploadFile(file);
          event.target.value = "";
        }}
      />
      <div className="flex flex-wrap gap-2">
        <button className="btn-secondary" disabled={disabled} type="button" onClick={() => inputRef.current?.click()}>
          Replace
        </button>
        <button className="btn-secondary" disabled={disabled || !value} type="button" onClick={() => onChange("")}>
          Remove
        </button>
      </div>
      {error ? <p className="text-sm text-red-700">{error}</p> : null}
    </div>
  );
}

function SectionCard({
  children,
  description,
  open,
  title,
  onToggle,
}: {
  children: React.ReactNode;
  description: string;
  open: boolean;
  title: string;
  onToggle: () => void;
}) {
  return (
    <section className="overflow-visible rounded-2xl border border-[var(--color-gray-100)] bg-white shadow-sm">
      <button
        className="flex w-full items-center justify-between gap-4 p-5 text-left"
        type="button"
        onClick={onToggle}
      >
        <span>
          <span className="block font-serif text-2xl font-semibold text-[var(--color-navy)]">{title}</span>
          <span className="mt-1 block text-sm text-[var(--color-gray-600)]">{description}</span>
        </span>
        <ChevronDown className={`h-5 w-5 shrink-0 text-[var(--color-gold-dark)] transition ${open ? "rotate-180" : ""}`} />
      </button>
      {open ? <div className="border-t border-[var(--color-gray-100)] p-5">{children}</div> : null}
    </section>
  );
}

export function HomepageEditor({ canEdit, initialValues }: { canEdit: boolean; initialValues: HomepageEditorValues }) {
  const [values, setValues] = useState(initialValues);
  const [openSections, setOpenSections] = useState<Record<SectionKey, boolean>>({
    finalCta: false,
    hero: true,
    why: false,
  });
  const [savingSection, setSavingSection] = useState<SectionKey | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  function setField<Key extends keyof HomepageEditorValues>(field: Key, value: HomepageEditorValues[Key]) {
    setValues((current) => ({ ...current, [field]: value }));
  }

  async function save(section: SectionKey) {
    setSavingSection(section);
    setToast(null);
    setError(null);

    try {
      const response = await fetch("/api/admin/homepage", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.message || "Unable to save homepage settings.");
        return;
      }

      setToast(`${section === "finalCta" ? "Final CTA" : section === "why" ? "Why Us" : "Hero"} section saved.`);
    } finally {
      setSavingSection(null);
    }
  }

  function saveButton(section: SectionKey) {
    if (!canEdit) return null;
    return (
      <div className="mt-6 flex justify-end">
        <button className="btn-primary" disabled={savingSection === section} type="button" onClick={() => void save(section)}>
          {savingSection === section ? "Saving..." : "Save Section"}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {toast ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{toast}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <SectionCard
        description="Hero image, headline, CTAs, and micro trust row."
        open={openSections.hero}
        title="Hero"
        onToggle={() => setOpenSections((current) => ({ ...current, hero: !current.hero }))}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled={!canEdit}
            label="Background image"
            value={values.heroBackgroundImage}
            onChange={(value) => setField("heroBackgroundImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled={!canEdit} label="Eyebrow text" value={values.heroEyebrow} onChange={(value) => setField("heroEyebrow", value)} />
              <TextInput disabled={!canEdit} label="Headline" value={values.heroHeadline} onChange={(value) => setField("heroHeadline", value)} />
              <TextInput disabled={!canEdit} label="Italic accent words" value={values.heroHeadlineAccent} onChange={(value) => setField("heroHeadlineAccent", value)} />
              <TextInput disabled={!canEdit} label="Primary CTA label" value={values.heroPrimaryCtaLabel} onChange={(value) => setField("heroPrimaryCtaLabel", value)} />
              <TextInput disabled={!canEdit} label="Primary CTA link" value={values.heroPrimaryCtaHref} onChange={(value) => setField("heroPrimaryCtaHref", value)} />
              <TextInput disabled={!canEdit} label="Secondary link label" value={values.heroSecondaryLinkLabel} onChange={(value) => setField("heroSecondaryLinkLabel", value)} />
              <TextInput disabled={!canEdit} label="Secondary link URL" value={values.heroSecondaryLinkHref} onChange={(value) => setField("heroSecondaryLinkHref", value)} />
            </div>
            <TextArea disabled={!canEdit} label="Subheadline paragraph" value={values.heroSubheadline} onChange={(value) => setField("heroSubheadline", value)} />
            <div className="grid gap-5 md:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <TextInput
                  key={index}
                  disabled={!canEdit}
                  label={`Trust badge ${index + 1}`}
                  value={values.heroTrustBadges[index]}
                  onChange={(value) => {
                    const next = [...values.heroTrustBadges];
                    next[index] = value;
                    setField("heroTrustBadges", next);
                  }}
                />
              ))}
            </div>
            <Toggle checked={values.heroVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("heroVisible", value)} />
          </div>
        </div>
        {saveButton("hero")}
      </SectionCard>

      <SectionCard
        description="Story copy, collage images, and included services."
        open={openSections.why}
        title="Why Us"
        onToggle={() => setOpenSections((current) => ({ ...current, why: !current.why }))}
      >
        <div className="grid gap-6">
          <div className="grid gap-5 md:grid-cols-2">
            <TextInput disabled={!canEdit} label="Eyebrow text" value={values.whyEyebrow} onChange={(value) => setField("whyEyebrow", value)} />
            <TextInput disabled={!canEdit} label="Heading text" value={values.whyHeading} onChange={(value) => setField("whyHeading", value)} />
            <TextInput disabled={!canEdit} label="Italic accent words" value={values.whyHeadingAccent} onChange={(value) => setField("whyHeadingAccent", value)} />
            <TextInput disabled={!canEdit} label="CTA button label" value={values.whyCtaLabel} onChange={(value) => setField("whyCtaLabel", value)} />
            <TextInput disabled={!canEdit} label="CTA button link" value={values.whyCtaHref} onChange={(value) => setField("whyCtaHref", value)} />
            <TextInput disabled={!canEdit} label="Included services heading" value={values.whyIncludedHeading} onChange={(value) => setField("whyIncludedHeading", value)} />
          </div>
          <TextArea disabled={!canEdit} label="Description paragraph" value={values.whyDescription} onChange={(value) => setField("whyDescription", value)} />
          <div className="grid gap-5 md:grid-cols-3">
            {(["whyCollageImage1", "whyCollageImage2", "whyCollageImage3"] as ImageField[]).map((field, index) => (
              <ImageUploadField
                key={field}
                disabled={!canEdit}
                label={`Collage image ${index + 1}`}
                value={values[field]}
                onChange={(value) => setField(field, value)}
              />
            ))}
          </div>
          <div>
            <p className="mb-4 font-serif text-2xl font-semibold text-[var(--color-navy)]">Included Services</p>
            <div className="grid gap-4 md:grid-cols-2">
              {values.whyServices.map((service, index) => (
                <div key={index} className="grid gap-3 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] p-4">
                  <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
                    Icon
                    <IconPicker
                      disabled={!canEdit}
                      value={service.icon}
                      onChange={(icon) => {
                        const next = [...values.whyServices];
                        next[index] = { ...next[index], icon };
                        setField("whyServices", next);
                      }}
                    />
                  </label>
                  <TextInput
                    disabled={!canEdit}
                    label="Label text"
                    value={service.label}
                    onChange={(label) => {
                      const next = [...values.whyServices];
                      next[index] = { ...next[index], label };
                      setField("whyServices", next);
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
          <Toggle checked={values.whyVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("whyVisible", value)} />
        </div>
        {saveButton("why")}
      </SectionCard>

      <SectionCard
        description="Final booking call-to-action image, copy, and links."
        open={openSections.finalCta}
        title="Final CTA"
        onToggle={() => setOpenSections((current) => ({ ...current, finalCta: !current.finalCta }))}
      >
        <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
          <ImageUploadField
            disabled={!canEdit}
            label="Background image"
            value={values.finalCtaBackgroundImage}
            onChange={(value) => setField("finalCtaBackgroundImage", value)}
          />
          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <TextInput disabled={!canEdit} label="Eyebrow text" value={values.finalCtaEyebrow} onChange={(value) => setField("finalCtaEyebrow", value)} />
              <TextInput disabled={!canEdit} label="Heading text" value={values.finalCtaHeading} onChange={(value) => setField("finalCtaHeading", value)} />
              <TextInput disabled={!canEdit} label="Italic accent words" value={values.finalCtaHeadingAccent} onChange={(value) => setField("finalCtaHeadingAccent", value)} />
              <TextInput disabled={!canEdit} label="Primary button label" value={values.finalCtaPrimaryButtonLabel} onChange={(value) => setField("finalCtaPrimaryButtonLabel", value)} />
              <TextInput disabled={!canEdit} label="Primary button link" value={values.finalCtaPrimaryButtonHref} onChange={(value) => setField("finalCtaPrimaryButtonHref", value)} />
              <TextInput disabled={!canEdit} label="Secondary link label" value={values.finalCtaSecondaryLinkLabel} onChange={(value) => setField("finalCtaSecondaryLinkLabel", value)} />
              <TextInput disabled={!canEdit} label="Secondary link URL" value={values.finalCtaSecondaryLinkHref} onChange={(value) => setField("finalCtaSecondaryLinkHref", value)} />
            </div>
            <TextArea disabled={!canEdit} label="Description paragraph" value={values.finalCtaDescription} onChange={(value) => setField("finalCtaDescription", value)} />
            <Toggle checked={values.finalCtaVisible} disabled={!canEdit} label="Section visible" onChange={(value) => setField("finalCtaVisible", value)} />
          </div>
        </div>
        {saveButton("finalCta")}
      </SectionCard>

      <div className="rounded-2xl border border-[rgb(214_173_84_/_28%)] bg-[var(--color-sand)]/55 p-5 text-sm leading-6 text-[var(--color-navy)]">
        <p className="font-serif text-2xl font-semibold">More sections coming soon</p>
        <p className="mt-2 text-[var(--color-navy)]/70">
          Destinations Header, Featured Journeys, Our World, Stats, Testimonials
        </p>
      </div>
    </div>
  );
}
