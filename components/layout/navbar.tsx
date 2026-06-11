"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
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

export function Navbar() {
  const pathname = usePathname();

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(214_173_84_/_18%)] bg-[rgba(6,17,31,0.94)] text-white shadow-[0_18px_45px_rgb(0_0_0_/_24%)] lg:backdrop-blur-xl">
      <div className="container-premium flex min-h-16 items-center justify-between gap-4 lg:min-h-20">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[1.35rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-light)] lg:text-2xl">
            Jack
          </span>
          <span className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.24em] text-white/72 lg:text-[0.62rem] lg:tracking-[0.28em]">
            Egypt Tour
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-white/78 lg:flex">
          {navItems.map((item) => {
            const active = isActive(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`group relative pb-1 transition hover:text-[var(--color-gold-light)] ${
                  active ? "text-[var(--color-gold-light)]" : ""
                }`}
              >
                {item.label}
                <span
                  aria-hidden
                  className={`absolute bottom-0 left-0 h-px w-full origin-center bg-[var(--color-gold)] transition duration-300 ease-out group-hover:scale-x-100 ${
                    active ? "scale-x-100 opacity-100" : "scale-x-0 opacity-50"
                  }`}
                />
              </Link>
            );
          })}
        </nav>
        {/* Wrapper carries the responsive hide. .btn-primary in globals.css
            sets display:inline-flex and (because it's defined after Tailwind
            utilities) overrides Tailwind's .hidden when both classes sit on
            the same element. A separate wrapper avoids that collision. */}
        <div className="hidden lg:block">
          <a
            className="btn-primary"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Book Now
          </a>
        </div>
        <MobileNavigation />
      </div>
    </header>
  );
}
