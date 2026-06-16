"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import type { AdminRole } from "@prisma/client";
import { roleBadgeClassNames, roleLabels } from "@/lib/admin/permissions";

export type AdminUsersTableUser = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  active: boolean;
  lastLoginAt: string | null;
  createdAt: string;
};

function initials(name: string, email: string) {
  const source = name.trim() || email.split("@")[0] || "Admin";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function relativeDate(value: string | null) {
  if (!value) return "Never";
  const diff = Date.now() - new Date(value).getTime();
  const minutes = Math.max(1, Math.round(diff / 60000));
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days} day${days === 1 ? "" : "s"} ago`;
  return new Date(value).toLocaleDateString("en-US");
}

export function AdminUsersTable({ users, currentUserId }: { users: AdminUsersTableUser[]; currentUserId: string }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AdminUsersTableUser | null>(null);

  async function mutate(url: string, options: RequestInit, fallback: string) {
    setError(null);
    const response = await fetch(url, options);
    const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
    if (!response.ok || !result?.ok) {
      setError(result?.message || fallback);
      return false;
    }
    router.refresh();
    return true;
  }

  async function toggleUser(user: AdminUsersTableUser) {
    setLoadingId(user.id);
    await mutate(
      `/api/admin/users/${user.id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !user.active }),
      },
      "Unable to update user status.",
    );
    setLoadingId(null);
  }

  async function deleteUser() {
    if (!deleteTarget) return;
    setLoadingId(deleteTarget.id);
    const ok = await mutate(`/api/admin/users/${deleteTarget.id}`, { method: "DELETE" }, "Unable to delete user.");
    setLoadingId(null);
    if (ok) setDeleteTarget(null);
  }

  return (
    <>
      {error ? <p className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
      <div className="overflow-x-auto border border-[var(--color-gray-100)] bg-white p-4 shadow-sm">
        <table className="w-full min-w-[980px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-gray-100)] text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
              <th className="py-3 pr-4">User</th>
              <th className="py-3 pr-4">Role</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Last login</th>
              <th className="py-3 pr-4">Created</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => {
              const isSelf = user.id === currentUserId;
              return (
                <tr key={user.id} className="border-b border-[var(--color-gray-100)]">
                  <td className="py-4 pr-4">
                    <div className="flex items-center gap-3">
                      <div className="grid h-10 w-10 place-items-center rounded-full bg-[var(--color-sand)] text-xs font-bold text-[var(--color-navy)] ring-1 ring-[rgb(214_173_84_/_30%)]">
                        {initials(user.name, user.email)}
                      </div>
                      <div>
                        <p className="font-semibold text-[var(--color-navy)]">{user.name}</p>
                        <p className="text-xs text-[var(--color-gray-600)]">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${roleBadgeClassNames[user.role]}`}>
                      {roleLabels[user.role]}
                    </span>
                  </td>
                  <td className="py-4 pr-4">
                    <span className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-bold ${user.active ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"}`}>
                      {user.active ? "Active" : "Disabled"}
                    </span>
                  </td>
                  <td className="py-4 pr-4 text-[var(--color-gray-600)]">{relativeDate(user.lastLoginAt)}</td>
                  <td className="py-4 pr-4 text-[var(--color-gray-600)]">{new Date(user.createdAt).toLocaleDateString("en-US")}</td>
                  <td className="py-4 pr-4">
                    <div className="flex flex-wrap items-center gap-3">
                      {isSelf ? (
                        <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/profile">
                          Profile
                        </Link>
                      ) : (
                        <Link className="text-sm font-bold text-[var(--color-navy)]" href={`/admin/users/${user.id}`}>
                          Edit
                        </Link>
                      )}
                      <button
                        type="button"
                        disabled={isSelf || loadingId === user.id}
                        onClick={() => toggleUser(user)}
                        className="text-sm font-bold text-[var(--color-gold)] disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        {user.active ? "Disable" : "Enable"}
                      </button>
                      <button
                        type="button"
                        disabled={isSelf || loadingId === user.id}
                        onClick={() => setDeleteTarget(user)}
                        className="text-sm font-bold text-red-700 disabled:cursor-not-allowed disabled:opacity-45"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {deleteTarget ? (
        <div className="fixed inset-0 z-50 grid place-items-center bg-[var(--color-navy)]/50 p-4">
          <div className="w-full max-w-md rounded-2xl border border-red-100 bg-white p-6 shadow-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Confirm delete</p>
            <h2 className="mt-3 font-serif text-3xl font-semibold text-[var(--color-navy)]">Delete {deleteTarget.name}?</h2>
            <p className="mt-3 text-sm leading-6 text-[var(--color-gray-600)]">
              This removes the admin user permanently. This action cannot be undone.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button className="btn-secondary" type="button" onClick={() => setDeleteTarget(null)}>
                Cancel
              </button>
              <button className="bg-red-700 px-5 py-3 text-sm font-bold uppercase tracking-[0.12em] text-white" type="button" onClick={deleteUser}>
                Delete User
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
