import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";
import type { PublicSettings } from "@/lib/data/settings";

export function FloatingWhatsApp({ settings }: { settings: PublicSettings }) {
  return (
    <a
      aria-label="Chat with Jack Egypt Tour on WhatsApp"
      className="fixed bottom-3 right-3 z-40 flex min-h-10 items-center justify-center rounded-full bg-[var(--color-gold)] px-3 text-[0.65rem] font-bold uppercase tracking-[0.08em] text-[var(--color-navy)] shadow-[0_14px_34px_rgb(0_0_0_/_28%)] transition hover:bg-[var(--color-gold-light)] sm:bottom-5 sm:right-5 sm:z-50 sm:min-h-12 sm:px-5 sm:text-xs sm:tracking-[0.12em]"
      href={buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber)}
      target="_blank"
      rel="noreferrer"
    >
      WhatsApp
    </a>
  );
}
