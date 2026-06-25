"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { PublicSettings } from "@/lib/data/settings";

function MenuIcon({ className = "", strokeWidth = 1.8 }: { className?: string; strokeWidth?: number }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

function CloseIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="m6 6 12 12M18 6 6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function SocialIcon({ label }: { label: "Facebook" | "Instagram" | "TripAdvisor" }) {
  if (label === "Instagram") {
    return (
      <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <rect x="4" y="4" width="16" height="16" rx="5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
        <circle cx="17" cy="7" r="1" fill="currentColor" />
      </svg>
    );
  }

  if (label === "TripAdvisor") {
    return (
      <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
        <path d="M3 9.5h18" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="8" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <circle cx="16" cy="13" r="3.2" stroke="currentColor" strokeWidth="1.6" />
        <path d="M10.3 16.3 12 18l1.7-1.7" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    );
  }

  return (
    <svg className="size-4" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function buildMobileNavItems(items: Array<{ href: string; label: string }>) {
  const normalizedItems = items.map((item) =>
    item.label.trim().toLowerCase() === "destinations"
      ? { href: "/activities", label: "Activities" }
      : item,
  );

  if (normalizedItems.some((item) => item.href === "/hotels" || item.label.trim().toLowerCase() === "hotels")) {
    return normalizedItems;
  }

  const activitiesIndex = normalizedItems.findIndex(
    (item) => item.href === "/activities" || item.label.trim().toLowerCase() === "activities",
  );
  const insertIndex = activitiesIndex >= 0 ? activitiesIndex + 1 : 2;

  return [
    ...normalizedItems.slice(0, insertIndex),
    { href: "/hotels", label: "Hotels" },
    ...normalizedItems.slice(insertIndex),
  ];
}

export function MobileNavigation({
  isHomeRoute = false,
  isNavStuck = false,
  settings,
}: {
  isHomeRoute?: boolean;
  isNavStuck?: boolean;
  settings: PublicSettings;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const phone = settings.phone || "(+20) XXX XXX XXXX";
  const phoneHref = phone.replace(/[^\d+]/g, "");
  const email = settings.email || "admin@jacktoursluxor.com";
  const navItems = buildMobileNavItems([
    { href: settings.navLink1Url, label: settings.navLink1Label },
    { href: settings.navLink2Url, label: settings.navLink2Label },
    { href: settings.navLink3Url, label: settings.navLink3Label },
    { href: settings.navLink4Url, label: settings.navLink4Label },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ]);
  const socialLinks = [
    { href: settings.socialFacebook || "#", label: "Facebook" as const },
    { href: settings.socialInstagram || "#", label: "Instagram" as const },
    { href: settings.socialTripadvisor || "#", label: "TripAdvisor" as const },
  ];

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useEffect(() => {
    if (!isOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const previous = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";

    return () => {
      body.style.position = previous.position;
      body.style.top = previous.top;
      body.style.left = previous.left;
      body.style.right = previous.right;
      body.style.width = previous.width;
      window.scrollTo(0, scrollY);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  function closeMenu() {
    setIsOpen(false);
  }

  function openMenu() {
    setIsOpen(true);
  }

  return (
    <>
      {/* mobile header wrapper */}
      <div className={`site-main-header border-b transition-[background,border-color,box-shadow] duration-200 ease-in-out md:hidden ${isHomeRoute ? "site-mobile-header-home" : ""} ${isHomeRoute && isNavStuck ? "header-stuck" : ""}`}>
        <div
          className={`container-premium grid grid-cols-[1fr_auto_1fr] items-center gap-2 ${isHomeRoute ? "h-14" : "h-[60px]"}`}
        >
          <button
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={isOpen}
            onClick={openMenu}
            className={`grid place-items-center justify-self-start text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)] ${isHomeRoute ? "size-9" : "size-10"}`}
          >
            <MenuIcon className={isHomeRoute ? "size-5" : "size-[22px]"} strokeWidth={1.7} />
          </button>

          <div className="contents">
            <Link
              href="/"
              className="flex flex-col items-center justify-center leading-none"
              onClick={closeMenu}
            >
              <span className={`font-serif font-semibold uppercase leading-none tracking-[0.08em] text-[var(--color-gold)] ${isHomeRoute ? "text-[1.08rem]" : "text-[1.2rem]"}`}>
                {settings.logoLine1}
              </span>
              <span className={`mt-0.5 font-sans font-medium uppercase tracking-[0.15em] text-[var(--color-navy)]/70 ${isHomeRoute ? "text-[0.48rem]" : "text-[0.52rem]"}`}>
                {settings.logoLine2}
              </span>
            </Link>

            <Link
              className={`inline-flex shrink-0 items-center justify-center rounded-md bg-[var(--color-gold)] font-sans font-semibold uppercase tracking-[0.05em] text-[var(--color-navy)] shadow-[0_8px_18px_rgb(214_173_84_/_16%)] transition hover:bg-[var(--color-gold-light)] justify-self-end ${isHomeRoute ? "min-h-[34px] px-2.5 py-1 text-[0.6rem]" : "min-h-9 px-3 py-1.5 text-[0.64rem]"}`}
              href="/trip-planner"
            >
              {settings.bookNowLabel}
            </Link>
          </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[90] overflow-hidden md:hidden ${
          isOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        onClick={closeMenu}
        aria-hidden={!isOpen}
      >
        <div
          aria-hidden
          className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-out ${
            isOpen ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          className={`mobile-menu-panel absolute left-0 top-0 flex h-dvh w-full flex-col bg-[var(--color-navy)] p-6 text-white shadow-[0_30px_60px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out will-change-transform ${
            isOpen ? "translate-x-0" : "-translate-x-full"
          }`}
          aria-label="Mobile navigation"
          aria-hidden={!isOpen}
          onClick={(event) => event.stopPropagation()}
        >
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-serif text-3xl font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-light)]">
                {settings.logoLine1}
              </p>
              <p className="mt-1 font-sans text-[0.62rem] font-medium uppercase tracking-[0.2em] text-white/64">
                {settings.logoLine2}
              </p>
            </div>
            <button
              type="button"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              className="grid size-11 place-items-center text-white/82 transition hover:text-[var(--color-gold-light)]"
            >
              <CloseIcon className="size-6" />
            </button>
          </div>

          <nav className="mt-10 flex flex-col">
            {navItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  onClick={closeMenu}
                  className={`flex min-h-14 items-center border-b border-white/10 font-sans text-lg font-normal uppercase tracking-[0.08em] text-white transition hover:text-[var(--color-gold-light)] ${
                    active ? "text-[var(--color-gold-light)]" : ""
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="mt-auto border-t border-white/10 pt-6 text-sm text-white/66">
            <a href={`tel:${phoneHref}`} className="block py-2 transition hover:text-[var(--color-gold-light)]">
              {phone}
            </a>
            <a href={`mailto:${email}`} className="block py-2 transition hover:text-[var(--color-gold-light)]">
              {email}
            </a>
            <div className="mt-5 flex items-center gap-5 text-white/60">
              {socialLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  aria-label={link.label}
                  target={link.href === "#" ? undefined : "_blank"}
                  rel={link.href === "#" ? undefined : "noreferrer"}
                  className="transition hover:text-[var(--color-gold-light)]"
                >
                  <SocialIcon label={link.label} />
                </a>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </>
  );
}
