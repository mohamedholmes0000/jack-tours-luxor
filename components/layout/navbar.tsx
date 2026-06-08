import Link from "next/link";
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
  return (
    <header className="sticky top-0 z-40 border-b border-[rgb(214_173_84_/_18%)] bg-[rgba(6,17,31,0.94)] text-white shadow-[0_18px_45px_rgb(0_0_0_/_24%)] lg:backdrop-blur-xl">
      <div className="container-premium flex min-h-16 items-center justify-between gap-4 lg:min-h-20">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-[1.35rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-gold-light)] lg:text-2xl">
            Jack
          </span>
          <span className="mt-1 text-[0.56rem] font-bold uppercase tracking-[0.24em] text-white/72 lg:text-[0.62rem] lg:tracking-[0.28em]">
            Tours Luxor
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-white/78 lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-[var(--color-gold-light)]">
              {item.label}
            </Link>
          ))}
        </nav>
        <a
          className="btn-primary hidden lg:inline-flex"
          href={buildWhatsAppUrl()}
          target="_blank"
          rel="noreferrer"
        >
          WhatsApp
        </a>
        <MobileNavigation />
      </div>
    </header>
  );
}
