import Link from "next/link";
import { HeaderFooterSettingsForm } from "@/components/admin/header-footer-settings-form";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getHeaderFooterSafe } from "@/lib/data/settings";

export const metadata = { title: "Header & Footer" };

export default async function AdminHeaderFooterPage() {
  const [currentUser, settings] = await Promise.all([getCurrentAdminUser(), getHeaderFooterSafe()]);
  const canWriteSettings = canWriteAdminResource(currentUser?.role || "VIEWER", "settings", "update");

  return (
    <div>
      <Link className="text-sm font-bold text-[var(--color-gold-dark)]" href="/admin/settings">
        ← Back to Settings
      </Link>
      <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
        Header & Footer
      </h1>
      <p className="mt-2 text-sm text-[var(--color-navy)]/60">
        Control the public navigation, logo text, and footer content.
      </p>

      <div className="mt-8">
        {canWriteSettings ? (
          <HeaderFooterSettingsForm initialValues={settings} />
        ) : (
          <p className="rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 text-sm text-[var(--color-gray-600)]">
            Your role can view settings but cannot edit them.
          </p>
        )}
      </div>
    </div>
  );
}
