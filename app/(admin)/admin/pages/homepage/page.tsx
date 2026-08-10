import Link from "next/link";
import { HomepageEditor } from "@/components/admin/homepage-editor";
import { canWriteAdminResource } from "@/lib/admin/permissions";
import { getCurrentAdminUser } from "@/lib/api/admin-guard";
import { getAdminHomepageSettings } from "@/lib/data/admin";

export const metadata = { title: "Homepage Editor" };

type HomepageSectionStatus = "Editable" | "Partially editable" | "Hardcoded" | "Legacy / inactive";

const homepageSections: Array<{
  description: string;
  href?: string;
  name: string;
  status: HomepageSectionStatus;
}> = [
  {
    description: "Core image, headline, CTA, visibility, secondary label, and trust copy are stored in homepage settings.",
    name: "Hero Slider",
    status: "Partially editable",
  },
  {
    description: "The current controls and ranges are defined in code. Destination options use public destination data.",
    name: "Trip Finder",
    status: "Hardcoded",
  },
  {
    description: "One Day and Multi Day copy is defined in code; suitable images are assisted by existing tour data.",
    name: "Experience Type Cards",
    status: "Hardcoded",
  },
  {
    description: "The section heading is editable. Card data is managed through Destination records with safe fallbacks.",
    href: "/admin/destinations",
    name: "Top Destinations",
    status: "Partially editable",
  },
  {
    description: "Card content comes from Tours, but the old Featured settings do not control this carousel.",
    href: "/admin/tours",
    name: "Promotional Tours",
    status: "Partially editable",
  },
  {
    description: "Main copy, primary CTA, and one image are editable through existing homepage settings.",
    name: "Customize Trip",
    status: "Partially editable",
  },
  {
    description: "The four planning steps and section presentation are currently defined in code.",
    name: "How It Works",
    status: "Hardcoded",
  },
  {
    description: "Main copy and CTA are editable. The redesigned trust points are currently defined in code.",
    name: "Why Jack",
    status: "Partially editable",
  },
  {
    description: "The section header is editable. Individual reviews need a future admin manager.",
    name: "Reviews Preview",
    status: "Partially editable",
  },
  {
    description: "FAQ items are managed in FAQ admin; homepage framing and preview count remain in code.",
    href: "/admin/faqs",
    name: "FAQ Preview",
    status: "Partially editable",
  },
  {
    description: "Main copy, visibility, and primary CTA are editable; background and secondary link are inactive.",
    name: "Final CTA",
    status: "Partially editable",
  },
];

function statusClassName(status: HomepageSectionStatus) {
  if (status === "Hardcoded") return "border-slate-200 bg-slate-50 text-slate-700";
  if (status === "Legacy / inactive") return "border-amber-200 bg-amber-50 text-amber-800";
  if (status === "Editable") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  return "border-blue-200 bg-blue-50 text-blue-800";
}

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
          Review the current homepage structure and edit only the settings that are connected to the live site.
        </p>
        {!canEditPages ? (
          <p className="mt-4 rounded-xl border border-[var(--color-gray-100)] bg-white p-4 text-sm text-[var(--color-gray-600)]">
            Your role is read-only here. Inputs are disabled and save buttons are hidden.
          </p>
        ) : null}
      </div>

      <section className="mb-8 rounded-2xl border border-[var(--color-gray-100)] bg-white p-5 shadow-sm">
        <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-gold)]">
              Current homepage map
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold text-[var(--color-navy)]">
              Section status
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-[var(--color-gray-600)]">
            Status labels describe the current implementation. Hardcoded sections are listed for clarity and are not new editing features.
          </p>
        </div>
        <div className="mt-5 grid gap-3 lg:grid-cols-2">
          {homepageSections.map((section) => (
            <div key={section.name} className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-ivory)] p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-semibold text-[var(--color-navy)]">{section.name}</h3>
                <span className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${statusClassName(section.status)}`}>
                  {section.status}
                </span>
              </div>
              <p className="mt-2 text-sm leading-6 text-[var(--color-gray-600)]">{section.description}</p>
              {section.href ? (
                <Link className="mt-3 inline-flex text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-gold-dark)]" href={section.href}>
                  Open manager →
                </Link>
              ) : null}
            </div>
          ))}
        </div>
      </section>

      <HomepageEditor canEdit={canEditPages} initialValues={settings} />
    </div>
  );
}
