"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { safeImageSrc } from "@/lib/images";

export type AdminGalleryAlbumCard = {
  id: string;
  active: boolean;
  category: string;
  coverImage: string;
  createdAt: string;
  description: string | null;
  displayOrder: number;
  imageCount: number;
  slug: string;
  title: string;
};

type SortValue = "order" | "newest" | "oldest" | "title";

function matchesSearch(album: AdminGalleryAlbumCard, search: string) {
  const value = search.trim().toLowerCase();
  if (!value) return true;
  return [album.title, album.slug, album.description]
    .some((field) => (field || "").toLowerCase().includes(value));
}

export function AdminGalleryGrid({
  albums,
  canCreate,
  canDelete,
  canEdit,
  categories,
}: {
  albums: AdminGalleryAlbumCard[];
  canCreate: boolean;
  canDelete: boolean;
  canEdit: boolean;
  categories: string[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(albums);
  const [category, setCategory] = useState("all");
  const [deleteTarget, setDeleteTarget] = useState<AdminGalleryAlbumCard | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortValue>("order");

  const visibleAlbums = useMemo(() => {
    return items
      .filter((album) => matchesSearch(album, search))
      .filter((album) => category === "all" || album.category === category)
      .sort((a, b) => {
        if (sort === "newest") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        if (sort === "oldest") return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        if (sort === "title") return a.title.localeCompare(b.title);
        return a.displayOrder - b.displayOrder || a.title.localeCompare(b.title);
      });
  }, [category, items, search, sort]);

  async function deleteAlbum() {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget.id);
    setError(null);

    const response = await fetch(`/api/admin/gallery/${deleteTarget.id}`, { method: "DELETE" });
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

    if (!response.ok || !result?.ok) {
      setError(result?.message || "Unable to delete album.");
      setDeletingId(null);
      return;
    }

    setItems((current) => current.filter((album) => album.id !== deleteTarget.id));
    setDeleteTarget(null);
    setDeletingId(null);
    router.refresh();
  }

  return (
    <>
      <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <label className="flex-1">
          <span className="sr-only">Search gallery albums</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white"
            placeholder="Search albums by title, slug, or description"
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
            <span className="sr-only">Sort gallery albums</span>
            <select
              value={sort}
              onChange={(event) => setSort(event.target.value as SortValue)}
              className="w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 py-3 text-sm font-medium text-[var(--color-navy)] outline-none transition focus:border-[var(--color-gold)] focus:bg-white lg:min-w-[160px]"
            >
              <option value="order">Display order</option>
              <option value="newest">Newest</option>
              <option value="oldest">Oldest</option>
              <option value="title">Title A-Z</option>
            </select>
          </label>
        </div>
      </div>

      {error ? <p className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}

      <section className="mt-6">
        {visibleAlbums.length ? (
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {visibleAlbums.map((album) => (
              <article
                key={album.id}
                className="group overflow-hidden rounded-xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_16px_34px_rgba(10,14,30,0.12)]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[var(--color-sand)]">
                  <Link href={canEdit ? `/admin/gallery/${album.id}` : `/gallery/${album.slug}`} className="block h-full">
                    <Image
                      src={safeImageSrc(album.coverImage)}
                      alt={album.title}
                      fill
                      sizes="(min-width: 1280px) 30vw, (min-width: 768px) 45vw, 100vw"
                      className="object-cover transition duration-700 group-hover:scale-105"
                    />
                  </Link>
                  <span className="absolute left-3 top-3 rounded-full bg-[var(--color-navy)]/85 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-white">
                    {album.active ? "Active" : "Hidden"}
                  </span>
                  <span className="absolute right-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.1em] text-[var(--color-navy)]">
                    {album.imageCount} {album.imageCount === 1 ? "photo" : "photos"}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
                    {album.category}
                  </p>
                  <Link href={canEdit ? `/admin/gallery/${album.id}` : `/gallery/${album.slug}`} className="mt-2 block">
                    <h2 className="line-clamp-2 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">
                      {album.title}
                    </h2>
                  </Link>
                  <p className="mt-3 line-clamp-2 text-sm leading-6 text-[var(--color-gray-600)]">
                    {album.description || "No album description yet."}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-2">
                    {canEdit ? (
                      <Link className="rounded-md border border-[var(--color-gold)] px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:bg-[var(--color-gold)]" href={`/admin/gallery/${album.id}`}>
                        Edit
                      </Link>
                    ) : null}
                    <Link className="rounded-md border border-[var(--color-navy)]/25 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] transition hover:border-[var(--color-navy)]" href={`/gallery/${album.slug}`} target="_blank">
                      View
                    </Link>
                    <button
                      className="rounded-md border border-red-600 px-4 py-2 text-xs font-bold uppercase tracking-[0.08em] text-red-700 transition hover:bg-red-600 hover:text-white disabled:cursor-not-allowed disabled:opacity-45"
                      disabled={!canDelete || deletingId === album.id}
                      type="button"
                      onClick={() => setDeleteTarget(album)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-10 text-center shadow-sm">
            <p className="font-serif text-3xl font-semibold text-[var(--color-navy)]">No gallery albums found</p>
            <p className="mt-2 text-sm text-[var(--color-gray-600)]">Adjust the filters or add a new album.</p>
            {canCreate ? (
              <Link className="btn-primary mt-6" href="/admin/gallery/new">
                + Add New Album
              </Link>
            ) : null}
          </div>
        )}
      </section>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/55 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Confirm delete</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">Delete album?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
              Are you sure you want to delete &quot;{deleteTarget.title}&quot; and its photos? This cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button
                className="rounded-md bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white disabled:cursor-not-allowed disabled:opacity-60"
                type="button"
                disabled={deletingId === deleteTarget.id}
                onClick={deleteAlbum}
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
