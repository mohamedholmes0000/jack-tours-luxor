"use client";

import { usePathname } from "next/navigation";
import { FloatingWhatsApp } from "@/components/shared/floating-whatsapp";
import { Footer } from "@/components/layout/footer";
import { Navbar } from "@/components/layout/navbar";

export function SiteChrome({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  if (isAdminRoute) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      <Navbar />
      <main className="public-site flex-1">{children}</main>
      <Footer />
      <FloatingWhatsApp />
    </>
  );
}
