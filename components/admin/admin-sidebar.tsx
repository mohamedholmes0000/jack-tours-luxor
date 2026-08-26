"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { canAccessAdminResource, roleLabels, type AdminResource } from "@/lib/admin/permissions";

type AdminLink = {
  href: string;
  label: string;
  resource: AdminResource;
};

const primaryLinks = [
  { href: "/admin", label: "Dashboard", resource: "dashboard" },
  { href: "/admin/tours", label: "Tours", resource: "tours" },
  { href: "/admin/destinations", label: "Destinations", resource: "destinations" },
  { href: "/admin/pages/homepage", label: "Homepage", resource: "pages" },
  { href: "/admin/reviews", label: "Reviews", resource: "testimonials" },
  { href: "/admin/faqs", label: "FAQ", resource: "faqs" },
  { href: "/admin/settings", label: "Settings", resource: "settings" },
] satisfies AdminLink[];

const secondaryLinks = [
  { href: "/admin/activities", label: "Activities", resource: "tours" },
  { href: "/admin/hotels", label: "Hotels", resource: "tours" },
  { href: "/admin/blog", label: "Blog", resource: "blog" },
  { href: "/admin/gallery", label: "Gallery", resource: "gallery" },
  { href: "/admin/inquiries", label: "Inquiries", resource: "inquiries" },
  { href: "/admin/users", label: "Users", resource: "users" },
  { href: "/admin/profile", label: "Profile", resource: "profile" },
  { href: "/admin/pages/contact", label: "Contact Page", resource: "pages" },
] satisfies AdminLink[];

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

function isLinkActive(pathname: string, href: string) {
  if (href === "/admin") return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

function SidebarLink({ href, label, pathname }: AdminLink & { pathname: string }) {
  const active = isLinkActive(pathname, href);

  return (
    <Link
      href={href}
      aria-current={active ? "page" : undefined}
      className={`border px-4 py-3 text-sm font-semibold transition ${
        active
          ? "border-[var(--color-gold)] bg-[var(--color-sand)] text-[var(--color-navy)]"
          : "border-transparent text-[var(--color-navy)] hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
      }`}
    >
      {label}
    </Link>
  );
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

export function AdminSidebar({ user }: { user?: AdminSidebarUser }) {
  const pathname = usePathname();
  const displayName = user?.name || "Admin user";
  const email = user?.email || "Signed in";
  const role = user?.role || "ADMIN";
  const visiblePrimaryLinks = primaryLinks.filter((link) =>
    canAccessAdminResource(role, link.resource),
  );
  const visibleSecondaryLinks = secondaryLinks.filter((link) =>
    canAccessAdminResource(role, link.resource),
  );

  return (
    <aside className="flex flex-col border-r border-[var(--color-gray-100)] bg-white p-5 lg:min-h-screen">
      <Link href="/admin" className="block">
        <span className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
          Jack Luxor Tour
        </span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          Admin CMS
        </span>
      </Link>
      <nav aria-label="Admin navigation" className="mt-8 grid gap-6">
        <div className="grid gap-2">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-600)]">
            Manage website
          </p>
          {visiblePrimaryLinks.map((link) => (
            <SidebarLink key={link.href} {...link} pathname={pathname} />
          ))}
        </div>
        <div className="grid gap-2 border-t border-[var(--color-gray-100)] pt-5">
          <p className="px-4 text-[10px] font-bold uppercase tracking-[0.18em] text-[var(--color-gray-600)]">
            More
          </p>
          {visibleSecondaryLinks.map((link) => (
            <SidebarLink key={link.href} {...link} pathname={pathname} />
          ))}
        </div>
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
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/admin/login" })}
          className="mt-4 flex w-full items-center gap-2 border border-transparent px-4 py-3 text-left text-sm font-semibold text-[var(--color-navy)] transition hover:border-[var(--color-gray-100)] hover:bg-[var(--color-gray-50)]"
        >
          <LogOutIcon />
          Logout
        </button>
      </div>
    </aside>
  );
}
