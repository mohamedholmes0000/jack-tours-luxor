import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import {
  BedDouble,
  Car,
  CheckCircle2,
  Clock,
  MapPin,
  Star,
  Users,
  Utensils,
  Waves,
  Wifi,
  Wind,
  XCircle,
} from "lucide-react";
import { HotelAvailabilityForm } from "@/components/content/hotel-availability-form";
import { TourDetailGallery } from "@/components/tours/tour-detail-interactions";
import { formatPrice, type Tour } from "@/lib/content";
import { buildWhatsAppUrlForNumber } from "@/lib/whatsapp";

type ContentDetailKind = "ACTIVITY" | "HOTEL";

function priceLabel(item: Tour, kind: ContentDetailKind) {
  if (!item.priceFrom) return "Custom quote";
  const amount = `${item.priceCurrency} ${item.priceFrom.toLocaleString("en-US")}`;
  return kind === "HOTEL" ? `From ${amount} per night` : `From ${amount}`;
}

function InfoPill({
  children,
  icon,
  label,
}: {
  children: ReactNode;
  icon: ReactNode;
  label: string;
}) {
  return (
    <div className="rounded-2xl border border-[rgb(214_173_84_/_20%)] bg-white/92 p-4 shadow-[0_10px_28px_rgb(6_17_31_/_7%)]">
      <div className="flex items-center gap-3 text-[var(--color-navy)]">
        <span className="grid size-9 shrink-0 place-items-center rounded-full bg-[var(--color-sand)] text-[var(--color-gold-dark)]">
          {icon}
        </span>
        <div>
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-navy)]/45">
            {label}
          </p>
          <p className="mt-1 text-sm font-semibold text-[var(--color-navy)]">{children}</p>
        </div>
      </div>
    </div>
  );
}

function BulletList({
  emptyLabel,
  icon,
  items,
}: {
  emptyLabel: string;
  icon: React.ReactNode;
  items: string[];
}) {
  const list = items.length ? items : [emptyLabel];

  return (
    <ul className="mt-5 grid gap-3 sm:grid-cols-2">
      {list.map((item) => (
        <li key={item} className="flex gap-3 text-sm leading-6 text-[var(--color-navy)]/68">
          <span className="mt-0.5 shrink-0 text-[var(--color-gold-dark)]">{icon}</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div>
      <p className="eyebrow text-[var(--color-gold)]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)] md:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function hotelViewLabel(item: Tour) {
  return item.city?.toLowerCase().includes("nile") || item.title.toLowerCase().includes("nile")
    ? "Nile View"
    : item.city?.toLowerCase().includes("red sea") || item.city?.toLowerCase().includes("hurghada")
      ? "Sea View"
      : "City View";
}

function HotelContentPanel({
  children,
  eyebrow,
  title,
}: {
  children: ReactNode;
  eyebrow: string;
  title: string;
}) {
  return (
    <section className="rounded-3xl border border-[rgb(6_17_31_/_7%)] bg-white p-6 shadow-[0_12px_34px_rgb(6_17_31_/_6%)] md:p-7">
      <p className="eyebrow text-[var(--color-gold)]">{eyebrow}</p>
      <h2 className="mt-2 font-serif text-3xl font-semibold leading-tight text-[var(--color-navy)]">
        {title}
      </h2>
      <div className="mt-5">{children}</div>
    </section>
  );
}

function HotelFacilitiesGrid({ item }: { item: Tour }) {
  const facilities = [
    { icon: <Wifi className="size-5" />, label: "Wi-Fi" },
    { icon: <Wind className="size-5" />, label: "Air Conditioning" },
    { icon: <Utensils className="size-5" />, label: "Restaurant" },
    { icon: <Waves className="size-5" />, label: "Pool" },
    { icon: <Car className="size-5" />, label: "Airport Transfer" },
    { icon: <BedDouble className="size-5" />, label: hotelViewLabel(item) },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {facilities.map((facility) => (
        <div
          key={facility.label}
          className="flex min-h-16 items-center gap-3 rounded-2xl border border-[rgb(214_173_84_/_18%)] bg-[var(--color-ivory)] px-4 py-3 text-[var(--color-navy)]"
        >
          <span className="grid size-10 shrink-0 place-items-center rounded-full bg-white text-[var(--color-gold-dark)] shadow-sm">
            {facility.icon}
          </span>
          <span className="text-sm font-semibold">{facility.label}</span>
        </div>
      ))}
    </div>
  );
}

function HotelRulesGrid({ item }: { item: Tour }) {
  const rules = [
    { icon: <Clock className="size-4" />, label: "Check-in", value: "2:00 PM" },
    { icon: <Clock className="size-4" />, label: "Check-out", value: "12:00 PM" },
    { icon: <Users className="size-4" />, label: "Guests", value: item.groupSize || "Rooms on request" },
  ];

  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {rules.map((rule) => (
        <InfoPill key={rule.label} icon={rule.icon} label={rule.label}>
          {rule.value}
        </InfoPill>
      ))}
    </div>
  );
}

function HotelRoomPreview({ item }: { item: Tour }) {
  const image = item.images[1] || item.images[0] || item.heroImage;

  return (
    <div className="overflow-hidden rounded-3xl border border-[rgb(214_173_84_/_18%)] bg-[var(--color-ivory)] shadow-[0_14px_36px_rgb(6_17_31_/_7%)] md:grid md:grid-cols-[220px_1fr]">
      <div className="relative min-h-[210px] md:min-h-full">
        <Image
          src={image}
          alt={`${item.title} room preview`}
          fill
          sizes="(min-width: 768px) 220px, 100vw"
          className="object-cover"
        />
      </div>
      <div className="p-5 md:p-6">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[var(--color-gold-dark)]">
          Suggested room
        </p>
        <h3 className="mt-2 font-serif text-2xl font-semibold leading-tight text-[var(--color-navy)]">
          Comfort room for private travelers
        </h3>
        <p className="mt-3 text-sm leading-6 text-[var(--color-navy)]/62">
          We confirm the best available room category for your dates, party size, and budget.
        </p>
        <div className="mt-4 flex flex-wrap gap-2 text-xs text-[var(--color-navy)]/62">
          <span className="rounded-full bg-white px-3 py-2">2 guests</span>
          <span className="rounded-full bg-white px-3 py-2">1 room</span>
          <span className="rounded-full bg-white px-3 py-2">{formatPrice(item)}</span>
        </div>
        <a className="btn-primary mt-5" href="#hotel-availability">
          Check Availability on WhatsApp
        </a>
      </div>
    </div>
  );
}

function RelatedCards({
  items,
  kind,
}: {
  items: Tour[];
  kind: ContentDetailKind;
}) {
  if (!items.length) return null;
  const basePath = kind === "HOTEL" ? "/hotels" : "/activities";

  return (
    <section className="bg-white py-12 md:py-16">
      <div className="container-premium">
        <SectionTitle
          eyebrow={kind === "HOTEL" ? "More stays" : "More activities"}
          title={kind === "HOTEL" ? "Related hotel ideas" : "Related experiences"}
        />
        <div className="mt-7 grid gap-5 md:grid-cols-3">
          {items.map((item) => (
            <Link
              key={item.slug}
              href={`${basePath}/${item.slug}`}
              className="group overflow-hidden rounded-2xl bg-[var(--color-ivory)] shadow-[0_10px_26px_rgb(6_17_31_/_7%)] transition duration-300 hover:-translate-y-1"
            >
              <div className="relative aspect-[16/10] overflow-hidden">
                <Image
                  src={item.heroImage}
                  alt={item.title}
                  fill
                  sizes="(min-width: 768px) 30vw, 100vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-xs text-[var(--color-navy)]/50">{item.city || "Egypt"}</p>
                <h3 className="mt-2 line-clamp-2 font-serif text-2xl font-semibold text-[var(--color-navy)]">
                  {item.title}
                </h3>
                <p className="mt-3 text-sm font-semibold text-[var(--color-gold-dark)]">
                  {priceLabel(item, kind)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContentDetailPage({
  allItems,
  item,
  kind,
  whatsappNumber,
}: {
  allItems: Tour[];
  item: Tour;
  kind: ContentDetailKind;
  whatsappNumber?: string;
}) {
  const isHotel = kind === "HOTEL";
  const images = Array.from(new Set([item.heroImage, ...item.images])).filter(Boolean);
  const galleryImages = images.slice(1, 4);
  const whatsappMessage = isHotel
    ? `Hello Jack Luxor Tour, I would like to check availability for ${item.title}. Please send room options and pricing.`
    : `Hello Jack Luxor Tour, I would like to request the ${item.title} activity. Please send details and availability.`;
  const whatsappHref = buildWhatsAppUrlForNumber(whatsappMessage, whatsappNumber);
  const related = allItems
    .filter((candidate) => candidate.slug !== item.slug)
    .filter((candidate) => candidate.city === item.city || candidate.category === item.category)
    .concat(allItems.filter((candidate) => candidate.slug !== item.slug))
    .filter((candidate, index, array) => array.findIndex((other) => other.slug === candidate.slug) === index)
    .slice(0, 3);

  if (isHotel) {
    return (
      <>
        <section className="section-ivory py-8 md:py-10">
          <div className="container-premium">
            <div className="grid gap-6 lg:grid-cols-[1fr_360px] lg:items-end">
              <div>
                <p className="eyebrow text-[var(--color-gold)]">Curated stay</p>
                <h1 className="mt-3 max-w-4xl font-serif text-4xl font-semibold leading-[1.04] text-[var(--color-navy)] md:text-6xl">
                  {item.title}
                </h1>
                <div className="mt-5 flex flex-wrap gap-3 text-sm text-[var(--color-navy)]/64">
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(214_173_84_/_22%)] bg-white px-4 py-2">
                    <MapPin className="size-4 text-[var(--color-gold-dark)]" />
                    {item.city || "Egypt"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(214_173_84_/_22%)] bg-white px-4 py-2">
                    <Star className="size-4 fill-[var(--color-gold)] text-[var(--color-gold)]" />
                    {item.reviewCount > 0 ? `${item.rating.toFixed(1)} (${item.reviewCount} reviews)` : "Not rated yet"}
                  </span>
                  <span className="inline-flex items-center gap-2 rounded-full border border-[rgb(214_173_84_/_22%)] bg-white px-4 py-2">
                    <BedDouble className="size-4 text-[var(--color-gold-dark)]" />
                    {priceLabel(item, kind)}
                  </span>
                </div>
              </div>
              <p className="max-w-sm text-sm leading-7 text-[var(--color-navy)]/62 lg:justify-self-end">
                Share your stay dates and party size, then we confirm available room options with you directly on WhatsApp.
              </p>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-start">
              <main className="space-y-6">
                <TourDetailGallery
                  title={item.title}
                  images={images}
                  eyebrow="Stay gallery"
                  heading="In the frame"
                  sectionId="hotel-gallery"
                />

                <HotelContentPanel eyebrow="Overview" title="Description">
                  <p className="text-base leading-8 text-[var(--color-navy)]/68">
                    {item.overview || item.shortDescription || "A carefully selected stay option that can be adapted around your dates, route, and preferred comfort level."}
                  </p>
                  <BulletList
                    emptyLabel="Hotel coordination through Jack Luxor Tour"
                    icon={<CheckCircle2 className="size-4" />}
                    items={item.highlights}
                  />
                </HotelContentPanel>

                <HotelContentPanel eyebrow="Facilities" title="Hotel facilities">
                  <HotelFacilitiesGrid item={item} />
                </HotelContentPanel>

                <HotelContentPanel eyebrow="Destination" title="Location">
                  <div className="flex items-center gap-3 rounded-2xl bg-[var(--color-ivory)] px-4 py-4 text-sm font-semibold text-[var(--color-navy)]">
                    <span className="grid size-10 place-items-center rounded-full bg-white text-[var(--color-gold-dark)] shadow-sm">
                      <MapPin className="size-5" />
                    </span>
                    {item.city || "Egypt"}
                  </div>
                </HotelContentPanel>

                <HotelContentPanel eyebrow="Stay details" title="Rules">
                  <HotelRulesGrid item={item} />
                  <p className="mt-4 text-sm leading-7 text-[var(--color-navy)]/58">
                    Exact rules can vary by property and season. We confirm final details on WhatsApp before you commit.
                  </p>
                </HotelContentPanel>

                <HotelContentPanel eyebrow="Room" title="A stay option to start from">
                  <HotelRoomPreview item={item} />
                </HotelContentPanel>
              </main>

              <aside className="rounded-3xl border border-[rgb(214_173_84_/_24%)] bg-white p-5 shadow-[0_20px_54px_rgb(6_17_31_/_10%)] lg:sticky lg:top-24">
                <div className="rounded-2xl bg-[var(--color-navy)] px-5 py-4 text-white">
                  <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-white/54">
                    Stay from
                  </p>
                  <p className="mt-1 font-serif text-3xl font-semibold">{priceLabel(item, kind)}</p>
                </div>
                <HotelAvailabilityForm hotelTitle={item.title} location={item.city || "Egypt"} price={priceLabel(item, kind)} />
              </aside>
            </div>
          </div>
        </section>

        <RelatedCards items={related} kind={kind} />
      </>
    );
  }

  return (
    <>
      <section className="relative overflow-hidden bg-[var(--color-navy)] text-white">
        <div className="relative min-h-[420px] md:min-h-[560px]">
          <Image
            src={item.heroImage}
            alt={item.title}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,17,31,0.86),rgba(6,17,31,0.55)_48%,rgba(6,17,31,0.18)),linear-gradient(0deg,rgba(6,17,31,0.62),rgba(6,17,31,0.12))]" />
          <div className="container-premium relative flex min-h-[420px] items-end py-12 md:min-h-[560px] md:py-16">
            <div className="max-w-4xl">
              <p className="eyebrow text-[var(--color-gold-light)]">
                {isHotel ? "Curated stay" : "Private activity"}
              </p>
              <h1 className="mt-4 font-serif text-5xl font-semibold leading-[1.02] md:text-7xl">
                {item.title}
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-7 text-white/78 md:text-lg">
                {item.shortDescription || item.overview}
              </p>
              <div className="mt-7 flex flex-wrap gap-3 text-sm text-white/76">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 backdrop-blur">
                  <MapPin className="size-4 text-[var(--color-gold-light)]" />
                  {item.city || "Egypt"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 backdrop-blur">
                  <Clock className="size-4 text-[var(--color-gold-light)]" />
                  {item.duration || "Flexible"}
                </span>
                <span className="inline-flex items-center gap-2 rounded-full border border-white/18 bg-white/10 px-4 py-2 backdrop-blur">
                  <Star className="size-4 fill-[var(--color-gold-light)] text-[var(--color-gold-light)]" />
                  {item.reviewCount > 0 ? `${item.rating.toFixed(1)} (${item.reviewCount} reviews)` : "New listing"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-ivory py-12 md:py-16">
        <div className="container-premium grid gap-8 lg:grid-cols-[1fr_360px] lg:items-start">
          <div className="rounded-3xl bg-white p-6 shadow-[0_16px_45px_rgb(6_17_31_/_8%)] md:p-8">
            <SectionTitle eyebrow="Overview" title="A polished private experience" />
            <p className="mt-5 text-base leading-8 text-[var(--color-navy)]/68">
              {item.overview || item.shortDescription || "A private activity idea that can be arranged around your timing, interests, and wider Egypt itinerary."}
            </p>
            <BulletList
              emptyLabel="Private timing and local support"
              icon={<CheckCircle2 className="size-4" />}
              items={item.highlights}
            />
          </div>

          <aside className="rounded-3xl border border-[rgb(214_173_84_/_22%)] bg-white p-6 shadow-[0_20px_54px_rgb(6_17_31_/_10%)] lg:sticky lg:top-24">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[var(--color-gold-dark)]">
              Starting from
            </p>
            <p className="mt-2 font-serif text-4xl font-semibold text-[var(--color-navy)]">
              {priceLabel(item, kind)}
            </p>
            <div className="mt-5 space-y-3">
              <InfoPill icon={<MapPin className="size-4" />} label="Location">
                {item.city || "Egypt"}
              </InfoPill>
              <InfoPill icon={<Users className="size-4" />} label="Group">
                {item.groupSize || "Private"}
              </InfoPill>
            </div>
            <a className="btn-primary mt-6 w-full justify-center" href={whatsappHref} target="_blank" rel="noreferrer">
              Request this activity
            </a>
            <p className="mt-4 text-xs leading-5 text-[var(--color-navy)]/48">
              No online payment here. We confirm details, timing, and fit over WhatsApp before you decide.
            </p>
          </aside>
        </div>
      </section>

      {galleryImages.length ? (
        <section className="bg-white py-12 md:py-16">
          <div className="container-premium">
            <SectionTitle eyebrow="Gallery" title="A glimpse of the experience" />
            <div className="mt-7 grid gap-4 md:grid-cols-3">
              {galleryImages.map((image, index) => (
                <div key={`${image}-${index}`} className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[var(--color-sand)]">
                  <Image
                    src={image}
                    alt={`${item.title} image ${index + 2}`}
                    fill
                    sizes="(min-width: 768px) 30vw, 100vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>
      ) : null}

      <section className="bg-white py-12 md:py-16">
        <div className="container-premium grid gap-8 lg:grid-cols-2">
          <div>
            <SectionTitle eyebrow="Included" title="What is usually included" />
            <BulletList
              emptyLabel="Planning support and local coordination"
              icon={<CheckCircle2 className="size-4" />}
              items={item.included}
            />
          </div>
          <div>
            <SectionTitle eyebrow="Notes" title="Useful things to know" />
            <BulletList
              emptyLabel="Comfortable shoes, sun protection, and water are recommended."
              icon={<XCircle className="size-4" />}
              items={item.excluded}
            />
          </div>
        </div>
      </section>

      <RelatedCards items={related} kind={kind} />
    </>
  );
}
