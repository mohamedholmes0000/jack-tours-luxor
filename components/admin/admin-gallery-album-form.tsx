"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { safeImageSrc } from "@/lib/images";
import { adminGalleryAlbumSchema, type AdminGalleryAlbumValues } from "@/lib/validations";

export type GalleryCategoryOption = {
  id: string;
  name: string;
};

export type AdminGalleryAlbumImage = {
  id: string;
  active: boolean;
  alt: string;
  caption: string | null;
  description: string | null;
  order: number;
  publicId: string | null;
  title: string | null;
  url: string;
};

type AdminGalleryAlbumFormProps = {
  categories: GalleryCategoryOption[];
  id?: string;
  images?: AdminGalleryAlbumImage[];
  initialValues?: AdminGalleryAlbumValues;
  mode: "create" | "edit";
};

type UploadResult = {
  ok?: boolean;
  message?: string;
  publicId?: string;
  url?: string;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminGalleryAlbumForm({
  categories,
  id,
  images = [],
  initialValues,
  mode,
}: AdminGalleryAlbumFormProps) {
  const router = useRouter();
  const coverInputRef = useRef<HTMLInputElement | null>(null);
  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const [albumImages, setAlbumImages] = useState(images);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [savingImages, setSavingImages] = useState(false);

  const form = useForm<AdminGalleryAlbumValues>({
    resolver: zodResolver(adminGalleryAlbumSchema),
    defaultValues: initialValues ?? {
      active: true,
      categoryId: categories[0]?.id ?? "",
      coverImage: "/photos/karnak.jpg",
      coverImagePublicId: "",
      description: "",
      displayOrder: 0,
      slug: "",
      title: "",
    },
  });

  const title = useWatch({ control: form.control, name: "title" }) ?? "";
  const slug = useWatch({ control: form.control, name: "slug" }) ?? "";
  const coverImage = useWatch({ control: form.control, name: "coverImage" }) ?? "";

  function setSuccess(value: string) {
    setMessage(value);
    setError(null);
  }

  async function uploadFile(file: File, albumSlug: string) {
    const payload = new FormData();
    payload.append("file", file);
    payload.append("albumSlug", albumSlug || "gallery");

    const response = await fetch("/api/admin/uploads/gallery", {
      method: "POST",
      body: payload,
    });
    const result = (await response.json().catch(() => null)) as UploadResult | null;
    if (!response.ok || !result?.ok || !result.url) {
      throw new Error(result?.message || "Unable to upload image.");
    }
    return result;
  }

  async function uploadCover(file: File) {
    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const uploaded = await uploadFile(file, slug || slugify(title) || "gallery");
      form.setValue("coverImage", uploaded.url || "", { shouldDirty: true, shouldValidate: true });
      form.setValue("coverImagePublicId", uploaded.publicId || "", { shouldDirty: true });
      setSuccess("Cover uploaded. Save album details to publish the change.");
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload cover image.");
    } finally {
      setUploading(false);
    }
  }

  async function submit(values: AdminGalleryAlbumValues) {
    setSaving(true);
    setError(null);
    setMessage(null);

    try {
      const payload = {
        ...values,
        categoryId: values.categoryId || "",
        coverImagePublicId: values.coverImagePublicId || "",
        description: values.description || "",
        slug: values.slug || slugify(values.title),
      };
      const response = await fetch(mode === "create" ? "/api/admin/gallery" : `/api/admin/gallery/${id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; id?: string; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.message || "Unable to save album.");
        return;
      }

      setSuccess("Album saved. Public gallery updated.");
      router.refresh();
      if (mode === "create" && result.id) {
        router.push(`/admin/gallery/${result.id}`);
      }
    } finally {
      setSaving(false);
    }
  }

  async function uploadPhotos(files: FileList | null) {
    if (!id || !files?.length) return;
    setUploading(true);
    setError(null);
    setMessage(null);

    try {
      const uploaded = await Promise.all(
        Array.from(files).map((file) => uploadFile(file, slug || slugify(title) || "gallery")),
      );
      const startOrder = albumImages.length;
      const payloadImages = uploaded.map((image, index) => ({
        active: true,
        alt: `${title || "Gallery"} photo ${startOrder + index + 1}`,
        caption: "",
        description: "",
        order: startOrder + index,
        publicId: image.publicId || "",
        title: "",
        url: image.url || "",
      }));
      const response = await fetch(`/api/admin/gallery/${id}/images`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ images: payloadImages }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; ids?: string[]; message?: string } | null;
      if (!response.ok || !result?.ok) {
        setError(result?.message || "Unable to add photos.");
        return;
      }

      setAlbumImages((current) => [
        ...current,
        ...payloadImages.map((image, index) => ({
          ...image,
          caption: null,
          description: null,
          id: result.ids?.[index] || `${Date.now()}-${index}`,
          publicId: image.publicId || null,
          title: image.title || null,
        })),
      ]);
      setSuccess(`${payloadImages.length} ${payloadImages.length === 1 ? "photo" : "photos"} added.`);
      router.refresh();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Unable to upload photos.");
    } finally {
      setUploading(false);
    }
  }

  async function saveImages() {
    if (!id) return;
    setSavingImages(true);
    setError(null);
    setMessage(null);

    const response = await fetch(`/api/admin/gallery/${id}/images`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        images: albumImages.map((image, index) => ({
          active: image.active,
          alt: image.alt,
          caption: image.caption || "",
          description: image.description || "",
          id: image.id,
          order: index,
          publicId: image.publicId || "",
          title: image.title || "",
          url: image.url,
        })),
      }),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    setSavingImages(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to save photo changes.");
      return;
    }

    setSuccess("Photos saved. Public album updated.");
    router.refresh();
  }

  async function deleteImage(imageId: string) {
    if (!id || !window.confirm("Delete this photo from the album?")) return;

    const response = await fetch(`/api/admin/gallery/${id}/images/${imageId}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to delete photo.");
      return;
    }

    setAlbumImages((current) => current.filter((image) => image.id !== imageId).map((image, index) => ({ ...image, order: index })));
    setSuccess("Photo deleted.");
    router.refresh();
  }

  function updateImage(imageId: string, update: Partial<AdminGalleryAlbumImage>) {
    setAlbumImages((current) => current.map((image) => (image.id === imageId ? { ...image, ...update } : image)));
  }

  function moveImage(imageId: string, direction: -1 | 1) {
    setAlbumImages((current) => {
      const index = current.findIndex((image) => image.id === imageId);
      const nextIndex = index + direction;
      if (index < 0 || nextIndex < 0 || nextIndex >= current.length) return current;
      const copy = [...current];
      [copy[index], copy[nextIndex]] = [copy[nextIndex], copy[index]];
      return copy.map((image, order) => ({ ...image, order }));
    });
  }

  return (
    <div className="space-y-8">
      <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
        <div className="grid gap-6 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm lg:grid-cols-[minmax(280px,420px)_1fr]">
          <div>
            <button
              type="button"
              onClick={() => coverInputRef.current?.click()}
              className="relative grid aspect-[16/11] w-full place-items-center overflow-hidden rounded-xl border border-dashed border-[rgb(214_173_84_/_45%)] bg-[var(--color-ivory)] text-center transition hover:border-[var(--color-gold)]"
            >
              <Image src={safeImageSrc(coverImage)} alt="Album cover preview" fill sizes="420px" className="object-cover" />
              {uploading ? (
                <span className="absolute inset-0 grid place-items-center bg-[var(--color-navy)]/70 text-sm font-bold uppercase tracking-[0.12em] text-white">
                  Uploading...
                </span>
              ) : null}
            </button>
            <input
              ref={coverInputRef}
              className="sr-only"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) void uploadCover(file);
                event.target.value = "";
              }}
            />
            <input type="hidden" {...form.register("coverImage")} />
            <input type="hidden" {...form.register("coverImagePublicId")} />
            {form.formState.errors.coverImage?.message ? (
              <p className="mt-2 text-sm text-red-700">{form.formState.errors.coverImage.message}</p>
            ) : null}
          </div>

          <div className="grid gap-5">
            <div className="grid gap-5 md:grid-cols-2">
              <FormField label="Album title" error={form.formState.errors.title?.message}>
                <input
                  className={inputClassName}
                  required
                  {...form.register("title", {
                    onChange: (event) => {
                      if (mode === "create") form.setValue("slug", slugify(event.target.value), { shouldDirty: true });
                    },
                  })}
                />
              </FormField>
              <FormField label="Slug" error={form.formState.errors.slug?.message}>
                <input className={inputClassName} required {...form.register("slug")} />
              </FormField>
            </div>
            <FormField label="Description">
              <textarea className={textareaClassName} rows={5} {...form.register("description")} />
            </FormField>
            <div className="grid gap-5 md:grid-cols-3">
              <FormField label="Category">
                <select className={inputClassName} {...form.register("categoryId")}>
                  <option value="">Uncategorized</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </FormField>
              <FormField label="Display order">
                <input className={inputClassName} type="number" {...form.register("displayOrder", { valueAsNumber: true })} />
              </FormField>
              <label className="mt-7 flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] px-4 text-sm font-medium text-[var(--color-navy)]">
                <input type="checkbox" {...form.register("active")} />
                Active
              </label>
            </div>
          </div>
        </div>

        {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">{message}</p> : null}
        {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

        <div className="flex flex-col-reverse justify-between gap-3 sm:flex-row">
          <button className="btn-secondary" type="button" onClick={() => router.push("/admin/gallery")}>
            Cancel
          </button>
          <button className="btn-primary" disabled={saving || uploading} type="submit">
            {saving ? "Saving..." : mode === "create" ? "Save Album" : "Update Album"}
          </button>
        </div>
      </form>

      {mode === "edit" && id ? (
        <section className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">Album photos</p>
              <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">
                {albumImages.length} {albumImages.length === 1 ? "photo" : "photos"}
              </h2>
            </div>
            <div className="flex flex-wrap gap-3">
              <button className="btn-secondary" type="button" onClick={() => photoInputRef.current?.click()} disabled={uploading}>
                + Add Photos
              </button>
              <button className="btn-primary" type="button" onClick={saveImages} disabled={savingImages || uploading}>
                {savingImages ? "Saving..." : "Save Photos"}
              </button>
            </div>
          </div>
          <input
            ref={photoInputRef}
            className="sr-only"
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            onChange={(event) => {
              void uploadPhotos(event.target.files);
              event.target.value = "";
            }}
          />

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {albumImages.map((image, index) => (
              <article key={image.id} className="overflow-hidden rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)]">
                <div className="relative aspect-[4/3]">
                  <Image src={safeImageSrc(image.url)} alt={image.alt || "Gallery photo"} fill sizes="320px" className="object-cover" />
                </div>
                <div className="grid gap-3 p-4">
                  <input
                    className={inputClassName}
                    value={image.alt}
                    placeholder="Alt text"
                    onChange={(event) => updateImage(image.id, { alt: event.target.value })}
                  />
                  <input
                    className={inputClassName}
                    value={image.caption || ""}
                    placeholder="Caption"
                    onChange={(event) => updateImage(image.id, { caption: event.target.value })}
                  />
                  <div className="flex flex-wrap gap-2">
                    <button className="btn-secondary px-3 py-2 text-[11px]" type="button" onClick={() => moveImage(image.id, -1)} disabled={index === 0}>
                      Up
                    </button>
                    <button className="btn-secondary px-3 py-2 text-[11px]" type="button" onClick={() => moveImage(image.id, 1)} disabled={index === albumImages.length - 1}>
                      Down
                    </button>
                    <button
                      className="btn-secondary px-3 py-2 text-[11px]"
                      type="button"
                      onClick={() => {
                        form.setValue("coverImage", image.url, { shouldDirty: true, shouldValidate: true });
                        form.setValue("coverImagePublicId", image.publicId || "", { shouldDirty: true });
                        setSuccess("Cover selected. Save album details to publish the change.");
                      }}
                    >
                      Set cover
                    </button>
                    <button className="rounded-md border border-red-600 px-3 py-2 text-[11px] font-bold uppercase tracking-[0.08em] text-red-700 transition hover:bg-red-600 hover:text-white" type="button" onClick={() => void deleteImage(image.id)}>
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
