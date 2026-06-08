import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(214_173_84_/_18%)] bg-[rgba(6,17,31,0.88)] text-white shadow-[0_18px_45px_rgb(0_0_0_/_24%)] backdrop-blur-xl">
      <div className="container-premium flex min-h-20 flex-wrap items-center justify-between gap-x-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-light)]">
            Jack
          </span>
          <span className="mt-1 text-[0.62rem] font-bold uppercase tracking-[0.28em] text-white/72">
            Tours Luxor
          </span>
        </Link>
        <nav className="order-3 -mx-2 flex w-[calc(100%+1rem)] items-center gap-4 overflow-x-auto px-2 pb-3 text-sm font-semibold text-white/78 lg:order-none lg:mx-0 lg:w-auto lg:gap-5 lg:overflow-visible lg:px-0 lg:pb-0">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--color-gold-light)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          className="btn-primary hidden sm:inline-flex"
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
      </div>
    </header>
  );
}
