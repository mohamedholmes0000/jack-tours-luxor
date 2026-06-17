"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { safeImageSrc } from "@/lib/images";
import { adminGalleryImageSchema, type AdminGalleryImageValues } from "@/lib/validations";

export type GalleryCategoryOption = {
  id: string;
  name: string;
};

type AdminGalleryImageFormProps = {
  categories: GalleryCategoryOption[];
  id?: string;
  initialValues?: AdminGalleryImageValues;
  mode: "create" | "edit";
};

const fallbackCategories = ["Luxor", "Nile Cruise", "Cairo", "Experiences"];

export function AdminGalleryImageForm({ categories, id, initialValues, mode }: AdminGalleryImageFormProps) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState(initialValues?.url ?? "");
  const [selectedCategoryId, setSelectedCategoryId] = useState(initialValues?.categoryId ?? categories[0]?.id ?? "");
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const form = useForm<AdminGalleryImageValues>({
    resolver: zodResolver(adminGalleryImageSchema),
    defaultValues: initialValues ?? {
      active: true,
      alt: "",
      caption: "",
      category: categories[0]?.name ?? "Luxor",
      categoryId: categories[0]?.id ?? "",
      description: "",
      order: 0,
      relatedTourSlug: "",
      title: "",
      url: "",
    },
  });

  async function uploadFile(file: File) {
    setError(null);
    setMessage(null);

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
      const response = await fetch("/api/admin/uploads/gallery", {
        method: "POST",
        body: payload,
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; url?: string } | null;

      if (!response.ok || !result?.ok || !result.url) {
        setError(result?.message || "Unable to upload image.");
        return;
      }

      form.setValue("url", result.url, { shouldDirty: true, shouldValidate: true });
      setPreviewUrl(result.url);
      setMessage("Upload complete. Save the image to publish the change.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(values: AdminGalleryImageValues) {
    setSaving(true);
    setError(null);
    setMessage(null);

    const matchedCategory = categories.find((category) => category.id === values.categoryId);
    const payload = {
      ...values,
      category: matchedCategory?.name || values.category || "Experiences",
      categoryId: matchedCategory?.id || "",
      title: values.title || values.alt,
      description: values.description || values.caption || "",
      relatedTourSlug: values.relatedTourSlug || "",
    };

    try {
      const response = await fetch(mode === "create" ? "/api/admin/gallery" : `/api/admin/gallery/${id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; id?: string; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.message || "Unable to save image.");
        return;
      }

      setMessage("Image saved. Public gallery updated.");
      router.refresh();
      if (mode === "create" && result.id) {
        router.push(`/admin/gallery/${result.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <div className="grid gap-6 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm lg:grid-cols-[minmax(280px,420px)_1fr]">
        <div>
          <div
            role="button"
            tabIndex={0}
            onClick={() => fileInputRef.current?.click()}
            onDragOver={(event) => event.preventDefault()}
            onDrop={(event) => {
              event.preventDefault();
              const file = event.dataTransfer.files[0];
              if (file) void uploadFile(file);
            }}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") fileInputRef.current?.click();
            }}
            className="relative grid aspect-square cursor-pointer place-items-center overflow-hidden rounded-xl border border-dashed border-[rgb(214_173_84_/_45%)] bg-[var(--color-ivory)] text-center transition hover:border-[var(--color-gold)]"
          >
            {previewUrl ? (
              <Image src={safeImageSrc(previewUrl)} alt="Gallery preview" fill sizes="420px" className="object-cover" />
            ) : (
              <div className="px-6">
                <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Upload image</p>
                <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">
                  Drag and drop, or click to choose JPG, PNG, or WebP up to 5MB.
                </p>
              </div>
            )}
            {uploading ? (
              <div className="absolute inset-0 grid place-items-center bg-[var(--color-navy)]/70 text-sm font-bold uppercase tracking-[0.12em] text-white">
                Uploading...
              </div>
            ) : null}
          </div>
          <input
            ref={fileInputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) void uploadFile(file);
              event.target.value = "";
            }}
          />
          <input type="hidden" {...form.register("url")} />
          {form.formState.errors.url?.message ? (
            <p className="mt-2 text-sm text-red-700">{form.formState.errors.url.message}</p>
          ) : null}
        </div>

        <div className="grid gap-5">
          <div className="grid gap-5 md:grid-cols-2">
            <FormField label="Title" error={form.formState.errors.title?.message}>
              <input className={inputClassName} required {...form.register("title")} />
            </FormField>
            <FormField label="Alt text" error={form.formState.errors.alt?.message}>
              <input className={inputClassName} required {...form.register("alt")} />
            </FormField>
          </div>

          <FormField label="Caption">
            <textarea className={textareaClassName} {...form.register("caption")} />
          </FormField>

          <FormField label="Description">
            <textarea className={textareaClassName} {...form.register("description")} />
          </FormField>

          <div className="grid gap-5 md:grid-cols-3">
            <FormField label="Category" error={form.formState.errors.category?.message}>
              {categories.length ? (
                <select
                  className={inputClassName}
                  value={selectedCategoryId}
                  onChange={(event) => {
                    const category = categories.find((item) => item.id === event.target.value);
                    setSelectedCategoryId(category?.id || "");
                    form.setValue("categoryId", category?.id || "", { shouldDirty: true });
                    form.setValue("category", category?.name || "Experiences", { shouldDirty: true, shouldValidate: true });
                  }}
                >
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              ) : (
                <select className={inputClassName} {...form.register("category")}>
                  {fallbackCategories.map((name) => (
                    <option key={name} value={name}>
                      {name}
                    </option>
                  ))}
                </select>
              )}
            </FormField>
            <FormField label="Related tour slug">
              <input className={inputClassName} {...form.register("relatedTourSlug")} />
            </FormField>
            <FormField label="Display order">
              <input className={inputClassName} type="number" {...form.register("order", { valueAsNumber: true })} />
            </FormField>
          </div>

          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] px-4 text-sm font-medium text-[var(--color-navy)]">
            <input type="checkbox" {...form.register("active")} />
            Active in public gallery
          </label>
        </div>
      </div>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
        <button className="btn-secondary" type="button" onClick={() => router.push("/admin/gallery")}>
          Cancel
        </button>
        <button className="btn-primary" disabled={saving || uploading} type="submit">
          {saving ? "Saving..." : mode === "create" ? "Save Image" : "Update Image"}
        </button>
      </div>
    </form>
  );
}
