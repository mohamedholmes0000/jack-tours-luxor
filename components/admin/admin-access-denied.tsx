import Link from "next/link";

export function AdminAccessDenied() {
  return (
    <div className="mx-auto max-w-2xl rounded-2xl border border-red-100 bg-white p-8 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-[0.18em] text-red-700">Access denied</p>
      <h1 className="mt-3 font-serif text-4xl font-semibold text-[var(--color-navy)]">You do not have access to this area.</h1>
      <p className="mt-4 text-sm leading-7 text-[var(--color-gray-600)]">
        This section is limited by your admin role. Use the dashboard or contact a Super Admin if you need more access.
      </p>
      <Link className="btn-primary mt-6 inline-flex" href="/admin">
        Back to Dashboard
      </Link>
    </div>
  );
}
