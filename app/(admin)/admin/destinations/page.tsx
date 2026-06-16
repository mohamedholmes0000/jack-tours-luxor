import Link from "next/link";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminDestinations } from "@/lib/data/admin";

export const metadata = { title: "Admin Destinations" };

const typeLabels = {
  CITY: "City",
  SITE: "Archaeological Site",
  COASTAL: "Coastal / Beach",
  RIVER_ROUTE: "River / Cruise Route",
} as const;

export default async function AdminDestinationsPage() {
  const destinations = await getAdminDestinations();
  const currentUser = await getCurrentAdminUser();
  const canWriteDestinations = canWriteAdminResource(currentUser?.role || "VIEWER", "destinations", "update");

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
          Destinations
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Destination metadata
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Edit the region, type, image, and overview used by the public destinations listing.
        </p>
      </div>

      <section className="mt-8 overflow-x-auto border border-[var(--color-gray-100)] bg-white p-4 shadow-sm">
        <table className="w-full min-w-[820px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-gray-100)] text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Region</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Published</th>
              <th className="py-3 pr-4">Updated</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((destination) => (
              <tr key={destination.id} className="border-b border-[var(--color-gray-100)]">
                <td className="py-4 pr-4 font-semibold text-[var(--color-navy)]">
                  {destination.name}
                </td>
                <td className="py-4 pr-4">{destination.region || "Unassigned"}</td>
                <td className="py-4 pr-4">{typeLabels[destination.type]}</td>
                <td className="py-4 pr-4">{destination.published ? "Yes" : "No"}</td>
                <td className="py-4 pr-4">{destination.updatedAt.toLocaleDateString("en-US")}</td>
                <td className="py-4 pr-4">
                  <div className="flex gap-3">
                    <Link className="text-sm font-bold text-[var(--color-gold)]" href={`/destinations/${destination.slug}`}>
                      View
                    </Link>
                    {canWriteDestinations ? (
                      <Link className="text-sm font-bold text-[var(--color-navy)]" href={`/admin/destinations/${destination.id}`}>
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
