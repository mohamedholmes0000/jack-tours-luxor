import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

export const inputClassName =
  "min-h-12 w-full border border-[rgb(214_173_84_/_28%)] bg-[rgba(255,250,240,0.86)] px-4 py-3 text-base text-[var(--color-gray-900)] shadow-inner outline-none transition placeholder:text-[var(--color-gray-600)]/60 focus:border-[var(--color-gold)] focus:bg-white";

export const textareaClassName =
  "min-h-36 w-full resize-y border border-[rgb(214_173_84_/_28%)] bg-[rgba(255,250,240,0.86)] px-4 py-3 text-base text-[var(--color-gray-900)] shadow-inner outline-none transition placeholder:text-[var(--color-gray-600)]/60 focus:border-[var(--color-gold)] focus:bg-white";
