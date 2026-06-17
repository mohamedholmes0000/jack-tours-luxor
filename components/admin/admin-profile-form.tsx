"use client";

import { FormEvent, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { FormField, inputClassName } from "@/components/forms/form-field";

type AdminProfileFormProps = {
  initialName: string;
  email: string;
  canEdit: boolean;
};

type ApiResult = {
  ok: boolean;
  message?: string;
  user?: {
    name: string;
    email: string;
  };
  emailChanged?: boolean;
};

function passwordScore(password: string) {
  let score = 0;
  if (password.length >= 8) score += 1;
  if (/[A-Za-z]/.test(password)) score += 1;
  if (/\d/.test(password)) score += 1;
  if (/[^A-Za-z0-9]/.test(password)) score += 1;
  return score;
}

export function AdminProfileForm({ initialName, email, canEdit }: AdminProfileFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [profileEmail, setProfileEmail] = useState(email);
  const [emailCurrentPassword, setEmailCurrentPassword] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showEmailFields, setShowEmailFields] = useState(false);
  const [showPasswordFields, setShowPasswordFields] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);
  const score = passwordScore(newPassword);
  const strengthLabel = useMemo(() => {
    if (!newPassword) return "Not started";
    if (score <= 1) return "Weak";
    if (score === 2) return "Fair";
    if (score === 3) return "Good";
    return "Strong";
  }, [newPassword, score]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSaving(true);
    setResult(null);

    try {
      const response = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email: showEmailFields ? profileEmail : email,
          emailCurrentPassword: showEmailFields ? emailCurrentPassword : "",
          currentPassword: showPasswordFields ? currentPassword : "",
          newPassword: showPasswordFields ? newPassword : "",
          confirmPassword: showPasswordFields ? confirmPassword : "",
        }),
      });
      const data = (await response.json().catch(() => null)) as ApiResult | null;

      if (!response.ok || !data?.ok) {
        setResult({ ok: false, message: data?.message || "Profile could not be saved." });
        return;
      }

      setResult({ ok: true, message: "Profile saved successfully." });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setEmailCurrentPassword("");
      setShowPasswordFields(false);
      setShowEmailFields(false);
      if (data.user?.name) setName(data.user.name);
      if (data.user?.email) setProfileEmail(data.user.email);
      if (data.emailChanged) {
        setResult({ ok: true, message: "Email updated. Please sign in again with the new email." });
        await signOut({ callbackUrl: "/admin/login" });
        return;
      }
      router.refresh();
    } catch {
      setResult({ ok: false, message: "Profile could not be saved." });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 rounded-2xl border border-[rgb(214_173_84_/_22%)] bg-white p-5 shadow-sm md:p-7">
      <div className="grid gap-5 md:grid-cols-2">
        <FormField label="Name">
          <input
            className={inputClassName}
            disabled={!canEdit || isSaving}
            minLength={2}
            onChange={(event) => setName(event.target.value)}
            required
            type="text"
            value={name}
          />
        </FormField>
        <FormField label="Email">
          <input className={`${inputClassName} cursor-not-allowed opacity-70`} disabled type="email" value={profileEmail} />
        </FormField>
      </div>

      <div className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-navy)]">Email</p>
            <p className="mt-1 text-sm text-[var(--color-gray-600)]">
              Changing your email will require you to login with the new email next time.
            </p>
          </div>
          <button
            type="button"
            disabled={!canEdit || isSaving}
            onClick={() => {
              setShowEmailFields((value) => !value);
              setProfileEmail(email);
              setEmailCurrentPassword("");
            }}
            className="border border-[rgb(214_173_84_/_34%)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showEmailFields ? "Cancel" : "Change Email"}
          </button>
        </div>

        {showEmailFields ? (
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <FormField label="New email">
              <input
                autoComplete="email"
                className={inputClassName}
                disabled={!canEdit || isSaving}
                onChange={(event) => setProfileEmail(event.target.value)}
                type="email"
                value={profileEmail}
              />
            </FormField>
            <FormField label="Current password">
              <input
                autoComplete="current-password"
                className={inputClassName}
                disabled={!canEdit || isSaving}
                onChange={(event) => setEmailCurrentPassword(event.target.value)}
                type="password"
                value={emailCurrentPassword}
              />
            </FormField>
          </div>
        ) : null}
      </div>

      <div className="rounded-xl border border-[var(--color-gray-100)] bg-[var(--color-gray-50)] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[var(--color-navy)]">Password</p>
            <p className="mt-1 text-sm text-[var(--color-gray-600)]">
              Changing your password requires the current password first.
            </p>
          </div>
          <button
            type="button"
            disabled={!canEdit || isSaving}
            onClick={() => {
              setShowPasswordFields((value) => !value);
              setCurrentPassword("");
              setNewPassword("");
              setConfirmPassword("");
            }}
            className="border border-[rgb(214_173_84_/_34%)] px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-navy)] transition hover:border-[var(--color-gold)] hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
          >
            {showPasswordFields ? "Cancel" : "Change Password"}
          </button>
        </div>

        {showPasswordFields ? (
          <div className="mt-5 grid gap-5 md:grid-cols-3">
            <FormField label="Current password">
              <input
                autoComplete="current-password"
                className={inputClassName}
                disabled={!canEdit || isSaving}
                onChange={(event) => setCurrentPassword(event.target.value)}
                type="password"
                value={currentPassword}
              />
            </FormField>
            <FormField label="New password">
              <input
                autoComplete="new-password"
                className={inputClassName}
                disabled={!canEdit || isSaving}
                onChange={(event) => setNewPassword(event.target.value)}
                type="password"
                value={newPassword}
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
                disabled={!canEdit || isSaving}
                onChange={(event) => setConfirmPassword(event.target.value)}
                type="password"
                value={confirmPassword}
              />
            </FormField>
          </div>
        ) : null}
      </div>

      {!canEdit ? (
        <p className="rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          This session is using the local development fallback login. Create or seed a database admin user to edit profile details.
        </p>
      ) : null}

      {result ? (
        <p
          className={`rounded-xl border p-4 text-sm font-semibold ${
            result.ok ? "border-emerald-200 bg-emerald-50 text-emerald-800" : "border-red-200 bg-red-50 text-red-800"
          }`}
        >
          {result.message}
        </p>
      ) : null}

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={!canEdit || isSaving}
          className="bg-[var(--color-navy)] px-6 py-3 text-sm font-bold uppercase tracking-[0.14em] text-white transition hover:bg-[var(--color-gold-dark)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSaving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </form>
  );
}
