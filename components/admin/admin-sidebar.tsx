"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/tours", label: "Tours" },
  { href: "/admin/destinations", label: "Destinations" },
  { href: "/admin/blog", label: "Blog" },
  { href: "/admin/gallery", label: "Gallery" },
  { href: "/admin/faqs", label: "FAQs" },
  { href: "/admin/inquiries", label: "Inquiries" },
  { href: "/admin/settings", label: "Settings" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="border-r border-[var(--color-gray-100)] bg-white p-5 lg:min-h-screen">
      <Link href="/admin" className="block">
        <span className="font-serif text-2xl font-semibold text-[var(--color-navy)]">
          Jack Tours
        </span>
        <span className="mt-1 block text-xs font-bold uppercase tracking-[0.18em] text-[var(--color-gold)]">
          Admin CMS
        </span>
      </Link>
      <nav className="mt-8 grid gap-2">
        {links.map((link) => (
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
      </nav>
    </aside>
  );
}
