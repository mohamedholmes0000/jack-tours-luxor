import Link from "next/link";
import { GlobalSettingsForm } from "@/components/admin/global-settings-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getGlobalSettingsSafe } from "@/lib/data/settings";

export const metadata = { title: "Global Settings" };

export default async function AdminGlobalSettingsPage() {
  const [currentUser, settings] = await Promise.all([getCurrentAdminUser(), getGlobalSettingsSafe()]);
  const canWriteSettings = canWriteAdminResource(currentUser?.role || "VIEWER", "settings", "update");

  return (
    <div>
      <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/settings">
        ← Back to Settings
      </Link>
      <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
        Global Settings
      </h1>
      <p className="mt-2 text-sm text-[var(--color-navy)]/60">
        Site-wide contact info and social links
      </p>

      <div className="mt-8">
        {canWriteSettings ? (
          <GlobalSettingsForm initialValues={settings} />
        ) : (
          <p className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">
            Your role can view settings but cannot edit them.
          </p>
        )}
      </div>
    </div>
  );
}
