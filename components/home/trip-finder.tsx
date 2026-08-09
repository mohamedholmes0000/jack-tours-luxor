"use client";

import {
  ArrowRightLeft,
  Clock3,
  MapPin,
  Navigation,
  Search,
  Star,
  Tag,
  X,
  type LucideIcon,
} from "lucide-react";
import { useEffect, useId, useMemo, useRef, useState } from "react";

const tabs = ["Tours", "Transportation", "Accommodation"] as const;
type Tab = (typeof tabs)[number];
type Option = { label: string; value: string };

function SelectionField({
  icon: Icon,
  label,
  onChange,
  options,
  placeholder,
  value,
  disabled = false,
}: {
  icon: LucideIcon;
  label: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder: string;
  value: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const selected = options.find((option) => option.value === value);

  useEffect(() => {
    if (!open) return;

    panelRef.current?.querySelector<HTMLButtonElement>("[role='option']")?.focus();

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  function closeAndRestoreFocus() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="relative min-w-0 bg-white">
      <button
        ref={triggerRef}
        type="button"
        aria-controls={panelId}
        aria-expanded={open}
        aria-haspopup="listbox"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        className="group flex min-h-[92px] w-full items-center gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-[var(--color-ivory)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-dark)] disabled:cursor-not-allowed disabled:opacity-45 md:px-7"
      >
        <Icon aria-hidden="true" className="size-6 shrink-0 text-[var(--color-navy)]" strokeWidth={1.9} />
        <span className="min-w-0">
          <span className="block text-[0.92rem] font-semibold text-[var(--color-navy)]">{label}</span>
          <span className="mt-1 block truncate text-sm text-[var(--color-navy)]/58">
            {selected?.label ?? placeholder}
          </span>
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label={`Close ${label} options`}
            className="fixed inset-0 z-[80] cursor-default bg-[rgb(6_17_31_/_42%)] backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
            onClick={closeAndRestoreFocus}
          />
          <div
            ref={panelRef}
            data-trip-finder-sheet="true"
            id={panelId}
            role="listbox"
            aria-label={label}
            className="fixed inset-x-3 bottom-3 z-[90] max-h-[min(68dvh,30rem)] overflow-y-auto rounded-[1.25rem] bg-white p-3 shadow-[0_28px_70px_rgb(6_17_31_/_30%)] md:absolute md:inset-x-4 md:bottom-auto md:top-[calc(100%+0.55rem)] md:max-h-72 md:min-w-[15rem] md:rounded-xl md:border md:border-[rgb(6_17_31_/_10%)] md:p-2"
          >
            <div className="mb-2 flex min-h-11 items-center justify-between border-b border-[rgb(6_17_31_/_9%)] px-2 md:hidden">
              <p className="font-serif text-xl font-semibold text-[var(--color-navy)]">{label}</p>
              <button
                type="button"
                aria-label={`Close ${label} options`}
                onClick={closeAndRestoreFocus}
                className="grid size-11 place-items-center text-[var(--color-navy)]/64"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>
            {options.map((option) => (
              <button
                key={option.value}
                type="button"
                role="option"
                aria-selected={option.value === value}
                onClick={() => {
                  onChange(option.value);
                  closeAndRestoreFocus();
                }}
                className={`flex min-h-12 w-full items-center rounded-lg px-4 py-3 text-left text-sm outline-none transition-colors focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-dark)] ${
                  option.value === value
                    ? "bg-[var(--color-navy)] font-semibold text-white"
                    : "text-[var(--color-navy)] hover:bg-[var(--color-ivory)]"
                }`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </>
      ) : null}
    </div>
  );
}

function RangeField({
  icon: Icon,
  label,
  max,
  min,
  onMaxChange,
  onMinChange,
  prefix = "",
  step = 1,
  suffix = "",
  valueMax,
  valueMin,
}: {
  icon: LucideIcon;
  label: string;
  max: number;
  min: number;
  onMaxChange: (value: number) => void;
  onMinChange: (value: number) => void;
  prefix?: string;
  step?: number;
  suffix?: string;
  valueMax: number;
  valueMin: number;
}) {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const triggerRef = useRef<HTMLButtonElement>(null);
  const minimumPercent = ((valueMin - min) / (max - min)) * 100;
  const maximumPercent = ((valueMax - min) / (max - min)) * 100;
  const summary = `${prefix}${valueMin} - ${prefix}${valueMax}${suffix}`;

  useEffect(() => {
    if (!open) return;

    function handleEscape(event: KeyboardEvent) {
      if (event.key !== "Escape") return;
      setOpen(false);
      window.requestAnimationFrame(() => triggerRef.current?.focus());
    }

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  function closeAndRestoreFocus() {
    setOpen(false);
    window.requestAnimationFrame(() => triggerRef.current?.focus());
  }

  return (
    <div className="relative min-w-0 bg-white">
      <button
        ref={triggerRef}
        type="button"
        aria-controls={panelId}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-[92px] w-full items-center gap-4 px-5 py-4 text-left outline-none transition-colors hover:bg-[var(--color-ivory)] focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--color-gold-dark)] md:px-7"
      >
        <Icon aria-hidden="true" className="size-6 shrink-0 text-[var(--color-navy)]" strokeWidth={1.9} />
        <span>
          <span className="block text-[0.92rem] font-semibold text-[var(--color-navy)]">{label}</span>
          <span className="mt-1 block text-sm text-[var(--color-navy)]/58">{summary}</span>
        </span>
      </button>

      {open ? (
        <>
          <button
            type="button"
            aria-label={`Close ${label} options`}
            className="fixed inset-0 z-[80] cursor-default bg-[rgb(6_17_31_/_42%)] backdrop-blur-[2px] md:bg-transparent md:backdrop-blur-none"
            onClick={closeAndRestoreFocus}
          />
          <div
            data-trip-finder-sheet="true"
            id={panelId}
            className="fixed inset-x-3 bottom-3 z-[90] rounded-[1.25rem] bg-white p-5 shadow-[0_28px_70px_rgb(6_17_31_/_30%)] md:absolute md:inset-x-4 md:bottom-auto md:top-[calc(100%+0.55rem)] md:min-w-[18rem] md:rounded-xl md:border md:border-[rgb(6_17_31_/_10%)]"
          >
            <div className="flex min-h-11 items-center justify-between border-b border-[rgb(6_17_31_/_9%)] pb-3 md:hidden">
              <p className="font-serif text-xl font-semibold text-[var(--color-navy)]">{label}</p>
              <button
                type="button"
                aria-label={`Close ${label} options`}
                onClick={closeAndRestoreFocus}
                className="grid size-11 place-items-center text-[var(--color-navy)]/64"
              >
                <X aria-hidden="true" className="size-5" />
              </button>
            </div>

            <div className="mt-5 space-y-3">
              <div className="flex items-center justify-between gap-4 text-sm font-semibold tabular-nums text-[var(--color-navy)]">
                <span className="min-w-0 rounded-md bg-[var(--color-ivory)] px-2.5 py-1.5">{prefix}{valueMin}</span>
                <span className="min-w-0 rounded-md bg-[var(--color-ivory)] px-2.5 py-1.5">{prefix}{valueMax}</span>
              </div>
              <div className="pt-1">
                <div
                  aria-hidden="true"
                  className="h-2 rounded-full"
                  style={{
                    background: `linear-gradient(to right, rgb(231 226 216) ${minimumPercent}%, var(--color-gold-dark) ${minimumPercent}%, var(--color-gold-dark) ${maximumPercent}%, rgb(231 226 216) ${maximumPercent}%)`,
                  }}
                />
                <div className="relative -mt-5 h-11">
                  <input
                    type="range"
                    aria-label={`Minimum ${label}`}
                    min={min}
                    max={max}
                    step={step}
                    value={valueMin}
                    onChange={(event) => onMinChange(Math.min(Number(event.target.value), valueMax - step))}
                    className="pointer-events-none absolute inset-x-0 top-2 h-8 w-full appearance-none bg-transparent [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:size-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:bg-[var(--color-gold-dark)] [&::-moz-range-track]:h-2 [&::-moz-range-track]:bg-transparent [&::-webkit-slider-runnable-track]:h-2 [&::-webkit-slider-runnable-track]:bg-transparent [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:size-5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:bg-[var(--color-gold-dark)]"
                  />
                  <input
                    type="range"
                    aria-label={`Maximum ${label}`}
                    min={min}
                    max={max}
                    step={step}
                    value={valueMax}
                    onChange={(event) => onMaxChange(Math.max(Number(event.target.value), valueMin + step))}
                    className="pointer-events-none absolute inset-x-0 top-2 h-8 w-full appearance-none bg-transparent accent-[var(--color-gold-dark)] [&::-moz-range-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:pointer-events-auto"
                  />
                </div>
              </div>
              <p className="text-right text-sm font-medium tabular-nums text-[var(--color-navy)]/62">{summary}</p>
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function SearchButton() {
  return (
    <div className="flex items-center bg-white p-4 lg:px-6">
      <button
        type="submit"
        className="inline-flex min-h-14 w-full items-center justify-center gap-2 rounded-full bg-[var(--color-navy)] px-7 text-sm font-semibold text-white outline-none transition-colors hover:bg-[var(--color-gold-dark)] focus-visible:ring-2 focus-visible:ring-[var(--color-gold-dark)] focus-visible:ring-offset-2 lg:min-w-[10rem]"
      >
        <Search aria-hidden="true" className="size-5" strokeWidth={2} />
        Search
      </button>
    </div>
  );
}

export function TripFinder({ destinations }: { destinations: string[] }) {
  const [tab, setTab] = useState<Tab>("Tours");
  const [destination, setDestination] = useState("");
  const [durationMin, setDurationMin] = useState(1);
  const [durationMax, setDurationMax] = useState(16);
  const [priceMin, setPriceMin] = useState(0);
  const [priceMax, setPriceMax] = useState(3000);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [location, setLocation] = useState("");
  const [hotelClass, setHotelClass] = useState("");

  const destinationOptions = useMemo<Option[]>(() => {
    const names = Array.from(new Set(destinations.map((item) => item.trim()).filter(Boolean)));
    return names.map((name) => ({ label: name, value: name }));
  }, [destinations]);

  return (
    <div className="container-premium relative z-20 -mt-8 sm:-mt-10 lg:-mt-12">
      <form
        action="/trip-planner"
        method="get"
        className="relative mx-auto max-w-6xl rounded-[1.35rem] border border-[rgb(6_17_31_/_9%)] bg-white shadow-[0_20px_46px_rgb(6_17_31_/_13%)] sm:rounded-[1.6rem]"
      >
        <input type="hidden" name="plannerType" value={tab.toLowerCase()} />

        <div
          className="grid grid-cols-3 rounded-t-[1.3rem] border-b border-[rgb(6_17_31_/_9%)] bg-[rgb(6_17_31_/_3%)] p-2 sm:rounded-t-[1.55rem] md:gap-2 md:p-3"
          role="tablist"
          aria-label="Trip finder"
        >
          {tabs.map((item) => (
            <button
              key={item}
              type="button"
              role="tab"
              aria-selected={tab === item}
              onClick={() => setTab(item)}
              className={`min-h-12 rounded-xl px-1.5 py-2 text-[0.68rem] font-semibold outline-none transition-colors focus-visible:ring-2 focus-visible:ring-[var(--color-gold-dark)] sm:text-sm md:px-4 md:text-base ${
                tab === item
                  ? "bg-[var(--color-navy)] text-white"
                  : "text-[var(--color-navy)]/58 hover:bg-white hover:text-[var(--color-navy)]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {tab === "Tours" ? (
          <div className="grid gap-px rounded-b-[1.3rem] bg-[rgb(6_17_31_/_9%)] sm:rounded-b-[1.55rem] lg:grid-cols-[1.15fr_1fr_1fr_auto]">
            <input type="hidden" name="destination" value={destination} />
            <input type="hidden" name="durationMin" value={durationMin} />
            <input type="hidden" name="durationMax" value={durationMax} />
            <input type="hidden" name="priceMin" value={priceMin} />
            <input type="hidden" name="priceMax" value={priceMax} />
            <SelectionField icon={MapPin} label="Destination" onChange={setDestination} options={destinationOptions} placeholder="Search a Place" value={destination} />
            <RangeField icon={Clock3} label="Duration" min={1} max={16} onMinChange={setDurationMin} onMaxChange={setDurationMax} suffix=" Days" valueMin={durationMin} valueMax={durationMax} />
            <RangeField icon={Tag} label="Price" min={0} max={3000} step={50} onMinChange={setPriceMin} onMaxChange={setPriceMax} prefix="$" valueMin={priceMin} valueMax={priceMax} />
            <SearchButton />
          </div>
        ) : null}

        {tab === "Transportation" ? (
          <div className="grid gap-px rounded-b-[1.3rem] bg-[rgb(6_17_31_/_9%)] sm:rounded-b-[1.55rem] lg:grid-cols-[1fr_1fr_auto]">
            <input type="hidden" name="from" value={from} />
            <input type="hidden" name="to" value={to} />
            <SelectionField icon={Navigation} label="From" onChange={setFrom} options={destinationOptions} placeholder="Pickup Location" value={from} />
            <SelectionField
              icon={ArrowRightLeft}
              label="To"
              onChange={setTo}
              options={destinationOptions}
              placeholder={from ? "Select Destination" : "Select a pickup location first"}
              value={to}
              disabled={!from}
            />
            <SearchButton />
          </div>
        ) : null}

        {tab === "Accommodation" ? (
          <div className="grid gap-px rounded-b-[1.3rem] bg-[rgb(6_17_31_/_9%)] sm:rounded-b-[1.55rem] lg:grid-cols-[1fr_1fr_auto]">
            <input type="hidden" name="location" value={location} />
            <input type="hidden" name="class" value={hotelClass} />
            <SelectionField icon={MapPin} label="Location" onChange={setLocation} options={destinationOptions} placeholder="Search a Place" value={location} />
            <SelectionField
              icon={Star}
              label="Class"
              onChange={setHotelClass}
              options={[
                { label: "All Classes", value: "all" },
                { label: "4 Star", value: "4-star" },
                { label: "5 Star", value: "5-star" },
                { label: "Deluxe", value: "deluxe" },
              ]}
              placeholder="All Classes"
              value={hotelClass}
            />
            <SearchButton />
          </div>
        ) : null}
      </form>
    </div>
  );
}