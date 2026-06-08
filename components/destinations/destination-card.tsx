import Image from "next/image";
import Link from "next/link";
import type { Destination } from "@/lib/content";

export function DestinationCard({ destination }: { destination: Destination }) {
  return (
    <Link
      href={`/destinations/${destination.slug}`}
      className="group relative block min-h-96 overflow-hidden border border-[rgb(214_173_84_/_26%)] bg-[var(--color-navy)] shadow-[0_24px_70px_rgb(0_0_0_/_26%)]"
    >
      <Image
        src={destination.heroImage}
        alt={destination.name}
        fill
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        className="object-cover opacity-82 transition duration-700 group-hover:scale-105 group-hover:opacity-72"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#06111f] via-[rgba(6,17,31,0.22)] to-transparent" />
      <div className="absolute left-5 top-5 size-11 rounded-full border border-[rgb(214_173_84_/_46%)] bg-[rgba(6,17,31,0.44)]" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold-light)]">
          Destination
        </p>
        <h3 className="mt-2 font-serif text-4xl font-semibold">{destination.name}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-7 text-white/76">
          {destination.overview}
        </p>
        <p className="mt-5 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold-light)]">
          Explore outward
        </p>
      </div>
    </Link>
  );
}
