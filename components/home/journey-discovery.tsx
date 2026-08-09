import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, Sun } from "lucide-react";

type JourneyDiscoveryProps = {
  oneDayImage: string;
  multiDayImage: string;
};

const oneDayHref = "/tours?journey=one-day";
const multiDayHref = "/tours?journey=multi-day";

export function JourneyDiscovery({
  oneDayImage,
  multiDayImage,
}: JourneyDiscoveryProps) {
  const oneDayVisual = oneDayImage || "/photos/luxor-temple.jpg";
  const multiDayVisual =
    multiDayImage && multiDayImage !== oneDayVisual
      ? multiDayImage
      : "/photos/felucca.jpg";

  return (
    <section
      aria-labelledby="journey-discovery-heading"
      className="container-premium pb-4 pt-10 sm:pb-5 sm:pt-12 lg:pt-14"
    >
      <header className="text-center">
        <p className="text-[0.68rem] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)] sm:text-xs">
          Explore Egypt Your Way
        </p>
        <h2
          id="journey-discovery-heading"
          className="mx-auto mt-2 max-w-4xl font-serif text-[2rem] font-semibold leading-[1.08] text-[var(--color-navy)] sm:text-[2.5rem] lg:text-[2.8rem]"
        >
          What type of experience are you looking for?
        </h2>
        <div
          aria-hidden="true"
          className="mx-auto mt-4 flex w-12 items-center justify-center"
        >
          <span className="h-px flex-1 bg-[var(--color-gold)]" />
          <span className="size-2 rounded-full border border-[var(--color-gold)] bg-[var(--color-ivory)]" />
          <span className="h-px flex-1 bg-[var(--color-gold)]" />
        </div>
      </header>

      <div className="mt-7 grid gap-5 md:grid-cols-2 lg:mt-8 lg:gap-6">
        <Link
          href={oneDayHref}
          aria-label="Explore One Day Tours"
          className="group block min-w-0 rounded-[1.65rem] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
        >
          <article className="relative isolate min-h-[23rem] overflow-hidden rounded-[1.65rem] bg-[#f8ead0] md:min-h-[15.5rem] lg:min-h-[16.5rem]">
            <Image
              src={oneDayVisual}
              alt="A private one-day tour experience in Egypt"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[70%_center] transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,247,230,0.08)_16%,rgba(255,241,215,0.96)_68%,rgba(255,241,215,0.99)_100%)] md:bg-[linear-gradient(90deg,rgba(255,247,230,0.98)_0%,rgba(255,241,215,0.9)_48%,rgba(255,241,215,0.05)_83%)]" />

            <div className="relative flex min-h-[23rem] flex-col justify-end p-6 md:min-h-[15.5rem] md:max-w-[72%] md:flex-row md:items-start md:justify-start md:gap-5 md:p-6 lg:min-h-[16.5rem] lg:max-w-[70%] lg:gap-6 lg:p-7">
              <span className="mb-4 inline-flex size-16 shrink-0 items-center justify-center self-start rounded-full bg-[var(--color-gold)] text-white shadow-[0_12px_30px_rgba(158,121,49,0.2)] md:mb-0 lg:size-[4.65rem]">
                <Sun aria-hidden="true" className="size-7 lg:size-8" strokeWidth={1.55} />
              </span>

              <div className="min-w-0 md:pt-2">
                <h3 className="font-serif text-[1.75rem] font-semibold leading-none text-[var(--color-navy)] lg:text-[1.95rem]">
                  One Day Tours
                </h3>
                <p className="mt-3 text-[0.84rem] leading-6 text-[var(--color-navy)]/72 lg:text-sm">
                  Perfect for travelers with limited time.
                  <br className="hidden lg:block" /> Explore Egypt&apos;s highlights in a single day.
                </p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-lg bg-[var(--color-navy)] px-5 py-3 text-[0.7rem] font-bold text-white shadow-[0_10px_25px_rgba(6,17,31,0.14)] transition-colors duration-300 group-hover:bg-[var(--color-navy-mid)] motion-reduce:transition-none lg:text-xs">
                  Explore One Day Tours
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
                    strokeWidth={1.8}
                  />
                </span>
              </div>
            </div>
          </article>
        </Link>

        <Link
          href={multiDayHref}
          aria-label="Explore Multi Day Tours"
          className="group block min-w-0 rounded-[1.65rem] outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)] focus-visible:ring-offset-4 focus-visible:ring-offset-white"
        >
          <article className="relative isolate min-h-[23rem] overflow-hidden rounded-[1.65rem] bg-[#d9e0ea] md:min-h-[15.5rem] lg:min-h-[16.5rem]">
            <Image
              src={multiDayVisual}
              alt="A private multi-day journey along the Nile"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover object-[65%_center] transition-transform duration-700 ease-out motion-safe:group-hover:scale-[1.035] motion-reduce:transition-none"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(225,230,238,0.06)_16%,rgba(218,224,234,0.96)_68%,rgba(218,224,234,0.99)_100%)] md:bg-[linear-gradient(90deg,rgba(218,224,234,0.98)_0%,rgba(218,224,234,0.88)_48%,rgba(218,224,234,0.03)_84%)]" />

            <div className="relative flex min-h-[23rem] flex-col justify-end p-6 md:min-h-[15.5rem] md:max-w-[72%] md:flex-row md:items-start md:justify-start md:gap-5 md:p-6 lg:min-h-[16.5rem] lg:max-w-[70%] lg:gap-6 lg:p-7">
              <span className="mb-4 inline-flex size-16 shrink-0 items-center justify-center self-start rounded-full bg-[var(--color-gold)] text-white shadow-[0_12px_30px_rgba(158,121,49,0.2)] md:mb-0 lg:size-[4.65rem]">
                <CalendarDays
                  aria-hidden="true"
                  className="size-7 lg:size-8"
                  strokeWidth={1.55}
                />
              </span>

              <div className="min-w-0 md:pt-2">
                <h3 className="font-serif text-[1.75rem] font-semibold leading-none text-[var(--color-navy)] lg:text-[1.95rem]">
                  Multi Day Journeys
                </h3>
                <p className="mt-3 text-[0.84rem] leading-6 text-[var(--color-navy)]/72 lg:text-sm">
                  Immersive journeys across Egypt.
                  <br className="hidden lg:block" /> Stay longer, experience more.
                </p>
                <span className="mt-4 inline-flex min-h-11 items-center gap-3 rounded-lg bg-[var(--color-navy)] px-5 py-3 text-[0.7rem] font-bold text-white shadow-[0_10px_25px_rgba(6,17,31,0.14)] transition-colors duration-300 group-hover:bg-[var(--color-navy-mid)] motion-reduce:transition-none lg:text-xs">
                  Explore Multi Day Tours
                  <ArrowRight
                    aria-hidden="true"
                    className="size-4 transition-transform duration-300 motion-safe:group-hover:translate-x-1 motion-reduce:transition-none"
                    strokeWidth={1.8}
                  />
                </span>
              </div>
            </div>
          </article>
        </Link>
      </div>
    </section>
  );
}