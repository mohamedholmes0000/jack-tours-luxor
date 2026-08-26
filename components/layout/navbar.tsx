"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLayoutEffect, useState } from "react";
import { Mail, MessageCircle, Phone } from "lucide-react";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { SiteLogo } from "@/components/layout/site-logo";
import type { PublicSettings } from "@/lib/data/settings";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

function UserIcon({ className = "" }: { className?: string }) {
  return (
    <svg className={className} aria-hidden="true" viewBox="0 0 24 24" fill="none">
      <path d="M20 21a8 8 0 0 0-16 0" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
      <path d="M12 12a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9Z" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function safeExternalHttpUrl(value: string | undefined) {
  if (!value) return "";

  try {
    const url = new URL(value.trim());
    return url.protocol === "https:" || url.protocol === "http:" ? url.toString() : "";
  } catch {
    return "";
  }
}

function buildHeaderNavItems(items: Array<{ href: string; label: string }>) {
  const normalizedItems = items.map((item) =>
    item.label.trim().toLowerCase() === "destinations"
      ? { href: "/activities", label: "Activities" }
      : item,
  );
  const withoutHome = normalizedItems.filter(
    (item) => item.href !== "/" && item.label.trim().toLowerCase() !== "home",
  );
  const withoutHotels = withoutHome.filter(
    (item) => item.href !== "/hotels" && item.label.trim().toLowerCase() !== "hotels",
  );
  const itemsWithHome = [{ href: "/", label: "Home" }, ...withoutHotels];

  const activitiesIndex = itemsWithHome.findIndex(
    (item) => item.href === "/activities" || item.label.trim().toLowerCase() === "activities",
  );
  const insertIndex = activitiesIndex >= 0 ? activitiesIndex + 1 : 3;

  return [
    ...itemsWithHome.slice(0, insertIndex),
    { href: "/hotels", label: "Hotels" },
    ...itemsWithHome.slice(insertIndex),
  ];
}

function normalizeInquiryCtaLabel(value: string) {
  const label = value.trim();
  return !label || label.toLowerCase() === "book now" ? "Plan Your Trip" : label;
}

export function Navbar({ isHomeRoute = false, settings }: { isHomeRoute?: boolean; settings: PublicSettings }) {
  const pathname = usePathname();
  const [isNavStuck, setIsNavStuck] = useState(false);
  const phone = settings.phone || "+20 1096586292";
  const email = settings.email || "admin@jacktoursluxor.com";
  const inquiryCtaLabel = normalizeInquiryCtaLabel(settings.bookNowLabel);
  const whatsappHref = buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber);
  const logoAlt = `${settings.logoLine1} ${settings.logoLine2}`.trim();
  const navItems = buildHeaderNavItems([
    { href: settings.navLink1Url, label: settings.navLink1Label },
    { href: settings.navLink2Url, label: settings.navLink2Label },
    { href: settings.navLink3Url, label: settings.navLink3Label },
    { href: settings.navLink4Url, label: settings.navLink4Label },
  ]);
  const socialLinks = [
    { href: safeExternalHttpUrl(settings.socialFacebook), label: "Facebook", logo: "/brand-icons/facebook.svg" },
    { href: safeExternalHttpUrl(settings.socialInstagram), label: "Instagram", logo: "/brand-icons/instagram.svg" },
    { href: safeExternalHttpUrl(settings.socialTripadvisor), label: "Tripadvisor", logo: "/brand-icons/tripadvisor.svg" },
    { href: safeExternalHttpUrl(settings.socialGoogleBusiness), label: "Google", logo: "/brand-icons/google.svg" },
  ].filter((link) => Boolean(link.href));

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  useLayoutEffect(() => {
    let frameId = 0;

    function updateNavState() {
      const threshold = isHomeRoute ? window.innerHeight * 0.6 : 36;
      setIsNavStuck(window.scrollY > threshold);
    }

    updateNavState();
    frameId = window.requestAnimationFrame(updateNavState);
    window.addEventListener("scroll", updateNavState, { passive: true });
    window.addEventListener("resize", updateNavState);
    window.addEventListener("pageshow", updateNavState);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", updateNavState);
      window.removeEventListener("resize", updateNavState);
      window.removeEventListener("pageshow", updateNavState);
    };
  }, [isHomeRoute]);

  return (
    <>
      <div className={`site-header-utility hidden border-b border-white/10 md:block ${isHomeRoute ? "site-header-utility-home" : ""}`}>
        <div className="container-premium flex h-10 items-center justify-between font-normal text-[0.78rem] text-white/78">
          <div className="flex items-center gap-5">
            <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} className="inline-flex min-h-8 items-center gap-2.5 font-medium transition hover:text-[var(--color-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)]">
              <Phone aria-hidden="true" className="size-4 text-[var(--color-gold-light)]" strokeWidth={1.8} />
              {phone}
            </a>
            <span aria-hidden="true" className="h-4 w-px bg-white/25" />
            <a href={`mailto:${email}`} className="inline-flex min-h-8 items-center gap-2.5 font-medium transition hover:text-[var(--color-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)]">
              <Mail aria-hidden="true" className="size-4 text-[var(--color-gold-light)]" strokeWidth={1.8} />
              {email}
            </a>
          </div>
          <div className="flex items-center gap-2">
            {socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                aria-label={`Visit Jack Luxor Tour on ${link.label}`}
                title={link.label}
                target="_blank"
                rel="noopener noreferrer"
                className="grid size-9 place-items-center rounded-full border border-white/15 bg-white/95 transition-transform hover:scale-105 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy)]"
              >
                <Image src={link.logo} alt="" width={22} height={22} className="size-[22px]" />
              </a>
            ))}
          </div>
        </div>
      </div>

      <header className={`site-main-header hidden border-b transition-[background,border-color,box-shadow,backdrop-filter] duration-200 ease-in-out md:block ${isHomeRoute ? "site-main-header-home" : ""} ${isNavStuck ? "header-stuck" : ""}`}>
        <div className={`container-premium grid grid-cols-[1fr_auto_1fr] items-center gap-5 lg:gap-8 ${isHomeRoute ? "h-[59px]" : "h-[72px]"}`}>
          <Link href="/" className="flex min-w-0 items-center leading-none" aria-label={logoAlt}>
            <SiteLogo
              alt={logoAlt}
              logoImage={settings.logoImage}
              width={480}
              height={120}
              sizes="(max-width: 1023px) 152px, 176px"
              className={`w-auto max-w-[9.5rem] object-contain object-left lg:max-w-[11rem] ${isHomeRoute ? "h-9" : "h-11"}`}
            >
              <span className="flex flex-col">
                <span className={`font-serif font-semibold uppercase leading-none tracking-[0.08em] ${isHomeRoute ? "text-[1.75rem] text-[var(--color-gold-light)] lg:text-[1.95rem]" : "text-[1.85rem] text-[var(--color-navy)] lg:text-[2.05rem]"}`}>
                  {settings.logoLine1}
                </span>
                <span className={`mt-0.5 font-sans font-medium uppercase tracking-[0.2em] ${isHomeRoute ? "text-[0.56rem] text-white/72 lg:text-[0.6rem]" : "text-[0.62rem] text-[var(--color-navy)]/70 lg:text-[0.65rem]"}`}>
                  {settings.logoLine2}
                </span>
              </span>
            </SiteLogo>
          </Link>

          <nav className={`flex items-center gap-6 font-sans font-medium uppercase tracking-[0.08em] lg:gap-12 ${isHomeRoute ? "text-[0.78rem] text-white/86" : "text-[0.76rem] text-[var(--color-navy)] lg:text-[0.82rem]"}`}>
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

          <div className="flex items-center justify-end gap-3">
            {isHomeRoute ? (
              <a
                href={whatsappHref}
                target="_blank"
                rel="noreferrer"
                className="hidden min-h-[38px] items-center justify-center gap-2 rounded-md border border-[rgb(214_173_84_/_68%)] bg-[rgb(6_17_31_/_22%)] px-3.5 text-[0.68rem] font-semibold uppercase tracking-[0.05em] text-white transition hover:border-[var(--color-gold-light)] hover:bg-white/10 xl:inline-flex"
              >
                <MessageCircle aria-hidden className="size-4 text-[var(--color-gold-light)]" strokeWidth={1.8} />
                WhatsApp
              </a>
            ) : (
              <Link
                href="/admin"
                aria-label="Admin login"
                className="grid size-10 place-items-center rounded-full border border-[rgb(6_17_31_/_16%)] text-[var(--color-navy)] transition duration-200 hover:border-[var(--color-gold)] hover:text-[var(--color-gold-dark)]"
              >
                <UserIcon className="size-5" />
              </Link>
            )}
            <Link
              className={`inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] font-sans font-semibold uppercase tracking-[0.05em] text-[var(--color-navy)] transition duration-200 hover:bg-[var(--color-gold-light)] ${isHomeRoute ? "min-h-[38px] px-4 py-2 text-[0.7rem]" : "min-h-10 px-4 py-2.5 text-[0.78rem] lg:px-6 lg:text-[0.8rem]"}`}
              href={settings.bookNowHref}
            >
              {inquiryCtaLabel}
            </Link>
          </div>
        </div>
      </header>

      <MobileNavigation isHomeRoute={isHomeRoute} isNavStuck={isNavStuck} settings={settings} />
    </>
  );
}
