"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import {
  adminBlogPostSchema,
  adminDestinationSchema,
  adminFaqSchema,
  adminGalleryImageSchema,
  adminSettingsSchema,
  type AdminBlogPostValues,
  type AdminDestinationValues,
  type AdminFaqValues,
  type AdminGalleryImageValues,
  type AdminSettingsValues,
} from "@/lib/validations";

function useApiState() {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  return { message, setMessage, error, setError, loading, setLoading };
}

function Result({ message, error }: { message: string | null; error: string | null }) {
  return (
    <>
      {message ? <p className="bg-green-50 p-4 text-sm text-green-800">{message}</p> : null}
      {error ? <p className="bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
    </>
  );
}

export function BlogPostForm({
  mode,
  id,
  initialValues,
}: {
  mode: "create" | "edit";
  id?: string;
  initialValues?: AdminBlogPostValues;
}) {
  const router = useRouter();
  const state = useApiState();
  const [tagsText, setTagsText] = useState(initialValues?.tags?.join(", ") ?? "");
  const form = useForm<AdminBlogPostValues>({
    resolver: zodResolver(adminBlogPostSchema),
    defaultValues: initialValues ?? {
      title: "",
      slug: "",
      excerpt: "",
      contentText: "",
      category: "Travel Guide",
      tags: [],
      heroImage: "",
      published: false,
      metaTitle: "",
      metaDescription: "",
    },
  });

  async function submit(values: AdminBlogPostValues) {
    state.setLoading(true);
    state.setMessage(null);
    state.setError(null);
    const payload = { ...values, tags: tagsText.split(",").map((tag) => tag.trim()).filter(Boolean) };
    try {
      const response = await fetch(mode === "create" ? "/api/admin/blog" : `/api/admin/blog/${id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as { ok: boolean; message?: string; id?: string };
      if (!response.ok || !result.ok) {
        state.setError(result.message ?? "Unable to save blog post.");
        return;
      }
      state.setMessage("Blog post saved.");
      router.refresh();
      if (mode === "create" && result.id) router.push(`/admin/blog/${result.id}`);
    } finally {
      state.setLoading(false);
    }
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm("Delete this blog post? This action cannot be undone.")) return;
    state.setLoading(true);
    const response = await fetch(`/api/admin/blog/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { ok: boolean; message?: string };
    state.setLoading(false);
    if (!response.ok || !result.ok) {
      state.setError(result.message ?? "Unable to delete blog post.");
      return;
    }
    router.push("/admin/blog");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <div className="grid gap-5 border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:grid-cols-2">
        <FormField label="Title" error={form.formState.errors.title?.message}><input className={inputClassName} {...form.register("title")} /></FormField>
        <FormField label="Slug" error={form.formState.errors.slug?.message}><input className={inputClassName} {...form.register("slug")} /></FormField>
        <FormField label="Category" error={form.formState.errors.category?.message}><input className={inputClassName} {...form.register("category")} /></FormField>
        <FormField label="Tags"><input className={inputClassName} value={tagsText} onChange={(event) => setTagsText(event.target.value)} placeholder="Luxor, Planning" /></FormField>
        <div className="md:col-span-2"><FormField label="Excerpt" error={form.formState.errors.excerpt?.message}><textarea className={textareaClassName} {...form.register("excerpt")} /></FormField></div>
        <div className="md:col-span-2"><FormField label="Content" error={form.formState.errors.contentText?.message}><textarea className="min-h-72 w-full border border-[var(--color-gray-100)] bg-white px-4 py-3 text-base outline-none focus:border-[var(--color-gold)]" {...form.register("contentText")} /></FormField></div>
        <FormField label="Hero image URL" error={form.formState.errors.heroImage?.message}><input className={inputClassName} {...form.register("heroImage")} /></FormField>
        <label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4"><input type="checkbox" {...form.register("published")} /> Published</label>
        <FormField label="Meta title"><input className={inputClassName} {...form.register("metaTitle")} /></FormField>
        <FormField label="Meta description"><input className={inputClassName} {...form.register("metaDescription")} /></FormField>
      </div>
      <Result message={state.message} error={state.error} />
      <div className="flex justify-between gap-3">
        {mode === "edit" ? <button className="btn-secondary" type="button" onClick={remove}>Delete</button> : <span />}
        <button className="btn-primary" disabled={state.loading} type="submit">{state.loading ? "Saving..." : "Save"}</button>
      </div>
    </form>
  );
}

export function FaqForm({ initialValues, id }: { initialValues?: AdminFaqValues; id?: string }) {
  const router = useRouter();
  const state = useApiState();
  const form = useForm<AdminFaqValues>({
    resolver: zodResolver(adminFaqSchema),
    defaultValues: initialValues ?? { question: "", answer: "", category: "Booking", order: 0, active: true },
  });

  async function submit(values: AdminFaqValues) {
    state.setLoading(true);
    state.setError(null);
    const response = await fetch(id ? `/api/admin/faqs/${id}` : "/api/admin/faqs", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    state.setLoading(false);
    if (!response.ok || !result.ok) state.setError(result.message ?? "Unable to save FAQ.");
    else {
      state.setMessage("FAQ saved.");
      router.refresh();
    }
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm("Delete this FAQ? This action cannot be undone.")) return;
    const response = await fetch(`/api/admin/faqs/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !result.ok) state.setError(result.message ?? "Unable to delete FAQ.");
    else router.refresh();
  }

  return (
    <form className="grid gap-4 border border-[var(--color-gray-100)] bg-white p-5" onSubmit={form.handleSubmit(submit)}>
      <FormField label="Question" error={form.formState.errors.question?.message}><input className={inputClassName} {...form.register("question")} /></FormField>
      <FormField label="Answer" error={form.formState.errors.answer?.message}><textarea className={textareaClassName} {...form.register("answer")} /></FormField>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Category"><input className={inputClassName} {...form.register("category")} /></FormField>
        <FormField label="Order"><input className={inputClassName} type="number" {...form.register("order", { valueAsNumber: true })} /></FormField>
        <label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4"><input type="checkbox" {...form.register("active")} /> Active</label>
      </div>
      <Result message={state.message} error={state.error} />
      <div className="flex justify-between"><button className="btn-secondary" type="button" onClick={remove} disabled={!id}>Delete</button><button className="btn-primary" disabled={state.loading}>Save FAQ</button></div>
    </form>
  );
}

export function GalleryImageForm({ initialValues, id }: { initialValues?: AdminGalleryImageValues; id?: string }) {
  const router = useRouter();
  const state = useApiState();
  const form = useForm<AdminGalleryImageValues>({
    resolver: zodResolver(adminGalleryImageSchema),
    defaultValues: initialValues ?? { url: "", alt: "", category: "Luxor", relatedTourSlug: "", order: 0 },
  });

  async function submit(values: AdminGalleryImageValues) {
    state.setLoading(true);
    const response = await fetch(id ? `/api/admin/gallery/${id}` : "/api/admin/gallery", {
      method: id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    state.setLoading(false);
    if (!response.ok || !result.ok) state.setError(result.message ?? "Unable to save image.");
    else {
      state.setMessage("Image saved.");
      router.refresh();
    }
  }

  async function remove() {
    if (!id) return;
    if (!window.confirm("Delete this gallery image? This action cannot be undone.")) return;
    const response = await fetch(`/api/admin/gallery/${id}`, { method: "DELETE" });
    const result = (await response.json()) as { ok: boolean; message?: string };
    if (!response.ok || !result.ok) state.setError(result.message ?? "Unable to delete image.");
    else router.refresh();
  }

  return (
    <form className="grid gap-4 border border-[var(--color-gray-100)] bg-white p-5" onSubmit={form.handleSubmit(submit)}>
      <FormField label="Image URL" error={form.formState.errors.url?.message}><input className={inputClassName} {...form.register("url")} /></FormField>
      <FormField label="Alt text" error={form.formState.errors.alt?.message}><input className={inputClassName} {...form.register("alt")} /></FormField>
      <div className="grid gap-4 md:grid-cols-3">
        <FormField label="Category"><input className={inputClassName} {...form.register("category")} /></FormField>
        <FormField label="Related tour slug"><input className={inputClassName} {...form.register("relatedTourSlug")} /></FormField>
        <FormField label="Order"><input className={inputClassName} type="number" {...form.register("order", { valueAsNumber: true })} /></FormField>
      </div>
      <Result message={state.message} error={state.error} />
      <div className="flex justify-between"><button className="btn-secondary" type="button" onClick={remove} disabled={!id}>Delete</button><button className="btn-primary" disabled={state.loading}>Save Image</button></div>
    </form>
  );
}

export function DestinationForm({ initialValues, id }: { initialValues: AdminDestinationValues; id: string }) {
  const router = useRouter();
  const state = useApiState();
  const [highlightsText, setHighlightsText] = useState(initialValues.highlights.join("\n"));
  const form = useForm<AdminDestinationValues>({
    resolver: zodResolver(adminDestinationSchema),
    defaultValues: initialValues,
  });

  async function submit(values: AdminDestinationValues) {
    state.setLoading(true);
    state.setMessage(null);
    state.setError(null);
    const payload = {
      ...values,
      highlights: highlightsText
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    const response = await fetch(`/api/admin/destinations/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json()) as { ok: boolean; message?: string };
    state.setLoading(false);

    if (!response.ok || !result.ok) {
      state.setError(result.message ?? "Unable to save destination.");
      return;
    }

    state.setMessage("Destination saved. Public pages updated.");
    router.refresh();
  }

  return (
    <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
      <div className="grid gap-5 border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:grid-cols-2">
        <FormField label="Name" error={form.formState.errors.name?.message}>
          <input className={inputClassName} {...form.register("name")} />
        </FormField>
        <FormField label="Slug" error={form.formState.errors.slug?.message}>
          <input className={inputClassName} {...form.register("slug")} />
        </FormField>
        <FormField label="Subtitle" error={form.formState.errors.subtitle?.message}>
          <input className={inputClassName} {...form.register("subtitle")} />
        </FormField>
        <FormField label="Region" error={form.formState.errors.region?.message}>
          <select className={inputClassName} {...form.register("region")}>
            <option value="Upper Egypt">Upper Egypt</option>
            <option value="Lower Egypt">Lower Egypt</option>
            <option value="Red Sea Coast">Red Sea Coast</option>
          </select>
        </FormField>
        <FormField label="Type" error={form.formState.errors.type?.message}>
          <select className={inputClassName} {...form.register("type")}>
            <option value="CITY">City</option>
            <option value="SITE">Archaeological Site</option>
            <option value="COASTAL">Coastal / Beach</option>
            <option value="RIVER_ROUTE">River / Cruise Route</option>
          </select>
        </FormField>
        <FormField label="Hero image URL" error={form.formState.errors.heroImage?.message}>
          <input className={inputClassName} {...form.register("heroImage")} />
        </FormField>
        <div className="md:col-span-2">
          <FormField label="Overview" error={form.formState.errors.overview?.message}>
            <textarea className={textareaClassName} {...form.register("overview")} />
          </FormField>
        </div>
        <div className="md:col-span-2">
          <FormField label="Highlights">
            <textarea
              className={textareaClassName}
              value={highlightsText}
              onChange={(event) => setHighlightsText(event.target.value)}
              placeholder="One highlight per line"
            />
          </FormField>
        </div>
        <label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4">
          <input type="checkbox" {...form.register("published")} /> Published
        </label>
        <FormField label="Meta title">
          <input className={inputClassName} {...form.register("metaTitle")} />
        </FormField>
        <FormField label="Meta description">
          <input className={inputClassName} {...form.register("metaDescription")} />
        </FormField>
      </div>
      <Result message={state.message} error={state.error} />
      <div className="flex justify-end">
        <button className="btn-primary" disabled={state.loading} type="submit">
          {state.loading ? "Saving..." : "Save Destination"}
        </button>
      </div>
    </form>
  );
}

export function SettingsForm({ initialValues }: { initialValues: AdminSettingsValues }) {
  const state = useApiState();
  const form = useForm<AdminSettingsValues>({ resolver: zodResolver(adminSettingsSchema), defaultValues: initialValues });
  async function submit(values: AdminSettingsValues) {
    state.setLoading(true);
    const response = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
    const result = (await response.json()) as { ok: boolean; message?: string };
    state.setLoading(false);
    if (!response.ok || !result.ok) state.setError(result.message ?? "Unable to save settings.");
    else state.setMessage("Settings saved.");
  }
  const fields: Array<[keyof AdminSettingsValues, string]> = [
    ["companyName", "Company name"], ["phone", "Phone"], ["whatsappNumber", "WhatsApp number"], ["email", "Email"], ["address", "Address"],
    ["facebookUrl", "Facebook URL"], ["instagramUrl", "Instagram URL"], ["tripAdvisorUrl", "TripAdvisor URL"], ["defaultSeoTitle", "Default SEO title"], ["defaultSeoDescription", "Default SEO description"],
    ["homepageHeroEyebrow", "Homepage hero eyebrow"], ["homepageHeroHeadline", "Homepage hero headline"], ["homepageHeroHeadlineAccent", "Homepage hero accent"], ["homepageHeroSubheadline", "Homepage hero subheadline"],
    ["homepageHeroPrimaryCtaLabel", "Homepage hero CTA label"], ["homepageHeroPrimaryCtaHref", "Homepage hero CTA href"], ["homepageHeroImage", "Homepage hero image"],
    ["homepageTrustItem1", "Homepage trust item 1"], ["homepageTrustItem2", "Homepage trust item 2"], ["homepageTrustItem3", "Homepage trust item 3"],
  ];
  return (
    <form className="grid gap-4 border border-[var(--color-gray-100)] bg-white p-5 md:grid-cols-2" onSubmit={form.handleSubmit(submit)}>
      {fields.map(([name, label]) => <FormField key={name} label={label}><input className={inputClassName} {...form.register(name)} /></FormField>)}
      <div className="md:col-span-2"><Result message={state.message} error={state.error} /></div>
      <button className="btn-primary md:col-span-2" disabled={state.loading}>Save Settings</button>
    </form>
  );
}
