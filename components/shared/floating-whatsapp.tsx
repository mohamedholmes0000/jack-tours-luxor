import { MessageCircle } from "lucide-react";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";
import type { PublicSettings } from "@/lib/data/settings";

export function FloatingWhatsApp({ settings }: { settings: PublicSettings }) {
  return (
    <a
      aria-label="Chat with Jack Egypt Tour on WhatsApp"
      className="floating-whatsapp fixed right-3 z-40 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[rgb(255_255_255_/_72%)] bg-[#1f9d5a] px-3.5 text-[0.68rem] font-bold uppercase tracking-[0.07em] text-white shadow-[0_16px_38px_rgb(0_0_0_/_30%)] transition hover:-translate-y-0.5 hover:bg-[#17894c] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:right-5 sm:z-50 sm:min-h-12 sm:px-5 sm:text-xs sm:tracking-[0.1em]"
      href={buildWhatsAppUrlForNumber(undefined, settings.whatsappNumber)}
      target="_blank"
      rel="noreferrer"
    >
      <MessageCircle aria-hidden className="size-[1.15rem]" strokeWidth={1.9} />
      WhatsApp
    </a>
  );
}
