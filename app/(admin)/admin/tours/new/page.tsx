import Link from "next/link";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { AdminTourForm } from "@/components/admin/admin-tour-form";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = {
  title: "New Tour",
};

export default function NewTourPage() {
  const hasDb = hasConfiguredDatabase();

  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/tours">
          Back to tours
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Add tour
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Create a practical MVP tour record. Image uploads and rich editing are reserved for a
          later slice.
        </p>
      </div>
      {!hasDb ? <DatabaseNotice /> : null}
      <AdminTourForm mode="create" />
    </div>
  );
}
