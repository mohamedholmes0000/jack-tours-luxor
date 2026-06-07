import { buildWhatsAppUrl } from "@/lib/whatsapp";

export function FloatingWhatsApp() {
  return (
    <a
      aria-label="Chat with Jack Tours Luxor on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex min-h-12 items-center justify-center rounded-full bg-[var(--color-gold)] px-5 text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-navy)] shadow-2xl transition hover:bg-[var(--color-gold-light)]"
      href={buildWhatsAppUrl()}
      target="_blank"
      rel="noreferrer"
    >
      WhatsApp
    </a>
  );
}
