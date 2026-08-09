"use client";

import { useId, useState } from "react";
import { Minus, Plus } from "lucide-react";

type HomeFaqItem = {
  answer: string;
  question: string;
};

export function HomeFaq({ items }: { items: HomeFaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(items.length ? 0 : null);
  const baseId = useId();

  return (
    <div className="border-t border-[rgb(6_17_31_/_16%)]">
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        const buttonId = `${baseId}-button-${index}`;
        const panelId = `${baseId}-panel-${index}`;

        return (
          <div
            key={item.question}
            className={`border-b transition-colors motion-reduce:transition-none ${
              isOpen
                ? "border-[rgb(183_137_43_/_42%)] bg-white/48"
                : "border-[rgb(6_17_31_/_14%)]"
            }`}
          >
            <h3>
              <button
                id={buttonId}
                type="button"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenIndex(isOpen ? null : index)}
                className="flex min-h-14 w-full items-center justify-between gap-5 px-0 py-4 text-left font-serif text-lg font-semibold leading-snug text-[var(--color-navy)] outline-none transition-colors hover:text-[var(--color-gold-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-inset motion-reduce:transition-none sm:px-4 sm:text-xl"
              >
                <span className="flex items-baseline gap-4">
                  <span className={`font-sans text-[0.68rem] font-semibold tracking-[0.08em] ${isOpen ? "text-[var(--color-gold-dark)]" : "text-[var(--color-navy)]/38"}`}>
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item.question}</span>
                </span>
                <span className="grid size-11 shrink-0 place-items-center text-[var(--color-gold-dark)]">
                  {isOpen ? (
                    <Minus aria-hidden="true" className="size-4" strokeWidth={1.6} />
                  ) : (
                    <Plus aria-hidden="true" className="size-4" strokeWidth={1.6} />
                  )}
                </span>
              </button>
            </h3>
            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!isOpen}
              className="max-w-2xl pb-5 pl-9 pr-12 text-sm leading-7 text-[var(--color-navy)]/68 sm:pl-[3.75rem] sm:pr-16 sm:text-[0.95rem]"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}