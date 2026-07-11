"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function InquiryDeleteButton({ id, canDelete }: { id: string; canDelete: boolean }) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function deleteInquiry() {
    setMessage(null);

    if (!window.confirm("Delete this inquiry? This cannot be undone.")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;

      if (!response.ok || !result?.ok) {
        setMessage(result?.message ?? "Inquiry was not deleted.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.warn(error);
      setMessage("Delete failed. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  }

  if (!canDelete) {
    return null;
  }

  return (
    <div>
      <button
        className="mt-3 min-h-10 border border-red-200 bg-red-50 px-3 text-xs font-bold uppercase tracking-[0.12em] text-red-700 transition hover:border-red-300 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-60"
        type="button"
        disabled={isDeleting}
        onClick={deleteInquiry}
      >
        {isDeleting ? "Deleting..." : "Delete"}
      </button>
      {message ? <p className="mt-2 max-w-44 text-xs text-red-700">{message}</p> : null}
    </div>
  );
}
