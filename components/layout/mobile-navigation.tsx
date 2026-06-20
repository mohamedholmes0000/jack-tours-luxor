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
  const isHomeStuck = isHomeRoute && isNavStuck;
  const navItems = [
    { href: settings.navLink1Url, label: settings.navLink1Label },
    { href: settings.navLink2Url, label: settings.navLink2Label },
    { href: settings.navLink3Url, label: settings.navLink3Label },
    { href: settings.navLink4Url, label: settings.navLink4Label },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "Contact" },
  ];
  const socialLinks = [
    { href: settings.socialFacebook || "#", label: "Facebook" as const },
    { href: settings.socialInstagram || "#", label: "Instagram" as const },
    { href: settings.socialTripadvisor || "#", label: "TripAdvisor" as const },
  ];

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

  return (
    <div className={`site-main-header border-b transition-all duration-200 ease-in-out md:hidden ${isHomeRoute ? "site-mobile-header-home" : ""} ${isHomeRoute && isNavStuck ? "header-stuck" : ""}`}>
      <div
        className={
          isHomeStuck
            ? "container-premium grid min-h-[60px] grid-cols-[auto_1fr_auto] items-center gap-3 py-2"
            : isHomeRoute
              ? "container-premium flex min-h-[7.35rem] items-start justify-between gap-4 pt-5"
              : "container-premium grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-2"
        }
      >
        <button
          type="button"
          aria-label="Open navigation menu"
          aria-expanded={isOpen}
          onClick={openMenu}
          className={isHomeRoute ? "grid size-10 place-items-center rounded-[0.95rem] border border-white/22 bg-white/8 text-[var(--color-gold-light)] shadow-[0_8px_20px_rgb(0_0_0_/_16%)] backdrop-blur-sm transition hover:border-[var(--color-gold-light)]" : "grid size-10 place-items-center justify-self-start text-[var(--color-navy)] transition hover:text-[var(--color-gold-dark)]"}
        >
          <MenuIcon className={isHomeRoute ? "size-[18px]" : "size-6"} strokeWidth={isHomeRoute ? 1.35 : 1.8} />
        </button>

        <div className={isHomeStuck ? "contents" : isHomeRoute ? "flex flex-col items-end gap-2" : "contents"}>
          <Link
            href="/"
            className={isHomeStuck ? "flex flex-col items-center justify-center leading-none" : isHomeRoute ? "flex flex-col items-end justify-center leading-none" : "flex flex-col items-center justify-center leading-none"}
            onClick={closeMenu}
          >
            <span className={isHomeRoute ? "font-serif text-[1.125rem] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--color-gold-light)] drop-shadow-[0_2px_8px_rgb(0_0_0_/_26%)]" : "font-serif text-[1.35rem] font-semibold uppercase leading-none tracking-[0.08em] text-[var(--color-gold)]"}>
              {settings.logoLine1}
            </span>
            <span className={isHomeRoute ? "mt-0.5 font-sans text-[0.5rem] font-medium uppercase tracking-[0.15em] text-white/84" : "mt-0.5 font-sans text-[0.58rem] font-medium uppercase tracking-[0.15em] text-[var(--color-navy)]/70"}>
              {settings.logoLine2}
            </span>
          </Link>

          <Link
            className={isHomeRoute ? "inline-flex min-h-9 shrink-0 items-center justify-center rounded-[9px] border border-[rgb(255_255_255_/_34%)] bg-[var(--color-gold)] px-3 py-1.5 font-sans text-[0.625rem] font-semibold uppercase tracking-[0.07em] text-[var(--color-navy)] shadow-[0_8px_18px_rgb(0_0_0_/_16%)] transition hover:bg-[var(--color-gold-light)]" : "inline-flex min-h-10 shrink-0 items-center justify-center rounded-md bg-[var(--color-gold)] px-3.5 py-2 font-sans text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-[var(--color-navy)] shadow-[0_10px_24px_rgb(214_173_84_/_18%)] transition hover:bg-[var(--color-gold-light)] justify-self-end"}
            href="/trip-planner"
          >
            {settings.bookNowLabel}
          </Link>
        </div>
      </div>

      {isOpen ? (
        <div
          className="fixed inset-0 z-[90] overflow-hidden bg-[var(--color-navy)]"
          onClick={closeMenu}
        >
          <aside
            className="mobile-menu-panel pointer-events-auto absolute left-0 top-0 flex h-dvh w-full flex-col bg-[var(--color-navy)] p-6 text-white"
            aria-label="Mobile navigation"
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
      ) : null}
    </div>
  );
}
