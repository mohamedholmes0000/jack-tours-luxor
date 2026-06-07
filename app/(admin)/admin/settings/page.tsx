import { hasConfiguredDatabase } from "@/lib/data/safe-db";
import { getAdminSettings } from "@/lib/data/admin";
import { SettingsForm } from "@/components/admin/simple-cms-forms";

export const metadata = { title: "Admin Settings" };

export default async function AdminSettingsPage() {
  const settings = await getAdminSettings();
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-gold)]">Settings</p>
      <h1 className="mt-3 font-serif text-5xl font-semibold text-[var(--color-navy)]">Site settings</h1>
      {!hasConfiguredDatabase() ? <p className="my-6 bg-[var(--color-sand)] p-4 text-sm text-[var(--color-gray-900)]">Settings require a configured database to save. Current values are fallback defaults.</p> : null}
      <div className="mt-8"><SettingsForm initialValues={settings} /></div>
    </div>
  );
}
