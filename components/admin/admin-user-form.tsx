"use client";

import { FormEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import type { AdminRole } from "@prisma/client";
import { roleDescriptions, roleLabels } from "@/lib/admin/permissions";
import { FormField, inputClassName } from "@/components/forms/form-field";

type AdminUserFormProps = {
  mode: "create" | "edit";
  id?: string;
  initialValues?: {
    name: string;
    email: string;
    role: AdminRole;
    active: boolean;
    createdAt?: string;
    lastLoginAt?: string | null;
  };
};

const roles: AdminRole[] = ["SUPER_ADMIN", "ADMIN", "EDITOR", "VIEWER"];

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function AdminUserForm({ mode, id, initialValues }: AdminUserFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialValues?.name || "");
  const [email, setEmail] = useState(initialValues?.email || "");
  const [role, setRole] = useState<AdminRole>(initialValues?.role || "ADMIN");
  const [active, setActive] = useState(initialValues?.active ?? true);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(mode === "create");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const score = passwordScore(password);
  const strengthLabel = useMemo(() => {
    if (!password) return "Not started";
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  }, [password, score]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);

    try {
      const response = await fetch(mode === "create" ? "/api/admin/users" : `/api/admin/users/${id}`, {
        method: mode === "create" ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          role,
          active,
          password: showPassword ? password : "",
          confirmPassword: showPassword ? confirmPassword : "",
        }),
      });
      const result = (await response.json().catch(() => null)) as { ok?: boolean; message?: string; id?: string } | null;

      if (!response.ok || !result?.ok) {
        setError(result?.message || "User could not be saved.");
        return;
      }

      setMessage("User saved.");
      setPassword("");
      setConfirmPassword("");
      setShowPassword(mode === "create");
      router.refresh();
      if (mode === "create" && result.id) router.push(`/admin/users/${result.id}`);
    } catch {
      setError("User could not be saved.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={submit} className="grid gap-6 rounded-2xl border border-[rgb(214_173_84_/_22%)] bg-white p-5 shadow-sm md:p-7">
      {mode === "edit" && initialValues ? (
        <div className="grid gap-4 rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-4 md:grid-cols-2">
          <p className="text-sm text-[var(--color-gray-600)]">
            Created: <span className="font-semibold text-[var(--color-navy)]">{initialValues.createdAt ? new Date(initialValues.createdAt).toLocaleString("en-US") : "Unknown"}</span>
          </p>
          <p className="text-sm text-[var(--color-gray-600)]">
            Last login: <span className="font-semibold text-[var(--color-navy)]">{initialValues.lastLoginAt ? new Date(initialValues.lastLoginAt).toLocaleString("en-US") : "Never"}</span>
          </p>
        </div>
      ) : null}

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Name">
          <input className={inputClassName} disabled={loading} minLength={2} onChange={(event) => setName(event.target.value)} required value={name} />
        </FormField>
        <FormField label="Email">
          <input
            className={`${inputClassName} ${mode === "edit" ? "cursor-not-allowed opacity-70" : ""}`}
            disabled={loading || mode === "edit"}
            onChange={(event) => setEmail(event.target.value)}
            required
            type="email"
            value={email}
          />
          {mode === "edit" ? <p className="mt-2 text-xs text-[var(--color-gray-600)]">Email is locked for existing login accounts.</p> : null}
        </FormField>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Role">
          <select className={inputClassName} disabled={loading} onChange={(event) => setRole(event.target.value as AdminRole)} value={role}>
            {roles.map((roleOption) => (
              <option key={roleOption} value={roleOption}>
                {roleLabels[roleOption]} - {roleDescriptions[roleOption]}
              </option>
            ))}
          </select>
        </FormField>
        <label className="flex min-h-12 items-center gap-3 border border-[rgb(214_173_84_/_28%)] bg-[rgba(255,250,240,0.86)] px-4 py-3">
          <input checked={active} disabled={loading} onChange={(event) => setActive(event.target.checked)} type="checkbox" />
          <span className="text-sm font-semibold text-[var(--color-navy)]">Active user</span>
        </label>
      </div>

      <div className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-navy)]">Password</p>
            <p className="mt-1 text-sm text-[var(--color-gray-600)]">
              {mode === "create" ? "A password is required for new users." : "Reveal the password fields only when changing this user's password."}
            </p>
          </div>
          {mode === "edit" ? (
            <button
              className="border border-[rgb(214_173_84_/_34%)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-white"
              disabled={loading}
              onClick={() => {
                setShowPassword((value) => !value);
                setPassword("");
                setConfirmPassword("");
              }}
              type="button"
            >
              {showPassword ? "Cancel" : "Change Password"}
            </button>
          ) : null}
        </div>

        {showPassword ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="Password">
              <input
                autoComplete="new-password"
                className={inputClassName}
                disabled={loading}
                onChange={(event) => setPassword(event.target.value)}
                required={mode === "create"}
                type="password"
                value={password}
              />
              <div className="mt-3">
                <div className="grid grid-cols-4 gap-1">
                  {[0, 1, 2, 3].map((item) => (
                    <span
                      key={item}
                      className={`h-1.5 rounded-full ${item < score ? "bg-[var(--color-gold)]" : "bg-[var(--color-gray-100)]"}`}
                    />
                  ))}
                </div>
                <p className="mt-2 text-xs text-[var(--color-gray-600)]">Strength: {strengthLabel}</p>
              </div>
            </FormField>
            <FormField label="Confirm password">
              <input
                autoComplete="new-password"
                className={inputClassName}
                disabled={loading}
                onChange={(event) => setConfirmPassword(event.target.value)}
                required={mode === "create"}
                type="password"
                value={confirmPassword}
              />
            </FormField>
          </div>
        ) : null}
      </div>

      {message ? <p className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-semibold text-emerald-800">{message}</p> : null}
      {error ? <p className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-800">{error}</p> : null}

      <div className="flex justify-end gap-3">
        <button className="btn-secondary" disabled={loading} onClick={() => router.push("/admin/users")} type="button">
          Cancel
        </button>
        <button className="btn-primary" disabled={loading} type="submit">
          {loading ? "Saving..." : "Save User"}
        </button>
      </div>
    </form>
  );
}
