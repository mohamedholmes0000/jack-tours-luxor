import Link from "next/link";
import { AdminTourForm } from "@/components/admin/admin-tour-form";
import { DatabaseNotice } from "@/components/admin/database-notice";
import { hasConfiguredDatabase } from "@/lib/data/safe-db";

export const metadata = {
  title: "New Activity",
};

export default function NewActivityPage() {
  const hasDb = hasConfiguredDatabase();

  return (
    <div>
      <div className="mb-8">
        <Link className="text-sm font-bold text-[var(--color-gold)]" href="/admin/activities">
          Back to activities
        </Link>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Add activity
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Create an activity card for the public Activities page and homepage Activity tab.
        </p>
      </div>
      {!hasDb ? <DatabaseNotice /> : null}
      <AdminTourForm mode="create" contentType="ACTIVITY" />
    </div>
  );
}
