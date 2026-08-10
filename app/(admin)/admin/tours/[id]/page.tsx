import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminTourForm } from "@/components/admin/admin-tour-form";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { getAdminTour } from "@/lib/data/admin";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

type EditTourPageProps = {
  params: Promise<{ id: string }>;
};

export const metadata = {
  title: "Edit Content",
};

function contentTypeLabel(contentType: "TOUR" | "ACTIVITY" | "HOTEL") {
  if (contentType === "ACTIVITY") return "activity";
  if (contentType === "HOTEL") return "hotel";
  return "tour";
}

function listHrefForContentType(contentType: "TOUR" | "ACTIVITY" | "HOTEL") {
  if (contentType === "ACTIVITY") return "/admin/activities";
  if (contentType === "HOTEL") return "/admin/hotels";
  return "/admin/tours";
}

export default async function EditTourPage({ params }: EditTourPageProps) {
  const { id } = await params;
  const tour = await getAdminTour(id);
  const hasDb = hasConfiguredDatabase();

  if (!tour) {
    notFound();
  }

  const label = contentTypeLabel(tour.contentType);
  const backHref = listHrefForContentType(tour.contentType);

  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-bold text-[var(--color-gold)]" href={backHref}>
          Back to {label === "activity" ? "activities" : `${label}s`}
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Edit {label}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Edit the saved {label} record. Changes are available to the public site after saving.
        </p>
      </div>
      {!hasDb ? <DatabaseNotice /> : null}
      <AdminTourForm mode="edit" id={id} initialValues={tour} returnHref={backHref} />
    </div>
  );
}
