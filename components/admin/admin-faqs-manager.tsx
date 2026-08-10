"use client";

import { useMemo, useState } from "react";
import { FaqForm } from "@/components/admin/simple-cms-forms";
import type { AdminFaqValues } from "@/lib/validations";

type AdminFaqRecord = AdminFaqValues & { id: string };
type StatusFilter = "all" | "active" | "hidden";

export function AdminFaqsManager({ canWrite, faqs }: { canWrite: boolean; faqs: AdminFaqRecord[] }) {
  const [query, setQuery] = useState("");
  const [status, setStatus] = useState<StatusFilter>("all");
  const [category, setCategory] = useState("all");
  const categories = useMemo(() => Array.from(new Set(faqs.map((faq) => faq.category).filter(Boolean))).sort(), [faqs]);
  const filteredFaqs = useMemo(() => {
    const search = query.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesSearch = !search || faq.question.toLowerCase().includes(search);
      const matchesStatus = status === "all" || (status === "active" ? faq.active : !faq.active);
      const matchesCategory = category === "all" || faq.category === category;
      return matchesSearch && matchesStatus && matchesCategory;
    });
  }, [category, faqs, query, status]);

  return (
    <div className="mt-8 space-y-6">
      {canWrite ? <FaqForm /> : null}
      <section className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-4 shadow-sm">
        <div className="grid gap-3 md:grid-cols-3">
          <label>
            <span className="sr-only">Search FAQ questions</span>
            <input className="min-h-12 w-full rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-4 text-sm text-[var(--color-navy)] outline-none focus:border-[var(--color-gold)]" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search questions" />
          </label>
          <select aria-label="Filter FAQ status" className="min-h-12 rounded-xl border border-[var(--color-gray-100)] bg-white px-3 text-sm text-[var(--color-navy)]" value={status} onChange={(event) => setStatus(event.target.value as StatusFilter)}>
            <option value="all">All status</option><option value="active">Active</option><option value="hidden">Hidden</option>
          </select>
          <select aria-label="Filter FAQ category" className="min-h-12 rounded-xl border border-[var(--color-gray-100)] bg-white px-3 text-sm text-[var(--color-navy)]" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option value="all">All categories</option>{categories.map((item) => <option key={item} value={item}>{item}</option>)}
          </select>
        </div>
      </section>
      {filteredFaqs.length ? (
        <div className="grid gap-5">
          {filteredFaqs.map((faq) => (
            <section key={faq.id} className="overflow-hidden rounded-2xl border border-[var(--color-gray-100)] bg-white shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--color-gray-100)] bg-[var(--color-ivory)] px-5 py-3 text-xs">
                <div className="flex flex-wrap items-center gap-2.5"><span className="font-semibold text-[var(--color-navy)]">{faq.category}</span><span className={faq.active ? "rounded-full bg-emerald-50 px-2.5 py-1 font-bold uppercase tracking-wide text-emerald-700" : "rounded-full bg-slate-100 px-2.5 py-1 font-bold uppercase tracking-wide text-slate-600"}>{faq.active ? "Active" : "Hidden"}</span></div>
                <span className="font-semibold uppercase tracking-[0.12em] text-[var(--color-gray-600)]">Order {faq.order}</span>
              </div>
              {canWrite ? <div className="p-5"><FaqForm id={faq.id} initialValues={faq} /></div> : <div className="p-5 text-sm text-[var(--color-gray-600)]"><p className="font-semibold text-[var(--color-navy)]">{faq.question}</p><p className="mt-2 leading-6">{faq.answer}</p></div>}
            </section>
          ))}
        </div>
      ) : <p className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">No saved FAQs match these filters. Public fallback FAQs are not editable here.</p>}
    </div>
  );
}