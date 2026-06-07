import Link from "next/link";
import { getAdminSummary } from "@/lib/data/admin";

export const metadata = {
  title: "Admin Dashboard",
};

export default async function AdminDashboardPage() {
  const summary = await getAdminSummary();
  const cards = [
    ["Tours", summary.tourCount],
    ["Destinations", summary.destinationCount],
    ["Blog posts", summary.blogPostCount],
    ["New inquiries", summary.newInquiryCount],
  ];

  return (
    <div>
      <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">
            Dashboard
          </p>
          <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
            Admin overview
          </h1>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row">
          <Link className="btn-primary" href="/admin/tours">
            Add Tour
          </Link>
          <Link className="btn-secondary" href="/admin/blog">
            Add Blog Post
          </Link>
          <Link className="btn-secondary" href="/admin/inquiries">
            View Inquiries
          </Link>
        </div>
      </div>

      <div className="mt-8 grid gap-5 md:grid-cols-4">
        {cards.map(([label, value]) => (
          <div key={label} className="border border-[var(--color-gray-100)] bg-white p-6 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
              {label}
            </p>
            <p className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">
              {value}
            </p>
          </div>
        ))}
      </div>

      <section className="mt-10 border border-[var(--color-gray-100)] bg-white p-6 shadow-sm">
        <h2 className="font-serif text-3xl font-semibold text-[var(--color-navy)]">
          Recent inquiries
        </h2>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[680px] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-[var(--color-gray-100)] text-xs uppercase tracking-[0.14em] text-[var(--color-gray-600)]">
                <th className="py-3 pr-4">Name</th>
                <th className="py-3 pr-4">Contact</th>
                <th className="py-3 pr-4">Type</th>
                <th className="py-3 pr-4">Status</th>
                <th className="py-3 pr-4">Created</th>
              </tr>
            </thead>
            <tbody>
              {summary.recentInquiries.length ? (
                summary.recentInquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="border-b border-[var(--color-gray-100)]">
                    <td className="py-4 pr-4 font-semibold text-[var(--color-navy)]">{inquiry.name}</td>
                    <td className="py-4 pr-4 text-[var(--color-gray-600)]">
                      {inquiry.email ?? inquiry.whatsapp ?? inquiry.phone ?? "-"}
                    </td>
                    <td className="py-4 pr-4">{inquiry.type}</td>
                    <td className="py-4 pr-4">{inquiry.status}</td>
                    <td className="py-4 pr-4">{inquiry.createdAt.toLocaleDateString("en-US")}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="py-5 text-[var(--color-gray-600)]" colSpan={5}>
                    No inquiries yet. Once forms post to the API with a database connected, recent
                    inquiries will appear here.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
