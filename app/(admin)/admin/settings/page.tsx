import { hasConfiguredDatabase } from "@/lib/data/safe-db";
import { getAdminSettings } from "@/lib/data/admin";
import { SettingsForm } from "@/components/admin/simple-cms-forms";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import Link from "next/link";

export const metadata = { title: "Admin Settings" };

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  const currentUser = await getCurrentAdminUser();
  const canWriteSettings = canWriteAdminResource(currentUser?.role || "VIEWER", "settings", "update");
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Settings</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Site settings</h1>
      {!hasConfiguredDatabase() ? <p className="my-6 bg-[var(--color-sand)] p-4 text-sm text-[var(--color-gray-900)]">Settings require a configured database to save. Current values are fallback defaults.</p> : null}
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Link className="rounded-2xl border border-[rgb(214_173_84_/_28%)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-gold)]" href="/admin/settings/global">
          <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Global Settings</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">Site-wide contact info and social links.</p>
        </Link>
        <Link className="rounded-2xl border border-[rgb(214_173_84_/_28%)] bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--color-gold)]" href="/admin/settings/header-footer">
          <p className="font-serif text-2xl font-semibold text-[var(--color-navy)]">Header & Footer</p>
          <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">Logo text, nav links, footer columns, and copyright.</p>
        </Link>
      </div>
      <div className="mt-8">
        {canWriteSettings ? (
          <SettingsForm initialValues={settings} />
        ) : (
          <p className="border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">
            Your role can view settings but cannot edit them.
          </p>
        )}
      </div>
    </div>
  );
}
