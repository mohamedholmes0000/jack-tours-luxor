import Link from "next/link";
import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function Footer() {
  return (
    <footer className="section-dark pattern-overlay overflow-hidden border-t border-[rgb(214_173_84_/_24%)] text-white">
      <div className="container-premium grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div className="relative">
          <p className="font-serif text-4xl font-semibold text-[var(--color-gold-light)]">Jack Egypt Tour</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Luxury Egypt tours, Nile cruise planning, and practical DMC support from a Luxor-based
            team.
          </p>
          <a
            className="btn-secondary mt-6"
            href={buildWhatsAppUrl()}
            target="_blank"
            rel="noreferrer"
          >
            Start on WhatsApp
          </a>
        </div>
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
            Explore
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
            <Link href="/tours">Tours</Link>
            <Link href="/destinations">Destinations</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/blog">Blog</Link>
            <Link href="/faq">FAQ</Link>
          </div>
        </div>
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
            Contact
          </p>
          <div className="mt-4 space-y-3 text-sm text-white/70">
            <p>Luxor, Egypt</p>
            <p>24/7 WhatsApp support</p>
            <p>admin@jacktoursluxor.com</p>
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} Jack Egypt Tour. All rights reserved.
      </div>
    </footer>
  );
}
