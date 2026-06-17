"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { safeImageSrc } from "@/lib/images";

export type AdminGalleryCard = {
  id: string;
  url: string;
  alt: string;
  title: string | null;
  caption: string | null;
  category: string | null;
  order: number;
  active: boolean;
  createdAt: string;
};

type SortValue = "order" | "newest" | "oldest";

function PencilIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m4 20 4.7-1 10.2-10.2a2.1 2.1 0 0 0 0-3l-.7-.7a2.1 2.1 0 0 0-3 0L5 15.3 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.5 6.8 3.7 3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m6 7 1 13h10l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function matchesSearch(image: AdminGalleryCard, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;
  return [image.title, image.alt, image.caption].some((field) => (field || "").toLowerCase().includes(value));
}

export function AdminGalleryGrid({
  canCreate,
  canDelete,
  canEdit,
  categories,
  images,
}: {
  canCreate: boolean;
  canDelete: boolean;
  canEdit: boolean;
  categories: string[];
  images: AdminGalleryCard[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(images);
  const [category, setCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminGalleryCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("order");

  const visibleImages = useMemo(() => {
    return items
      .filter((image) => matchesSearch(image, search))
      .filter((image) => category === "all" || (image.category || "Experiences") === category)
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        return a.order - b.order || new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [category, items, search, sort]);

  async function deleteImage() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setError(null);

    const response = await fetch(`/api/admin/gallery/${deleteTarget.id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to delete image.");
      setDeletingId(null);
      return;
    }

    setItems((current) => current.filter((image) => image.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <label className="flex-1">
          <span className="sr-only">Search gallery images</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
            placeholder="Search by title, alt text, or caption"
            type="search"
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
          <label>
            <span className="sr-only">Filter by category</span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm font-medium text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white lg:min-w-[180px]"
            >
              <option value="all">All categories</option>
              {categories.map((name) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span className="sr-only">Sort gallery images</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm font-medium text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white lg:min-w-[160px]"
            >
              <option value="order">Display order</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <section className="mt-6">
        {visibleImages.length ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
            {visibleImages.map((image) => {
              const label = image.title || image.alt;
              return (
                <article
                  key={image.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,14,30,0.12)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-[var(--color-sand)]">
                    <Link href={canEdit ? `/admin/gallery/${image.id}` : "/gallery"} className="block h-full">
                      <Image
                        src={safeImageSrc(image.url)}
                        alt={image.alt}
                        fill
                        sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 45vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <span className="absolute left-3 top-3 max-w-[70%] truncate rounded-full bg-[var(--color-navy)]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      {image.category || "Experiences"}
                    </span>
                    <span className="absolute right-3 top-3 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-navy)]">
                      #{image.order}
                    </span>
                    <div className="absolute inset-x-3 bottom-3 flex translate-y-3 justify-end gap-2 opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                      {canEdit ? (
                        <Link
                          aria-label={`Edit ${label}`}
                          href={`/admin/gallery/${image.id}`}
                          className="grid h-9 w-9 place-items-center rounded-full bg-white text-[var(--color-gold-dark)] shadow-sm transition hover:text-[var(--color-navy)]"
                        >
                          <PencilIcon />
                        </Link>
                      ) : null}
                      <button
                        aria-label={`Delete ${label}`}
                        type="button"
                        disabled={!canDelete || deletingId === image.id}
                        onClick={() => setDeleteTarget(image)}
                        className="grid h-9 w-9 place-items-center rounded-full bg-white text-red-700 shadow-sm transition hover:bg-red-700 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <TrashIcon />
                      </button>
                    </div>
                  </div>
                  <div className="p-4">
                    <Link href={canEdit ? `/admin/gallery/${image.id}` : "/gallery"} className="block">
                      <h2 className="line-clamp-2 font-serif text-lg font-semibold leading-tight text-[var(--color-navy)]">
                        {label}
                      </h2>
                      <p className="mt-2 truncate text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gray-600)]">
                        {image.active ? image.category || "Experiences" : "Inactive"}
                      </p>
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-10 text-center shadow-sm">
            <p className="font-serif text-3xl font-semibold text-[var(--color-navy)]">No gallery images found</p>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">Adjust the filters or add a new gallery image.</p>
            {canCreate ? (
              <Link className="btn-primary mt-6" href="/admin/gallery/new">
                + Add New Image
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/55 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Confirm delete</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">Delete image?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
              Are you sure you want to delete &quot;{deleteTarget.title || deleteTarget.alt}&quot;? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={deleteImage}
              >
                {deletingId === deleteTarget.id ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
