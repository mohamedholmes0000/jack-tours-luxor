"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { type PointerEvent, type TouchEvent, useEffect, useState } from "react";
import type { AdminSettingsValues } from "@/lib/validations";

const navItems = [
  { href: "/tours", label: "Tours" },
  { href: "/destinations", label: "Destinations" },
  { href: "/gallery", label: "Gallery" },
  { href: "/blog", label: "Blog" },
  { href: "/trip-planner", label: "Trip Planner" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function getBrandParts(companyName: string) {
  const [firstWord, ...rest] = companyName.trim().split(/\s+/);

  return {
    firstLine: firstWord || "Jack",
    secondLine: rest.join(" ") || "Egypt Tour",
  };
}

export function MobileNavigation({ settings }: { settings: AdminSettingsValues }) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const brand = getBrandParts(settings.companyName);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

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

  function openMenu() {
    setIsOpen(true);
  }

  function openMenuFromPointer(event: PointerEvent<HTMLButtonElement>) {
    event.preventDefault();
    openMenu();
  }

  function openMenuFromTouch(event: TouchEvent<HTMLButtonElement>) {
    event.preventDefault();
    openMenu();
  }

  return (
    <div className="flex items-center gap-2 lg:hidden">
      <Link
        className="inline-flex min-h-9 shrink-0 items-center justify-center rounded-sm bg-gradient-to-br from-[var(--color-gold-light)] to-[var(--color-gold)] px-3 py-2 text-[0.62rem] font-bold uppercase tracking-[0.12em] text-[var(--color-navy)] shadow-[0_12px_28px_rgb(214_173_84_/_22%)]"
        href="/trip-planner"
      >
        Book Now
      </Link>
      <button
        type="button"
        aria-label="Open navigation menu"
        aria-expanded={isOpen}
        onClick={openMenu}
        onPointerUp={openMenuFromPointer}
        onTouchEnd={openMenuFromTouch}
        className="inline-flex size-10 flex-col items-center justify-center gap-1 rounded-full border border-[rgb(214_173_84_/_38%)] bg-white/[0.06] text-[var(--color-gold-light)] shadow-[0_12px_28px_rgb(0_0_0_/_24%)]"
      >
        <span className="h-px w-4 bg-current" />
        <span className="h-px w-4 bg-current" />
        <span className="h-px w-4 bg-current" />
      </button>

      <div
        className={`fixed inset-0 z-[90] overflow-hidden bg-[#030912]/62 backdrop-blur-[2px] transition-opacity duration-300 ${
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
                {brand.firstLine}
              </p>
              <p className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/64">
                {brand.secondLine}
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
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={`group relative border-b border-white/10 py-3 font-serif text-2xl font-semibold text-white transition hover:text-[var(--color-gold-light)] ${
                    active ? "text-[var(--color-gold-light)]" : ""
                  }`}
                >
                  {item.label}
                  <span
                    aria-hidden
                    className={`absolute bottom-2 left-0 h-px w-16 origin-left bg-[var(--color-gold)] transition duration-300 ease-out group-hover:scale-x-100 ${
                      active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-50"
                    }`}
                  />
                </Link>
              );
            })}
          </nav>

          <Link
            className="btn-primary mt-auto w-full"
            href="/trip-planner"
            onClick={closeMenu}
          >
            Book Now
          </Link>
        </aside>
      </div>
    </div>
  );
}
