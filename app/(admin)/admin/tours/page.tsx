import Link from "next/link";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminTours } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Tours",
};

export default async function AdminToursPage() {
  const tours = await getAdminTours();
  const currentUser = await getCurrentAdminUser();
  const canWriteTours = canWriteAdminResource(currentUser?.role || "VIEWER", "tours", "update");

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Tours
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
            Tours list
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
            This slice lists tours only. Create and edit forms are placeholders for the next admin
            slice.
          </p>
        </div>
        {canWriteAdminResource(currentUser?.role || "VIEWER", "tours", "create") ? (
          <Link className="btn-primary" href="/admin/tours/new">
            Add Tour
          </Link>
        ) : null}
      </div>

      <section className="mt-8 overflow-x-auto border border-[var(--color-gray-100)] bg-white p-4 shadow-sm">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-gray-100)] text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
              <th className="py-3 pr-4">Title</th>
              <th className="py-3 pr-4">Category</th>
              <th className="py-3 pr-4">Price From</th>
              <th className="py-3 pr-4">Published</th>
              <th className="py-3 pr-4">Featured</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tours.map((tour) => (
              <tr key={tour.id} className="border-b border-[var(--color-gray-100)]">
                <td className="py-4 pr-4 font-semibold text-[var(--color-navy)]">{tour.title}</td>
                <td className="py-4 pr-4">{tour.category}</td>
                <td className="py-4 pr-4">
                  {tour.priceFrom ? `${tour.priceCurrency} ${tour.priceFrom.toLocaleString("en-US")}` : "Custom"}
                </td>
                <td className="py-4 pr-4">{tour.published ? "Yes" : "No"}</td>
                <td className="py-4 pr-4">{tour.featured ? "Yes" : "No"}</td>
                <td className="py-4 pr-4">
                  <div className="flex gap-3">
                    <Link className="text-sm font-bold text-[var(--color-gold)]" href={`/tours/${tour.slug}`}>
                      View
                    </Link>
                    {canWriteTours ? (
                      <Link className="text-sm font-bold text-[var(--color-navy)]" href={`/admin/tours/${tour.id}`}>
                        Edit
                      </Link>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
}
