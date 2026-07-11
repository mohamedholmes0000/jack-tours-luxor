import { InquiryDeleteButton } from "@/components/admin/inquiry-delete-button";
import { InquiryStatusControl } from "@/components/admin/inquiry-status-control";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminInquiries } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Inquiries",
};

type AdminInquiry = Awaited<ReturnType<typeof getAdminInquiries>>[number];

function getMessageMetadata(message: string | null | undefined, label: string) {
  const prefix = `${label.toLowerCase()}:`;
  const line = message
    ?.split(/\r?\n/)
    .map((value) => value.trim())
    .find((value) => value.toLowerCase().startsWith(prefix));

  return line?.slice(label.length + 1).trim() || null;
}

function getCleanMessage(message: string | null | undefined) {
  const hiddenPrefixes = ["interests:", "approximate budget:"];
  const lines = message
    ?.split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !hiddenPrefixes.some((prefix) => line.toLowerCase().startsWith(prefix)));

  return lines?.join("\n") || null;
}

function formatDate(date?: Date | null) {
  return date?.toLocaleDateString("en-US") || null;
}

function buildInquiryDetails(inquiry: AdminInquiry) {
  const type = inquiry.type.toUpperCase();
  const details: Array<[string, string | number | null | undefined]> = [];
  const contact = [inquiry.phone, inquiry.whatsapp].filter(Boolean).join(" / ");

  if (type === "TRIP_PLANNER") {
    details.push(
      ["Message / notes", getCleanMessage(inquiry.message)],
      ["Destinations", inquiry.destinations.length ? inquiry.destinations.join(", ") : null],
      ["Interests", getMessageMetadata(inquiry.message, "Interests")],
      ["Arrival date", formatDate(inquiry.arrivalDate)],
      ["Departure date", formatDate(inquiry.departureDate)],
      ["Travelers", inquiry.travelers],
      ["Nationality", inquiry.nationality],
      ["Budget range", inquiry.budgetRange],
      ["Approximate budget", getMessageMetadata(inquiry.message, "Approximate budget")],
      ["Hotel preference", inquiry.hotelCategory],
      ["Phone / WhatsApp", contact || null],
      ["Email", inquiry.email],
    );
  } else if (type === "CONTACT" || type === "GENERAL") {
    details.push(
      ["Message", getCleanMessage(inquiry.message)],
      ["Name", inquiry.name],
      ["Email", inquiry.email],
      ["Phone / WhatsApp", contact || null],
    );
  } else {
    details.push(
      ["Related slug", inquiry.tourSlug],
      ["Message / details", getCleanMessage(inquiry.message)],
      ["Arrival date", formatDate(inquiry.arrivalDate)],
      ["Departure date", formatDate(inquiry.departureDate)],
      ["Travelers / guests", inquiry.travelers],
      ["Phone / WhatsApp", contact || null],
      ["Email", inquiry.email],
    );
  }

  return details.filter(([, value]) => value !== undefined && value !== null && String(value).trim());
}

export default async function AdminInquiriesPage() {
  const inquiries = await getAdminInquiries();
  const currentUser = await getCurrentAdminUser();
  const canWriteInquiries = canWriteAdminResource(currentUser?.role || "VIEWER", "inquiries", "update");
  const canDeleteInquiries = canWriteAdminResource(currentUser?.role || "VIEWER", "inquiries", "delete");

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
              inquiries.map((inquiry) => {
                const detailRows = buildInquiryDetails(inquiry);

                return (
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
                      <InquiryStatusControl id={inquiry.id} status={inquiry.status} canEdit={canWriteInquiries} />
                    </td>
                    <td className="py-4 pr-4">
                      <details>
                        <summary className="cursor-pointer font-bold text-[var(--color-gold)]">
                          Details
                        </summary>
                        <div className="mt-3 max-w-md space-y-2 bg-[var(--color-gray-50)] p-4 text-xs leading-6 text-[var(--color-gray-600)]">
                          {detailRows.length ? (
                            detailRows.map(([label, value]) => (
                              <p key={label} className="whitespace-pre-line">
                                <span className="font-bold text-[var(--color-navy)]">{label}:</span> {value}
                              </p>
                            ))
                          ) : (
                            <p>No extra details available.</p>
                          )}
                        </div>
                      </details>
                      <InquiryDeleteButton id={inquiry.id} canDelete={canDeleteInquiries} />
                    </td>
                  </tr>
                );
              })
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
