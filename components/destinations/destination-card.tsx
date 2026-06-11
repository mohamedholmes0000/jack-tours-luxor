import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/content";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group block overflow-hidden border border-[rgb(214_173_84_/_26%)] bg-[var(--color-navy)] shadow-[0_24px_70px_rgb(0_0_0_/_26%)] transition duration-300 hover:-translate-y-1 hover:border-[rgb(214_173_84_/_44%)]"
    >
      <div className="relative h-56 overflow-hidden">
        <Image
          src={destination.coverImage}
          alt={destination.name}
          fill
          sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
          className="object-cover transition duration-700 group-hover:scale-105"
        />
      </div>
      <div className="p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
          Destination
        </p>
        <h3 className="mt-2 font-serif text-4xl font-semibold">{destination.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/76">
          {destination.overview}
        </p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)] transition group-hover:translate-x-1">
          Explore Outward →
        </p>
      </div>
    </Link>
  );
}
