import Link from "next/link";
import type { AdminSettingsValues } from "@/lib/validations";

export function Footer({ settings }: { settings: AdminSettingsValues }) {
  const socialLinks = [
    { href: settings.facebookUrl, label: "Facebook" },
    { href: settings.instagramUrl, label: "Instagram" },
    { href: settings.tripAdvisorUrl, label: "TripAdvisor" },
  ].filter((link) => link.href);

  return (
    <footer className="section-dark pattern-overlay overflow-hidden border-t border-[rgb(214_173_84_/_24%)] pb-20 text-white sm:pb-0">
      <div className="container-premium grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div className="relative">
          <p className="font-serif text-4xl font-semibold text-[var(--color-gold-light)]">{settings.companyName}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            Luxury Egypt tours, Nile cruise planning, and practical DMC support from a Luxor-based
            team.
          </p>
          <Link
            className="btn-secondary mt-6"
            href="/trip-planner"
          >
            Book Now
          </Link>
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
            <p>{settings.address}</p>
            {settings.phone ? <p>{settings.phone}</p> : null}
            <p>24/7 WhatsApp support</p>
            <p>{settings.email}</p>
            {socialLinks.length ? (
              <div className="flex flex-wrap gap-3 pt-2 text-[var(--color-gold-light)]">
                {socialLinks.map((link) => (
                  <a key={link.label} href={link.href} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
      <div className="relative border-t border-white/10 py-5 text-center text-xs text-white/50">
        &copy; {new Date().getFullYear()} {settings.companyName}. All rights reserved.
      </div>
    </footer>
  );
}
