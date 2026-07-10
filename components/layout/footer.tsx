import Link from "next/link";
import type { PublicSettings } from "@/lib/data/settings";

export function Footer({ settings }: { settings: PublicSettings }) {
  const socialLinks = [
    { href: settings.socialFacebook, label: "Facebook" },
    { href: settings.socialInstagram, label: "Instagram" },
    { href: settings.socialTripadvisor, label: "TripAdvisor" },
    { href: settings.socialTwitter, label: "X" },
    { href: settings.socialYoutube, label: "YouTube" },
  ].filter((link) => link.href);

  return (
    <footer className="section-dark pattern-overlay overflow-hidden border-t border-[rgb(214_173_84_/_24%)] pb-20 text-white sm:pb-0">
      <div className="container-premium grid gap-10 py-12 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div className="relative">
          <p className="font-serif text-4xl font-semibold text-[var(--color-gold-light)]">{settings.companyName}</p>
          <p className="mt-2 text-xs font-bold uppercase tracking-[0.18em] text-white/55">{settings.footerTagline}</p>
          <p className="mt-4 max-w-xl text-sm leading-7 text-white/70">
            {settings.footerDescription}
          </p>
          <Link
            className="btn-secondary mt-6"
            href={settings.bookNowHref}
          >
            {settings.bookNowLabel}
          </Link>
        </div>
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
            {settings.footerCol1Heading}
          </p>
          <div className="mt-4 flex flex-col gap-3 text-sm text-white/70">
            {settings.footerCol1Links.map((link) => (
              <Link key={`${link.label}-${link.url}`} href={link.url}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="relative">
          <p className="text-sm font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
            {settings.footerCol2Heading}
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
        {settings.footerCopyright}
      </div>
    </footer>
  );
}
