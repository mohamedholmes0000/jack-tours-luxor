"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { getTourJourneyType } from "@/lib/tour-journey-type";
import { adminTourSchema, type AdminTourValues } from "@/lib/validations";

type AdminTourFormProps = {
  mode: "create" | "edit";
  id?: string;
  initialValues?: AdminTourValues;
  contentType?: AdminTourValues["contentType"];
  returnHref?: string;
};

const emptyTour: AdminTourValues = {
  contentType: "TOUR",
  title: "",
  slug: "",
  category: "Day Tours",
  shortDescription: "",
  overview: "",
  duration: "",
  city: "",
  rating: 0,
  reviewCount: 0,
  groupSize: "Private",
  departurePoint: "",
  priceFrom: 0,
  heroImage: "",
  images: [""],
  highlights: [""],
  included: [""],
  excluded: [""],
  itinerary: [{ title: "", description: "" }],
  published: false,
  featured: false,
  metaTitle: "",
  metaDescription: "",
};

function cleanValues(values: AdminTourValues): AdminTourValues {
  return {
    ...values,
    images: values.images.filter(Boolean),
    highlights: values.highlights.filter(Boolean),
    included: values.included.filter(Boolean),
    excluded: values.excluded.filter(Boolean),
    itinerary: values.itinerary.filter((item) => item.title || item.description),
  };
}

function contentTypeLabel(contentType: AdminTourValues["contentType"]) {
  if (contentType === "ACTIVITY") return "Activity";
  if (contentType === "HOTEL") return "Hotel";
  return "Tour";
}

function listHrefForContentType(contentType: AdminTourValues["contentType"]) {
  if (contentType === "ACTIVITY") return "/admin/activities";
  if (contentType === "HOTEL") return "/admin/hotels";
  return "/admin/tours";
}

export function AdminTourForm({ mode, id, initialValues, contentType = "TOUR", returnHref }: AdminTourFormProps) {
  const router = useRouter();
  const initialContentType = initialValues?.contentType ?? contentType;
  const label = contentTypeLabel(initialContentType);
  const listingHref = returnHref ?? listHrefForContentType(initialContentType);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const {
    register,
    control,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<AdminTourValues>({
    resolver: zodResolver(adminTourSchema),
    defaultValues: initialValues ?? { ...emptyTour, contentType: initialContentType },
  });

  const itinerary = useFieldArray({ control, name: "itinerary" });
  const formValues = useWatch({ control });
  const journeyClassification = getTourJourneyType({
    title: formValues.title || "",
    category: formValues.category || "",
    duration: formValues.duration || "",
    shortDescription: formValues.shortDescription || "",
    overview: formValues.overview || "",
  });
  const journeyLabel = journeyClassification === "one-day" ? "One Day" : journeyClassification === "multi-day" ? "Multi Day" : "Custom / Unknown";
  const qualityHints = [
    !formValues.heroImage ? "Add a hero image." : null,
    !formValues.city?.trim() ? "Add a city." : null,
    !formValues.duration?.trim() ? "Add a duration." : null,
    !formValues.priceFrom ? "Add a starting price or confirm this is a custom-priced item." : null,
    !formValues.shortDescription?.trim() ? "Add a short description." : null,
    !formValues.published ? "This item is currently a draft." : null,
  ].filter((hint): hint is string => Boolean(hint));
  const [textArrays, setTextArrays] = useState({
    images: initialValues?.images?.length ? initialValues.images : emptyTour.images,
    highlights: initialValues?.highlights?.length ? initialValues.highlights : emptyTour.highlights,
    included: initialValues?.included?.length ? initialValues.included : emptyTour.included,
    excluded: initialValues?.excluded?.length ? initialValues.excluded : emptyTour.excluded,
  });

  async function onSubmit(values: AdminTourValues) {
    setIsSaving(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(mode === "create" ? "/api/admin/tours" : `/api/admin/tours/${id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cleanValues(values)),
      });
      const result = (await response.json()) as { ok: boolean; message?: string; id?: string };

      if (!response.ok || !result.ok) {
        setError(result.message ?? "Save failed. Public pages were not updated.");
        return;
      }

      setMessage("Saved successfully. Public pages updated.");
      router.refresh();

      if (mode === "create" && result.id) {
        router.push(`/admin/tours/${result.id}`);
      }
    } catch (saveError) {
      console.warn(saveError);
      setError("Save failed. Unable to reach the admin API.");
    } finally {
      setIsSaving(false);
    }
  }

  async function onDelete() {
    if (!id) {
      return;
    }

    if (!window.confirm(`Delete this ${label.toLowerCase()}? This action cannot be undone.`)) {
      return;
    }

    setIsDeleting(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(`/api/admin/tours/${id}`, { method: "DELETE" });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setError(result.message ?? "Unable to delete tour.");
        return;
      }

      router.push(listingHref);
      router.refresh();
    } catch (deleteError) {
      console.warn(deleteError);
      setError("Unable to reach the admin API.");
    } finally {
      setIsDeleting(false);
    }
  }

  function renderTextArray(label: string, name: "images" | "highlights" | "included" | "excluded", placeholder: string) {
    const currentValues = textArrays[name].length ? textArrays[name] : [""];
    const errorMessage = errors[name]?.message;

    function commit(nextValues: string[]) {
      const usableValues = nextValues.length ? nextValues : [""];
      setTextArrays((current) => ({ ...current, [name]: usableValues }));
      setValue(name, usableValues, { shouldDirty: true, shouldValidate: true });
    }

    function updateItem(index: number, value: string) {
      const nextValues = [...currentValues];
      nextValues[index] = value;
      commit(nextValues);
    }

    function addItem() {
      commit([...currentValues, ""]);
    }

    function removeItem(index: number) {
      const nextValues = currentValues.filter((_, itemIndex) => itemIndex !== index);
      commit(nextValues);
    }

    return (
      <div>
        <div className="flex items-center justify-between gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">
            {label}
          </p>
          <button className="text-sm font-bold text-[var(--color-gold)]" type="button" onClick={addItem}>
            Add
          </button>
        </div>
        {name === "images" ? (
          <p className="mt-2 text-xs leading-5 text-[var(--color-gray-600)]">
            Use a trusted image URL or a local /photos/... or /images/... path.
          </p>
        ) : null}
        <div className="mt-3 grid gap-3">
          {currentValues.map((value, index) => (
            <div key={`${name}-${index}`} className="flex gap-2">
              <input
                className={inputClassName}
                placeholder={placeholder}
                value={value}
                onChange={(event) => updateItem(index, event.target.value)}
              />
              <button className="btn-secondary px-3" type="button" onClick={() => removeItem(index)}>
                Remove
              </button>
            </div>
          ))}
        </div>
        {typeof errorMessage === "string" ? (
          <p className="mt-2 text-sm text-red-700">{errorMessage}</p>
        ) : null}
      </div>
    );
  }

return (
    <form className="space-y-8" onSubmit={handleSubmit(onSubmit)}>
      <section className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
        <div className="flex flex-col gap-2 border-b border-[var(--color-gray-100)] pb-5">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Basic</p>
          <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">Core record details</h2>
          <p className="text-sm leading-6 text-[var(--color-gray-600)]">Set the identity, content type, and publishing state for this {label.toLowerCase()}.</p>
        </div>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <FormField label="Title" error={errors.title?.message}>
            <input className={inputClassName} {...register("title")} />
          </FormField>
          <FormField label="Slug" error={errors.slug?.message}>
            <input className={inputClassName} {...register("slug")} />
          </FormField>
          <FormField label="Content type" error={errors.contentType?.message}>
            <select className={inputClassName} {...register("contentType")}>
              <option value="TOUR">Tour</option>
              <option value="ACTIVITY">Activity</option>
              <option value="HOTEL">Hotel</option>
            </select>
          </FormField>
          <FormField label="Category" error={errors.category?.message}>
            <input className={inputClassName} placeholder="Day Tours" {...register("category")} />
          </FormField>
          <FormField label="City" error={errors.city?.message}>
            <input className={inputClassName} placeholder="Luxor" {...register("city")} />
          </FormField>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4">
              <input type="checkbox" {...register("published")} />
              <span className="text-sm font-semibold text-[var(--color-gray-900)]">Published</span>
            </label>
            <label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4">
              <input type="checkbox" {...register("featured")} />
              <span className="text-sm font-semibold text-[var(--color-gray-900)]">Featured</span>
            </label>
          </div>
        </div>
        <div className="mt-6 rounded-xl border border-[rgb(214_173_84_/_35%)] bg-[var(--color-ivory)] p-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">Current Journey Classification</p>
              <p className="mt-1 font-serif text-2xl font-semibold text-[var(--color-navy)]">{journeyLabel}</p>
            </div>
            <span className="rounded-full bg-white px-3 py-1 text-xs font-bold uppercase tracking-[0.1em] text-[var(--color-navy)]">Informational only</span>
          </div>
          <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
            Classification is inferred from duration, category, title, and content. It is not stored as a separate field.
            {journeyClassification === null ? " Classification is unclear and may need content cleanup." : ""}
          </p>
        </div>
        <p className="mt-4 text-xs leading-5 text-[var(--color-gray-600)]">
          Featured is the current candidate flag for promotional or homepage use. This form does not change the current promotional carousel rules.
        </p>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Trip</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Travel essentials</h2>
          <div className="mt-6 grid gap-5">
            <FormField label="Duration" error={errors.duration?.message}>
              <input className={inputClassName} placeholder="8 Days / 7 Nights" {...register("duration")} />
            </FormField>
            <FormField label="Group size" error={errors.groupSize?.message}>
              <input className={inputClassName} placeholder="Private" {...register("groupSize")} />
            </FormField>
            <FormField label="Departure / meeting information" error={errors.departurePoint?.message}>
              <input className={inputClassName} placeholder="Hotel pickup in Luxor" {...register("departurePoint")} />
            </FormField>
          </div>
        </div>
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Pricing & reviews</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Commercial details</h2>
          <div className="mt-6 grid gap-5">
            <FormField label="Price from" error={errors.priceFrom?.message}>
              <input className={inputClassName} min="0" type="number" {...register("priceFrom", { valueAsNumber: true })} />
            </FormField>
            <p className="-mt-2 text-xs leading-5 text-[var(--color-gray-600)]">Currency follows the current saved/API configuration and is not editable here.</p>
            <div className="grid gap-5 sm:grid-cols-2">
              <FormField label="Rating" error={errors.rating?.message}>
                <input className={inputClassName} max="5" min="0" step="0.1" type="number" {...register("rating", { valueAsNumber: true })} />
              </FormField>
              <FormField label="Review count" error={errors.reviewCount?.message}>
                <input className={inputClassName} min="0" type="number" {...register("reviewCount", { valueAsNumber: true })} />
              </FormField>
            </div>
          </div>
        </div>
      </section>

      <section className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Content</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Tell the journey story</h2>
        <div className="mt-6 grid gap-5">
          <FormField label="Short description" error={errors.shortDescription?.message}>
            <textarea className={textareaClassName} {...register("shortDescription")} />
          </FormField>
          <FormField label="Overview" error={errors.overview?.message}>
            <textarea className={textareaClassName} {...register("overview")} />
          </FormField>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Media</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Hero image</h2>
          <div className="mt-6">
            <FormField label="Hero image URL" error={errors.heroImage?.message}>
              <input className={inputClassName} {...register("heroImage")} />
            </FormField>
            <p className="mt-2 text-xs leading-5 text-[var(--color-gray-600)]">Use a trusted image URL or a local /photos/... or /images/... path.</p>
          </div>
        </div>
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Media</p>
          <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Gallery images</h2>
          <div className="mt-6">{renderTextArray("Gallery image URLs", "images", "https://images.unsplash.com/... or /photos/karnak.jpg")}</div>
        </div>
      </section>

      <section className="grid gap-6 lg:grid-cols-3">
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">{renderTextArray("Highlights", "highlights", "Private guide")}</div>
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">{renderTextArray("Included", "included", "Pickup and drop-off")}</div>
        <div className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">{renderTextArray("Excluded", "excluded", "Entrance fees")}</div>
      </section>

      <section className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">Itinerary</p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Journey schedule</h2>
          </div>
          <button className="text-sm font-bold text-[var(--color-gold)]" type="button" onClick={() => itinerary.append({ title: "", description: "" })}>
            Add item
          </button>
        </div>
        <div className="mt-5 grid gap-5">
          {itinerary.fields.map((field, index) => (
            <div key={field.id} className="grid gap-3 border border-[var(--color-gray-100)] p-4">
              <input className={inputClassName} placeholder="Day or item title" {...register(`itinerary.${index}.title`)} />
              <textarea className={textareaClassName} placeholder="Description" {...register(`itinerary.${index}.description`)} />
              <button className="btn-secondary justify-self-start" type="button" onClick={() => itinerary.remove(index)}>
                Remove item
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:p-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">SEO</p>
        <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">Search preview details</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <FormField label="Meta title" error={errors.metaTitle?.message}>
            <input className={inputClassName} {...register("metaTitle")} />
          </FormField>
          <FormField label="Meta description" error={errors.metaDescription?.message}>
            <input className={inputClassName} {...register("metaDescription")} />
          </FormField>
        </div>
      </section>

      {qualityHints.length ? (
        <aside className="border border-amber-200 bg-amber-50 p-5 text-sm text-amber-950">
          <p className="font-bold uppercase tracking-[0.12em]">Data quality hints</p>
          <ul className="mt-3 list-disc space-y-1 pl-5 leading-6">
            {qualityHints.map((hint) => <li key={hint}>{hint}</li>)}
          </ul>
        </aside>
      ) : null}
      {message ? <p className="bg-green-50 p-4 text-sm text-green-800">{message}</p> : null}
      {error ? <p className="bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-between">
        {mode === "edit" ? (
          <button className="btn-secondary" type="button" onClick={onDelete} disabled={isDeleting}>
            {isDeleting ? "Deleting..." : `Delete ${label}`}
          </button>
        ) : <span />}
        <button className="btn-primary" type="submit" disabled={isSaving}>
          {isSaving ? "Saving..." : `Save ${label}`}
        </button>
      </div>
    </form>
  );
}
