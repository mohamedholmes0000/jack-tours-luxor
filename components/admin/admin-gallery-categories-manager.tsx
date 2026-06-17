"use client";

import { useRouter } from "next/navigation";
import type { FormEvent } from "react";
import { useState } from "react";

export type AdminGalleryCategoryRow = {
  id: string;
  name: string;
  slug: string;
  order: number;
  active: boolean;
  imageCount: number;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function AdminGalleryCategoriesManager({
  canDelete,
  canEdit,
  categories,
}: {
  canDelete: boolean;
  canEdit: boolean;
  categories: AdminGalleryCategoryRow[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(categories);
  const [editing, setEditing] = useState<AdminGalleryCategoryRow | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [order, setOrder] = useState(0);
  const [active, setActive] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function resetForm() {
    setEditing(null);
    setName("");
    setSlug("");
    setOrder(0);
    setActive(true);
  }

  function startEdit(category: AdminGalleryCategoryRow) {
    setEditing(category);
    setName(category.name);
    setSlug(category.slug);
    setOrder(category.order);
    setActive(category.active);
  }

  async function saveCategory(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    const payload = { active, name, order, slug: slug || slugify(name) };
    const response = await fetch(editing ? `/api/admin/gallery/categories/${editing.id}` : "/api/admin/gallery/categories", {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; id?: string; message?: string } | null;
    setLoading(false);

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to save category.");
      return;
    }

    setMessage("Category saved.");
    if (editing) {
      setItems((current) =>
        current.map((item) => (item.id === editing.id ? { ...item, ...payload, slug: payload.slug } : item)),
      );
    } else {
      setItems((current) => [
        ...current,
        {
          active: payload.active,
          id: result.id || payload.slug,
          imageCount: 0,
          name: payload.name,
          order: payload.order,
          slug: payload.slug,
        },
      ]);
    }
    resetForm();
    router.refresh();
  }

  async function deleteCategory(category: AdminGalleryCategoryRow) {
    if (!window.confirm(`Delete "${category.name}"? This cannot be undone.`)) return;
    setError(null);
    setMessage(null);
    const response = await fetch(`/api/admin/gallery/categories/${category.id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to delete category.");
      return;
    }

    setItems((current) => current.filter((item) => item.id !== category.id));
    setMessage("Category deleted.");
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(280px,420px)_1fr]">
      <form className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm" onSubmit={saveCategory}>
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          {editing ? "Edit category" : "New category"}
        </p>
        <div className="mt-5 grid gap-4">
          <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
            Name
            <input
              className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
              disabled={!canEdit}
              required
              value={name}
              onChange={(event) => {
                setName(event.target.value);
                if (!editing) setSlug(slugify(event.target.value));
              }}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
            Slug
            <input
              className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
              disabled={!canEdit}
              required
              value={slug}
              onChange={(event) => setSlug(slugify(event.target.value))}
            />
          </label>
          <label className="grid gap-2 text-sm font-medium text-[var(--color-navy)]">
            Order
            <input
              className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
              disabled={!canEdit}
              min={0}
              type="number"
              value={order}
              onChange={(event) => setOrder(Number(event.target.value))}
            />
          </label>
          <label className="flex min-h-12 items-center gap-3 rounded-xl border border-[var(--color-gray-100)] px-4 text-sm font-medium text-[var(--color-navy)]">
            <input disabled={!canEdit} type="checkbox" checked={active} onChange={(event) => setActive(event.target.checked)} />
            Active
          </label>
        </div>
        {message ? <p className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-800">{message}</p> : null}
        {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-800">{error}</p> : null}
        <div className="mt-5 flex justify-between gap-3">
          <button className="btn-secondary" type="button" onClick={resetForm}>
            Reset
          </button>
          <button className="btn-primary" disabled={!canEdit || loading} type="submit">
            {loading ? "Saving..." : "Save Category"}
          </button>
        </div>
      </form>

      <div className="grid gap-3">
        {items.map((category) => (
          <article
            key={category.id}
            className="flex flex-col gap-4 rounded-xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:flex-row md:items-center md:justify-between"
          >
            <div>
              <p className="font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">{category.name}</p>
              <p className="mt-1 text-sm text-[var(--color-gray-600)]">
                /{category.slug} · {category.imageCount} {category.imageCount === 1 ? "image" : "images"} · order #{category.order}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                className="rounded-md border border-[var(--color-gold)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!canEdit}
                type="button"
                onClick={() => startEdit(category)}
              >
                Edit
              </button>
              <button
                className="rounded-md border border-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                disabled={!canDelete || category.imageCount > 0}
                type="button"
                onClick={() => void deleteCategory(category)}
              >
                Delete
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
