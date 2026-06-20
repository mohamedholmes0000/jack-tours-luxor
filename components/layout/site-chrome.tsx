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

  return (
    <>
      <Navbar isHomeRoute={isHomeRoute} settings={settings} />
      <main className={`public-site flex-1 ${isHomeRoute ? "public-site-home" : ""}`}>{children}</main>
      <Footer settings={settings} />
      <FloatingWhatsApp settings={settings} />
    </>
  );
}
