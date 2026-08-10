"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FormField, inputClassName, textareaClassName } from "@/components/forms/form-field";
import { adminTestimonialSchema, type AdminTestimonialValues } from "@/lib/validations";

const blank: AdminTestimonialValues = { name: "", country: "", nationality: "", rating: 5, text: "", avatarImage: "", source: "Tripadvisor", order: 0, active: true, featured: false };
export function AdminTestimonialForm({ id, initialValues, mode }: { id?: string; initialValues?: AdminTestimonialValues; mode: "create" | "edit" }) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const form = useForm<AdminTestimonialValues>({ resolver: zodResolver(adminTestimonialSchema), defaultValues: initialValues ?? blank });
  async function submit(values: AdminTestimonialValues) {
    setLoading(true); setError(null);
    try {
      const response = await fetch(mode === "create" ? "/api/admin/testimonials" : "/api/admin/testimonials/" + id, { method: mode === "create" ? "POST" : "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(values) });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; id?: string } | null;
      if (!response.ok || !result?.ok) { setError(result?.message || "Unable to save review."); return; }
      if (mode === "create" && result.id) router.push("/admin/reviews/" + result.id); else router.refresh();
    } finally { setLoading(false); }
  }
  async function remove() {
    if (!id || !window.confirm("Delete this review? This action cannot be undone.")) return;
    setLoading(true); setError(null);
    try {
      const response = await fetch("/api/admin/testimonials/" + id, { method: "DELETE" });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
      if (!response.ok || !result?.ok) { setError(result?.message || "Unable to delete review."); return; }
      router.push("/admin/reviews"); router.refresh();
    } finally { setLoading(false); }
  }
  return <form className="space-y-6" onSubmit={form.handleSubmit(submit)}>
    <div className="grid gap-5 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm md:grid-cols-2">
      <FormField label="Traveler name" error={form.formState.errors.name?.message}><input className={inputClassName} {...form.register("name")} /></FormField>
      <FormField label="Rating" error={form.formState.errors.rating?.message}><select className={inputClassName} {...form.register("rating", { valueAsNumber: true })}>{[5,4,3,2,1].map((rating) => <option key={rating} value={rating}>{rating} out of 5</option>)}</select></FormField>
      <FormField label="Country"><input className={inputClassName} {...form.register("country")} placeholder="United Kingdom" /></FormField>
      <FormField label="Nationality"><input className={inputClassName} {...form.register("nationality")} placeholder="British" /></FormField>
      <FormField label="Source"><input className={inputClassName} list="review-sources" {...form.register("source")} /><datalist id="review-sources">{["Tripadvisor","Google","Facebook","Direct Guest","Other"].map((item) => <option key={item} value={item} />)}</datalist><p className="mt-2 text-xs text-[var(--color-gray-600)]">Informational only. No external review service is connected.</p></FormField>
      <FormField label="Display order"><input className={inputClassName} type="number" min="0" {...form.register("order", { valueAsNumber: true })} /></FormField>
      <div className="md:col-span-2"><FormField label="Review text" error={form.formState.errors.text?.message}><textarea className={textareaClassName + " min-h-40"} {...form.register("text")} /></FormField></div>
      <div className="md:col-span-2"><FormField label="Avatar image URL (optional)" error={form.formState.errors.avatarImage?.message}><input className={inputClassName} {...form.register("avatarImage")} /></FormField></div>
      <div className="flex flex-wrap gap-3 md:col-span-2"><label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4 text-sm text-[var(--color-navy)]"><input type="checkbox" {...form.register("active")} />Active</label><label className="flex min-h-12 items-center gap-3 border border-[var(--color-gray-100)] px-4 text-sm text-[var(--color-navy)]"><input type="checkbox" {...form.register("featured")} />Featured on homepage</label><p className="self-center text-xs text-[var(--color-gray-600)]">Hidden reviews stay stored but do not appear publicly.</p></div>
    </div>
    {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800">{error}</p> : null}
    <div className="flex justify-between gap-3">{mode === "edit" ? <button className="btn-secondary text-red-700" type="button" disabled={loading} onClick={remove}>Delete review</button> : <span />}<button className="btn-primary" disabled={loading} type="submit">{loading ? "Saving…" : "Save review"}</button></div>
  </form>;
}