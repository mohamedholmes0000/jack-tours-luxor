import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/content";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block min-h-80 overflow-hidden bg-[var(--color-navy)]"
    >
      <Image
        src={destination.heroImage}
        alt={destination.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-80 transition duration-500 group-hover:scale-105 group-hover:opacity-70"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[rgba(13,27,42,0.86)] via-[rgba(13,27,42,0.18)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
          Destination
        </p>
        <h3 className="mt-2 font-serif text-4xl font-semibold">{destination.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/76">
          {destination.overview}
        </p>
      </div>
    </Link>
  );
}
