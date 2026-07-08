import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentDetailPage } from "@/components/content/content-detail-page";
import { getToursSafe } from "@/lib/data/public";
import { getPublicSettings } from "@/lib/data/settings";

type ActivityDetailProps = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const activities = await getToursSafe("ACTIVITY");
  return activities.map((activity) => ({ slug: activity.slug }));
}

export async function generateMetadata({ params }: ActivityDetailProps): Promise<Metadata> {
  const { slug } = await params;
  const activities = await getToursSafe("ACTIVITY");
  const activity = activities.find((item) => item.slug === slug);

  if (!activity) {
    return {};
  }

  return {
    title: activity.title,
    description: activity.shortDescription,
  };
}

export default async function ActivityDetailPage({ params }: ActivityDetailProps) {
  const { slug } = await params;
  const [activities, settings] = await Promise.all([
    getToursSafe("ACTIVITY"),
    getPublicSettings(),
  ]);
  const activity = activities.find((item) => item.slug === slug);

  if (!activity || activity.contentType !== "ACTIVITY") {
    notFound();
  }

  return (
    <ContentDetailPage
      allItems={activities}
      item={activity}
      kind="ACTIVITY"
      whatsappNumber={settings.whatsappNumber}
    />
  );
}
