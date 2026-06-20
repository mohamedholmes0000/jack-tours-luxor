"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";
import type { PublicSettings } from "@/lib/data/settings";

export function SiteChrome({
  children,
  settings,
}: {
  children: React.ReactNode;
  settings: PublicSettings;
}) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");
  const isHomeRoute = pathname === "/";

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  if (isHomeRoute) {
    return (
      <>
        <div className="public-home-shell relative">
          <Navbar isHomeRoute settings={settings} />
          <main className="public-site public-site-home flex-1">{children}</main>
        </div>
        <Footer settings={settings} />
        <FloatingWhatsApp settings={settings} />
      </>
    );
  }

  return (
    <>
      <Navbar settings={settings} />
      <main className="public-site flex-1">{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
