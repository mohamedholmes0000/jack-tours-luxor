"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { Home } from "lucide-react";
import type { AdminRole } from "@prisma/client";
import { canAccessAdminResource, roleLabels, type AdminResource } from "@/lib/admin/permissions";

const links = [
  { href: "/admin", label: "Dashboard", resource: "dashboard" },
  { href: "/admin/tours", label: "Tours", resource: "tours" },
  { href: "/admin/activities", label: "Activities", resource: "tours" },
  { href: "/admin/hotels", label: "Hotels", resource: "tours" },
  { href: "/admin/destinations", label: "Destinations", resource: "destinations" },
  { href: "/admin/blog", label: "Blog", resource: "blog" },
  { href: "/admin/gallery", label: "Gallery", resource: "gallery" },
  { href: "/admin/faqs", label: "FAQs", resource: "faqs" },
  { href: "/admin/inquiries", label: "Inquiries", resource: "inquiries" },
  { href: "/admin/settings", label: "Settings", resource: "settings" },
] satisfies Array<{ href: string; label: string; resource: AdminResource }>;

type AdminSidebarUser = {
  name?: string | null;
  email?: string | null;
  role?: AdminRole | null;
};

function getInitials(name?: string | null, email?: string | null) {
  const source = name?.trim() || email?.split("@")[0] || "Admin";
  return source
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function LogOutIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <path d="M16 17l5-5-5-5" />
      <path d="M21 12H9" />
    </svg>
  );
}

function UserIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M20 21a8 8 0 0 0-16 0" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function UsersIcon() {
  return (
    <svg
      aria-hidden="true"
      className="h-4 w-4"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="2"
      viewBox="0 0 24 24"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

export function AdminSidebar({ user }: { user?: AdminSidebarUser }) {
  const pathname = usePathname();
  const displayName = user?.name || "Admin user";
  const email = user?.email || "Signed in";
  const role = user?.role || "ADMIN";
  const profileActive = pathname === "/admin/profile";
  const usersActive = pathname === "/admin/users" || pathname.startsWith("/admin/users/");
  const homepageActive = pathname === "/admin/pages/homepage";
  const contactPageActive = pathname === "/admin/pages/contact";
  const canAccessPages = canAccessAdminResource(role, "pages");
  const visibleLinks = links.filter((link) => canAccessAdminResource(role, link.resource));

  return (
    <aside className="flex flex-col border-r border-[var(--color-gray-100)] bg-white p-5 lg:min-h-screen">
      <Link href="/admin" className="block">
        <span className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
          Jack Egypt Tour
        </span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          Admin CMS
        </span>
      </Link>
      <nav className="mt-8 grid gap-2">
        {canAccessPages ? (
          <div className="mb-2">
            <p className="mb-2 px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-600)]">
              Pages
            </p>
            <Link
              href="/admin/pages/homepage"
              aria-current={homepageActive ? "page" : undefined}
              className={`flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition ${
                homepageActive
                  ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
                  : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
              }`}
            >
              <Home className="h-4 w-4" />
              Homepage
            </Link>
            <Link
              href="/admin/pages/contact"
              aria-current={contactPageActive ? "page" : undefined}
              className={`mt-2 flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition ${
                contactPageActive
                  ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
                  : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
              }`}
            >
              Contact Page
            </Link>
          </div>
        ) : null}
        {visibleLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            className={`border px-4 py-3 text-sm font-semibold transition ${
              pathname === link.href || (link.href !== "/admin" && pathname.startsWith(`${link.href}/`))
                ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
                : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
            }`}
          >
            {link.label}
          </Link>
        ))}
        {role === "SUPER_ADMIN" ? (
          <Link
            href="/admin/users"
            aria-current={usersActive ? "page" : undefined}
            className={`flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition ${
              usersActive
                ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
                : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
            }`}
          >
            <UsersIcon />
            Users
          </Link>
        ) : null}
      </nav>
      <div className="mt-8 border-t border-[var(--color-gray-100)] pt-5 lg:mt-auto">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[var(--color-sand)] text-xs font-bold uppercase tracking-[0.12em] text-[var(--color-navy)] ring-1 ring-[rgb(214_173_84_/_32%)]">
            {getInitials(displayName, email)}
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-[var(--color-navy)]">{displayName}</p>
            <p className="truncate text-xs text-[var(--color-gray-600)]">{email}</p>
          </div>
        </div>
        <span className="mt-3 inline-flex rounded-full border border-[rgb(214_173_84_/_28%)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-gold-dark)]">
          {roleLabels[role]}
        </span>
        <div className="mt-4 grid gap-2">
          <Link
            href="/admin/profile"
            aria-current={profileActive ? "page" : undefined}
            className={`flex items-center gap-2 border px-4 py-3 text-sm font-semibold transition ${
              profileActive
                ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
                : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
            }`}
          >
            <UserIcon />
            My Profile
          </Link>
          <button
            type="button"
            onClick={() => signOut({ callbackUrl: "/admin/login" })}
            className="flex items-center gap-2 border border-transparent px-4 py-3 text-left text-sm font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
          >
            <LogOutIcon />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
