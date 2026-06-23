import type { Metadata } from "next";
import Image from "next/image";
import { ContentCardGrid } from "@/components/content/content-card-grid";
import { getToursSafe } from "@/lib/data/public";

export const metadata: Metadata = {
  title: "Private Egypt Activities",
  description:
    "Browse private Egypt activities and curated experiences from Jack Egypt Tour.",
};

export default async function ActivitiesPage() {
  const activities = await getToursSafe("ACTIVITY");

  return (
    <>
      <section className="relative flex min-h-[220px] items-center justify-center overflow-hidden bg-[var(--color-navy)] text-center text-white">
        <Image
          src="/photos/karnak.jpg"
          alt="Egypt temple detail in warm light"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[rgba(6,17,31,0.55)]" />
        <div className="container-premium relative py-12">
          <p className="eyebrow text-[var(--color-gold-light)]">Curated experiences</p>
          <h1 className="mt-3 text-4xl font-bold leading-tight text-white">
            Private Egypt Activities
          </h1>
          <p className="mt-3 text-base text-white/70">
            {activities.length} {activities.length === 1 ? "activity" : "activities"} available
          </p>
        </div>
      </section>

      <ContentCardGrid emptyLabel="Activity" items={activities} />
    </>
  );
}
