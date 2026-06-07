import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminLoginForm } from "@/components/admin/admin-login-form";

export const metadata: Metadata = {
  title: "Admin Login",
};

export default function AdminLoginPage() {
  return (
    <section className="min-h-screen bg-[var(--color-navy)] px-4 py-16 text-white">
      <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1fr_420px] lg:items-center">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.24em] text-[var(--color-gold-light)]">
            Admin CMS
          </p>
          <h1 className="mt-5 font-serif text-5xl font-semibold leading-tight md:text-7xl">
            Manage the Jack Tours Luxor MVP.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-8 text-white/72">
            This first admin slice includes authentication, dashboard metrics, and the tours list.
          </p>
        </div>
        <Suspense>
          <AdminLoginForm />
        </Suspense>
      </div>
    </section>
  );
}
