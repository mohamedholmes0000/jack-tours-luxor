"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import type { PublicSettings } from "@/lib/data/settings";

function PhoneIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.8-.4 1.2-.3 1.3.4 2.6.6 4 .6.7 0 1.2.5 1.2 1.2v3.5c0 .7-.5 1.2-1.2 1.2C10.8 21.4 2.6 13.2 2.6 3.4c0-.7.5-1.2 1.2-1.2h3.5c.7 0 1.2.5 1.2 1.2 0 1.4.2 2.8.6 4 .1.4 0 .9-.3 1.2l-2.2 2.2Z" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function MailIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M4 6.5h16v11H4v-11Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
      <path d="m5 7 7 5.4L19 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function SocialIcon({ label }: { label: "Facebook" | "Instagram" | "TripAdvisor" }) {
  if (label === "Instagram") {
    return (
      <svg className="size-3.5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
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
    <svg className="size-3.5" aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

export function Navbar({ isHomeRoute = false, settings }: { isHomeRoute?: boolean; settings: PublicSettings }) {
  const pathname = usePathname();
  const [isNavStuck, setIsNavStuck] = useState(false);
  const phone = settings.phone || "(+20) XXX XXX XXXX";
  const email = settings.email || "admin@jacktoursluxor.com";
  const navItems = [
    { href: settings.navLink1Url, label: settings.navLink1Label },
    { href: settings.navLink2Url, label: settings.navLink2Label },
    { href: settings.navLink3Url, label: settings.navLink3Label },
    { href: settings.navLink4Url, label: settings.navLink4Label },
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
    function updateNavState() {
      setIsNavStuck(window.scrollY > 36);
    }

    updateNavState();
    window.addEventListener("scroll", updateNavState, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateNavState);
    };
  }, []);

  return (
    <>
      <div className={`site-header-utility hidden border-b border-white/10 md:block ${isHomeRoute ? "site-header-utility-home" : ""}`}>
        <div className="container-premium flex h-9 items-center justify-between text-xs font-normal text-white/60">
          <div className="flex items-center gap-3">
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex items-center gap-2 transition hover:text-[var(--color-gold-light)]">
              <PhoneIcon className="size-3.5 text-white/50" />
              {phone}
            </a>
            <span className="text-white/25">|</span>
            <a href={`mailto:${email}`} className="inline-flex items-center gap-2 transition hover:text-[var(--color-gold-light)]">
              <MailIcon className="size-3.5 text-white/50" />
              {email}
            </a>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={link.label}
                target={link.href === "#" ? undefined : "_blank"}
                rel={link.href === "#" ? undefined : "noreferrer"}
                className="text-white/50 transition hover:text-[var(--color-gold-light)]"
              >
                <SocialIcon label={link.label} />
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className={`site-main-header hidden border-b transition-all duration-200 ease-in-out md:block ${isHomeRoute ? "site-main-header-home" : ""} ${isNavStuck ? "header-stuck" : ""}`}>
        <div className="container-premium grid h-20 grid-cols-[1fr_auto_1fr] items-center gap-5 lg:gap-8">
          <Link href="/" className="flex flex-col leading-none">
            <span className={`font-serif text-[2rem] font-semibold uppercase leading-none tracking-[0.08em] lg:text-[2.25rem] ${isHomeRoute ? "text-[var(--color-gold-light)]" : "text-[var(--color-navy)]"}`}>
              {settings.logoLine1}
            </span>
            <span className={`mt-1 font-sans text-[0.66rem] font-medium uppercase tracking-[0.2em] lg:text-[0.69rem] ${isHomeRoute ? "text-white/72" : "text-[var(--color-navy)]/70"}`}>
              {settings.logoLine2}
            </span>
          </Link>

          <nav className={`flex items-center gap-6 font-sans text-[0.76rem] font-medium uppercase tracking-[0.08em] lg:gap-12 lg:text-[0.82rem] ${isHomeRoute ? "text-white/86" : "text-[var(--color-navy)]"}`}>
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`transition duration-200 hover:text-[var(--color-gold)] ${
                  active ? `active ${isHomeRoute ? "text-[var(--color-gold-light)]" : "text-[var(--color-gold-dark)]"}` : ""
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          </nav>

          <div className="flex items-center justify-end gap-4">
            <Link
              href="/admin"
              aria-label="Admin login"
              className={`grid size-10 place-items-center rounded-full border transition duration-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)] ${isHomeRoute ? "border-white/20 bg-white/8 text-white/84" : "border-[rgb(6_17_31_/_16%)] text-[var(--color-navy)]"}`}
            >
              <UserIcon className="size-5" />
            </Link>
            <Link
              className="inline-flex min-h-10 items-center justify-center rounded-md bg-[var(--color-gold)] px-4 py-2.5 font-sans text-[0.78rem] font-medium uppercase tracking-[0.05em] text-[var(--color-navy)] transition duration-200 hover:bg-[var(--color-gold-light)] lg:px-6 lg:text-[0.8rem]"
              href="/trip-planner"
            >
              {settings.bookNowLabel}
            </Link>
          </div>
        </div>
      </header>

      <MobileNavigation isHomeRoute={isHomeRoute} settings={settings} />
    </>
  );
}
