"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

const statuses = ["NEW", "CONTACTED", "QUOTED", "BOOKED", "CLOSED"];

export function InquiryStatusControl({ id, status }: { id: string; status: string }) {
  const router = useRouter();
  const [value, setValue] = useState(status);
  const [message, setMessage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  async function updateStatus(nextStatus: string) {
    setValue(nextStatus);
    setIsSaving(true);
    setMessage(null);

    try {
      const response = await fetch(`/api/admin/inquiries/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });
      const result = (await response.json()) as { ok: boolean; message?: string };

      if (!response.ok || !result.ok) {
        setMessage(result.message ?? "Status was not saved.");
        return;
      }

      setMessage("Saved");
      router.refresh();
    } catch (error) {
      console.warn(error);
      setMessage("API unavailable.");
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div>
      <select
        className="min-h-11 border border-[var(--color-gray-100)] bg-white px-3 text-sm"
        value={value}
        disabled={isSaving}
        onChange={(event) => updateStatus(event.target.value)}
      >
        {statuses.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      {message ? <p className="mt-2 text-xs text-[var(--color-gray-600)]">{message}</p> : null}
    </div>
  );
}
