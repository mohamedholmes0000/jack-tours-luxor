"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { safeImageSrc } from "@/lib/images";

export type AdminToursGridTour = {
  id: string;
  contentType: "TOUR" | "ACTIVITY" | "HOTEL";
  slug: string;
  title: string;
  category: string;
  shortDescription: string;
  duration: string;
  city: string;
  rating: number;
  reviewCount: number;
  groupSize: string;
  priceFrom: number | null;
  priceCurrency: string;
  heroImage: string | null;
  published: boolean;
  featured: boolean;
  createdAt: string;
};

type SortValue = "newest" | "oldest" | "price-high" | "price-low";
type StatusValue = "all" | "published" | "draft";

function PencilIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m4 20 4.7-1 10.2-10.2a2.1 2.1 0 0 0 0-3l-.7-.7a2.1 2.1 0 0 0-3 0L5 15.3 4 20Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="m13.5 6.8 3.7 3.7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function EyeIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M2.5 12s3.4-6 9.5-6 9.5 6 9.5 6-3.4 6-9.5 6-9.5-6-9.5-6Z" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function TrashIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M9 7V5.5A1.5 1.5 0 0 1 10.5 4h3A1.5 1.5 0 0 1 15 5.5V7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="m6 7 1 13h10l1-13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 11v5M14 11v5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function formatPrice(tour: AdminToursGridTour) {
  if (!tour.priceFrom) return "Custom";
  return `${tour.priceCurrency} ${tour.priceFrom.toLocaleString("en-US")}`;
}

function matchesSearch(tour: AdminToursGridTour, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;
  return [tour.title, tour.slug, tour.shortDescription].some((field) => field.toLowerCase().includes(value));
}

function publicHrefForContent(tour: AdminToursGridTour) {
  if (tour.contentType === "ACTIVITY") return `/activities/${tour.slug}`;
  if (tour.contentType === "HOTEL") return `/hotels/${tour.slug}`;
  return `/tours/${tour.slug}`;
}

export function AdminToursGrid({
  tours,
  canCreate,
  canDelete,
  canEdit,
  createHref = "/admin/tours/new",
  emptyTitle = "No tours found",
  singularLabel = "tour",
}: {
  tours: AdminToursGridTour[];
  canCreate: boolean;
  canDelete: boolean;
  canEdit: boolean;
  createHref?: string;
  emptyTitle?: string;
  singularLabel?: string;
}) {
  const router = useRouter();
  const [items, setItems] = useState(tours);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusValue>("all");
  const [sort, setSort] = useState<SortValue>("newest");
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminToursGridTour | null>(null);

  const filteredTours = useMemo(() => {
    return items
      .filter((tour) => matchesSearch(tour, search))
      .filter((tour) => {
        if (status === "published") return tour.published;
        if (status === "draft") return !tour.published;
        return true;
      })
      .sort((a, b) => {
        if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sort === "price-high") return (b.priceFrom ?? 0) - (a.priceFrom ?? 0);
        if (sort === "price-low") return (a.priceFrom ?? 0) - (b.priceFrom ?? 0);
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      });
  }, [items, search, sort, status]);

  async function deleteTour() {
    if (!deleteTarget) return;
    setError(null);
    setDeletingId(deleteTarget.id);

    const response = await fetch(`/api/admin/tours/${deleteTarget.id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

    if (!response.ok || !result?.ok) {
      setError(result?.message || `Unable to delete ${singularLabel}.`);
      setDeletingId(null);
      return;
    }

    setItems((current) => current.filter((tour) => tour.id !== deleteTarget.id));
    setDeletingId(null);
    setDeleteTarget(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <label className="flex-1">
          <span className="sr-only">Search tours</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
            placeholder="Search by title, slug, or description"
            type="search"
          />
        </label>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:w-auto">
          <label>
            <span className="sr-only">Filter by status</span>
            <select
              value={status}
              onChange={(event) => setStatus(event.target.value as StatusValue)}
              className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm font-medium text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white lg:min-w-[170px]"
            >
              <option value="all">All status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
            </select>
          </label>
          <label>
            <span className="sr-only">Sort tours</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm font-medium text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white lg:min-w-[170px]"
            >
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="price-high">Price High</option>
              <option value="price-low">Price Low</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <section className="mt-6">
        {filteredTours.length ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTours.map((tour) => {
              const publicHref = publicHrefForContent(tour);
              const contentHref = canEdit ? `/admin/tours/${tour.id}` : publicHref;
              return (
                <article
                  key={tour.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,14,30,0.12)]"
                >
                  <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-sand)]">
                    <Link href={contentHref} target={canEdit ? undefined : "_blank"} className="block h-full">
                      <Image
                        src={safeImageSrc(tour.heroImage)}
                        alt={tour.title}
                        fill
                        sizes="(min-width: 1280px) 31vw, (min-width: 768px) 46vw, 92vw"
                        className="object-cover transition duration-700 group-hover:scale-105"
                      />
                    </Link>
                    <span
                      className={`absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white ${
                        tour.published ? "bg-emerald-600" : "bg-slate-500"
                      }`}
                    >
                      {tour.published ? "Published" : "Draft"}
                    </span>
                    <span className="absolute bottom-4 left-4 rounded-full bg-[var(--color-navy)]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                      {tour.contentType.toLowerCase()}
                    </span>
                    {canEdit ? (
                      <Link
                        aria-label={`Edit ${tour.title}`}
                        href={`/admin/tours/${tour.id}`}
                        className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 text-[var(--color-gold-dark)] shadow-sm transition hover:bg-white hover:text-[var(--color-navy)]"
                      >
                        <PencilIcon />
                      </Link>
                    ) : null}
                  </div>
                  <div className="p-5">
                    <Link href={contentHref} target={canEdit ? undefined : "_blank"} className="block">
                      <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gray-600)]">
                        {tour.city || "Egypt"}
                      </p>
                      <h2 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">
                        {tour.title}
                      </h2>
                      <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-gray-600)]">
                        {tour.shortDescription}
                      </p>
                      <p className="mt-4 text-sm font-semibold text-[var(--color-gold-dark)]">
                        {tour.rating.toFixed(1)} ({tour.reviewCount} reviews)
                      </p>
                    </Link>

                    <div className="mt-5 flex items-center justify-between border-y border-[var(--color-gray-100)] py-4">
                      <div>
                        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--color-gray-600)]">
                          From
                        </p>
                        <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">{formatPrice(tour)}</p>
                      </div>
                      <p className="max-w-[48%] text-right text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gray-600)]">
                        {tour.category}
                      </p>
                    </div>

                    <div className="mt-5 grid grid-cols-3 gap-2">
                      {canEdit ? (
                        <Link
                          href={`/admin/tours/${tour.id}`}
                          className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--color-gold)] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold)]"
                        >
                          <PencilIcon />
                          Edit
                        </Link>
                      ) : (
                        <span className="inline-flex items-center justify-center rounded-md border border-[var(--color-gray-100)] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-gray-600)]">
                          Read
                        </span>
                      )}
                      <Link
                        href={publicHref}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-[var(--color-navy)] px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-navy)] hover:text-white"
                      >
                        <EyeIcon />
                        View
                      </Link>
                      <button
                        type="button"
                        disabled={!canDelete || deletingId === tour.id}
                        onClick={() => setDeleteTarget(tour)}
                        className="inline-flex items-center justify-center gap-1.5 rounded-md border border-red-600 px-3 py-2 text-xs font-bold uppercase tracking-[0.08em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        <TrashIcon />
                        Delete
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-10 text-center shadow-sm">
            <p className="font-serif text-3xl font-semibold text-[var(--color-navy)]">{emptyTitle}</p>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">Adjust the search or filters to see more catalog items.</p>
            {canCreate ? (
              <Link className="btn-primary mt-6" href={createHref}>
                + Add New {singularLabel}
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/55 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Confirm delete</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">Delete {singularLabel}?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
              Are you sure you want to delete &quot;{deleteTarget.title}&quot;? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={deleteTour}
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
