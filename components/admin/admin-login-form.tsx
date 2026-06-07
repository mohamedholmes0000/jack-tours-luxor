"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { FormField, inputClassName } from "@/components/forms/form-field";

export function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("admin@jacktoursluxor.com");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: searchParams.get("callbackUrl") ?? "/admin",
    });

    setIsLoading(false);

    if (result?.error) {
      setError("Invalid admin credentials.");
      return;
    }

    router.push(result?.url ?? "/admin");
    router.refresh();
  }

  return (
    <form className="border border-[var(--color-gray-100)] bg-white p-6 shadow-xl" onSubmit={onSubmit}>
      <div className="grid gap-5">
        <FormField label="Email">
          <input
            className={inputClassName}
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </FormField>
        <FormField label="Password">
          <input
            className={inputClassName}
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
        </FormField>
      </div>
      {error ? <p className="mt-4 text-sm text-red-700">{error}</p> : null}
      <button className="btn-primary mt-6 w-full" type="submit" disabled={isLoading}>
        {isLoading ? "Signing in..." : "Sign In"}
      </button>
      <p className="mt-4 text-xs leading-6 text-[var(--color-gray-600)]">
        Development fallback uses the seeded admin email and password when no database is connected.
      </p>
    </form>
  );
}
