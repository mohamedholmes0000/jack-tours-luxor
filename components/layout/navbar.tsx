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
    <header className="sticky top-0 z-40 border-b border-[var(--color-gray-100)] bg-white/94 backdrop-blur">
      <div className="container-premium flex min-h-20 items-center justify-between gap-6">
        <Link href="/" className="flex flex-col leading-none">
          <span className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
            Jack Tours Luxor
          </span>
          <span className="mt-1 text-[0.65rem] font-bold uppercase tracking-[0.24em] text-[var(--color-gold)]">
            Egypt Private Tours
          </span>
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-semibold text-[var(--color-navy)] lg:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-[var(--color-gold)]">
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
