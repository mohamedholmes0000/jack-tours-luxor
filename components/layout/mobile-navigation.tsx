"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

const navItems = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/trip-planner", label: "Trip Planner" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    document.documentElement.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <a
        className="inline-flex min-h-9 items-center justify-center rounded-full border border-[rgb(214_173_84_/_36%)] bg-[rgba(214,173,84,0.14)] px-3 text-[0.62rem] font-bold uppercase tracking-[0.1em] text-[var(--color-gold-light)]"
        href={buildWhatsAppUrl()}
        target="_blank"
        rel="noreferrer"
      >
        WhatsApp
      </a>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={() => setIsOpen(true)}
        className="inline-flex size-10 flex-col items-center justify-center gap-1 rounded-full border border-[rgb(214_173_84_/_38%)] bg-white/[0.06] text-[var(--color-gold-light)] shadow-[0_12px_28px_rgb(0_0_0_/_24%)]"
      >
        <span className="h-px w-4 bg-current" />
        <span className="h-px w-4 bg-current" />
        <span className="h-px w-4 bg-current" />
      </button>

      <div
        className={`fixed inset-0 z-50 overflow-hidden bg-[#030912]/62 backdrop-blur-[2px] transition-opacity duration-300 ${
          isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        aria-hidden={!isOpen}
        onClick={closeMenu}
      >
        <aside
          className={`pointer-events-auto absolute right-0 top-0 flex h-dvh w-[min(84vw,22rem)] flex-col border-l border-[rgb(214_173_84_/_30%)] bg-[rgba(6,17,31,0.76)] p-5 text-white shadow-[0_30px_90px_rgb(0_0_0_/_46%)] backdrop-blur-2xl transition-transform duration-300 ease-out ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
          aria-label="Mobile navigation"
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-3xl font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-light)]">
                Jack
              </p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/64">
                Tours Luxor
              </p>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="grid size-10 place-items-center rounded-full border border-white/14 bg-white/[0.06] text-2xl leading-none text-white/82"
            >
              x
            </button>
          </div>

          <nav className="mt-9 flex flex-col gap-2">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeMenu}
                className="border-b border-white/10 py-3 font-serif text-2xl font-semibold text-white transition hover:text-[var(--color-gold-light)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <a
            className="btn-primary mt-auto w-full"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
            onClick={closeMenu}
          >
            Start on WhatsApp
          </a>
        </aside>
      </div>
    </div>
  );
}
