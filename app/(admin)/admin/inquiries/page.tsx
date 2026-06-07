import { InquiryStatusControl } from "@/components/admin/inquiry-status-control";
import { getAdminInquiries } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Inquiries",
};

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();

  return (
    <div>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
          Inquiries
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
          Inquiry management
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--color-gray-600)]">
          Review submitted inquiries and update sales status. Without a database, this page shows an
          empty state while public WhatsApp conversion remains active.
        </p>
      </div>

      <section className="mt-8 overflow-x-auto border border-[var(--color-gray-100)] bg-white p-4 shadow-sm">
        <table className="w-full min-w-[1080px] border-collapse text-left text-sm">
          <thead>
            <tr className="border-b border-[var(--color-gray-100)] text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
              <th className="py-3 pr-4">Date</th>
              <th className="py-3 pr-4">Name</th>
              <th className="py-3 pr-4">Email / Phone / WhatsApp</th>
              <th className="py-3 pr-4">Type</th>
              <th className="py-3 pr-4">Tour slug</th>
              <th className="py-3 pr-4">Travelers</th>
              <th className="py-3 pr-4">Status</th>
              <th className="py-3 pr-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length ? (
              inquiries.map((inquiry) => (
                <tr key={inquiry.id} className="border-b border-[var(--color-gray-100)] align-top">
                  <td className="py-4 pr-4">{inquiry.createdAt.toLocaleDateString("en-US")}</td>
                  <td className="py-4 pr-4 font-semibold text-[var(--color-navy)]">{inquiry.name}</td>
                  <td className="py-4 pr-4 text-[var(--color-gray-600)]">
                    {[inquiry.email, inquiry.phone, inquiry.whatsapp].filter(Boolean).join(" / ") || "-"}
                  </td>
                  <td className="py-4 pr-4">{inquiry.type}</td>
                  <td className="py-4 pr-4">{inquiry.tourSlug ?? "-"}</td>
                  <td className="py-4 pr-4">{inquiry.travelers ?? "-"}</td>
                  <td className="py-4 pr-4">
                    <InquiryStatusControl id={inquiry.id} status={inquiry.status} />
                  </td>
                  <td className="py-4 pr-4">
                    <details>
                      <summary className="cursor-pointer font-bold text-[var(--color-gold)]">
                        Details
                      </summary>
                      <div className="mt-3 max-w-md space-y-2 bg-[var(--color-gray-50)] p-4 text-xs leading-6 text-[var(--color-gray-600)]">
                        <p>Message: {inquiry.message ?? "-"}</p>
                        <p>Destinations: {inquiry.destinations.length ? inquiry.destinations.join(", ") : "-"}</p>
                        <p>Dates: {inquiry.arrivalDate?.toLocaleDateString("en-US") ?? "-"} to {inquiry.departureDate?.toLocaleDateString("en-US") ?? "-"}</p>
                        <p>Budget: {inquiry.budgetRange ?? "-"}</p>
                        <p>Hotel: {inquiry.hotelCategory ?? "-"}</p>
                        <p>Nationality: {inquiry.nationality ?? "-"}</p>
                      </div>
                    </details>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="py-8 text-[var(--color-gray-600)]" colSpan={8}>
                  No inquiries found. Connect a database and submit a public form to populate this
                  table.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </section>
    </div>
  );
}
