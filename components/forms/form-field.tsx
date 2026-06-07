import type { ReactNode } from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: ReactNode;
};

export function FormField({ label, error, children }: FormFieldProps) {
  return (
    <label className="block">
      <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)]">
        {label}
      </span>
      <span className="mt-2 block">{children}</span>
      {error ? <span className="mt-2 block text-sm text-red-700">{error}</span> : null}
    </label>
  );
}

export const inputClassName =
  "min-h-12 w-full border border-[var(--color-gray-100)] bg-white px-4 py-3 text-base text-[var(--color-gray-900)] outline-none transition focus:border-[var(--color-gold)]";

export const textareaClassName =
  "min-h-36 w-full resize-y border border-[var(--color-gray-100)] bg-white px-4 py-3 text-base text-[var(--color-gray-900)] outline-none transition focus:border-[var(--color-gold)]";
