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
  title: "Edit Tour",
};

export default async function EditTourPage({ params }: EditTourPageProps) {
  const { id } = await params;
  const tour = await getAdminTour(id);
  const hasDb = hasConfiguredDatabase();

  if (!tour) {
    notFound();
  }

  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/tours">
          Back to tours
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Edit tour
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Editing static fallback tours is visible in the form, but saving requires a configured
          database.
        </p>
      </div>
      {!hasDb ? <DatabaseNotice /> : null}
      <AdminTourForm mode="edit" id={id} initialValues={tour} />
    </div>
  );
}
