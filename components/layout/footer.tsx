import Image from "next/image";
import Link from "next/link";
import { safeExternalHttpUrl, type PublicSettings } from "@/lib/data/settings";

export function Footer({ settings }: { settings: PublicSettings }) {
  const socialLinks = [
    { href: safeExternalHttpUrl(settings.socialFacebook), logo: "/brand-icons/facebook.svg", label: "Facebook" },
    { href: safeExternalHttpUrl(settings.socialInstagram), logo: "/brand-icons/instagram.svg", label: "Instagram" },
  ].filter((link) => Boolean(link.href));
  const trustLinks = [
    { href: safeExternalHttpUrl(settings.socialTripadvisor), logo: "/brand-icons/tripadvisor.svg", label: "Tripadvisor" },
    { href: safeExternalHttpUrl(settings.socialGoogleBusiness), logo: "/brand-icons/google.svg", label: "Google" },
  ].filter((link) => Boolean(link.href));

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
              <div className="border-t border-white/10 pt-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">Social</p>
                <div className="mt-2 flex flex-col">
                  {socialLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    aria-label={`Visit Jack Luxor Tour on ${link.label}`}
                    className="inline-flex min-h-11 items-center gap-3 border-b border-white/10 text-sm text-white/75 transition-colors hover:text-[var(--color-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy)]"
                  >
                      <Image src={link.logo} alt="" width={18} height={18} className="size-[18px] shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
              </div>
            ) : null}
            {trustLinks.length ? (
              <div className="border-t border-white/10 pt-4">
                <p className="text-[0.65rem] font-bold uppercase tracking-[0.14em] text-white/45">Traveler Reviews / Find Us</p>
                <div className="mt-2 flex flex-col">
                  {trustLinks.map((link) => (
                    <a
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                    aria-label={`Visit Jack Luxor Tour on ${link.label}`}
                    className="inline-flex min-h-11 items-center gap-3 border-b border-white/10 text-sm text-white/75 transition-colors hover:text-[var(--color-gold-light)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold-light)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--color-navy)]"
                  >
                      <Image src={link.logo} alt="" width={18} height={18} className="size-[18px] shrink-0" />
                      <span>{link.label}</span>
                    </a>
                  ))}
                </div>
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
