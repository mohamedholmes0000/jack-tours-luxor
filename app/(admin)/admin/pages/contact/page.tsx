import Link from "next/link";
import { ContactMapSettingsForm } from "@/components/admin/contact-map-settings-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getContactMapSettingsSafe } from "@/lib/data/settings";

export const metadata = { title: "Contact Page" };

export default async function AdminContactPageSettingsPage() {
  const [currentUser, settings] = await Promise.all([getCurrentAdminUser(), getContactMapSettingsSafe()]);
  const canWritePages = canWriteAdminResource(currentUser?.role || "VIEWER", "pages", "update");

  return (
    <div>
      <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/pages/homepage">
        ← Back to Pages
      </Link>
      <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
        Contact Page
      </h1>
      <p className="mt-2 text-sm text-[var(--color-navy)]/60">
        Configure the public Google Map section.
      </p>

      <div className="mt-8">
        {canWritePages ? (
          <ContactMapSettingsForm initialValues={settings} />
        ) : (
          <p className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">
            Your role can view page settings but cannot edit them.
          </p>
        )}
      </div>
    </div>
  );
}
