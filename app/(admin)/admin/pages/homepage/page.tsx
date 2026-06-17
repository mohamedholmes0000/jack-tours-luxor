import Link from "next/link";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminHomepageSettings } from "@/lib/data/admin";

export const metadata = { title: "Homepage Editor" };

export default async function AdminHomepageEditorPage() {
  const [currentUser, settings] = await Promise.all([getCurrentAdminUser(), getAdminHomepageSettings()]);
  const role = currentUser?.role || "VIEWER";
  const canEditPages = canWriteAdminResource(role, "pages", "update");

  return (
    <div>
      <div className="mb-6">
        <div className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--color-gray-600)]">
          <Link className="text-[var(--color-gold-dark)]" href="/admin">
            Admin
          </Link>
          <span>/</span>
          <span>Pages</span>
          <span>/</span>
          <span className="text-[var(--color-navy)]">Homepage</span>
        </div>
        <h1 className="mt-4 font-serif text-[32px] font-semibold leading-tight text-[var(--color-navy)]">
          Homepage Editor
        </h1>
        <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--color-navy)]/60">
          Phase C1 includes Hero, Why Us, and Final CTA controls. Public homepage rendering will be wired in Phase D.
        </p>
        {!canEditPages ? (
          <p className="mt-4 rounded-xl border border-[var(--color-gray-100)] bg-white p-4 text-sm text-[var(--color-gray-600)]">
            Your role is read-only here. Inputs are disabled and save buttons are hidden.
          </p>
        ) : null}
      </div>

      <HomepageEditor canEdit={canEditPages} initialValues={settings} />
    </div>
  );
}
