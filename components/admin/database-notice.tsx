export function DatabaseNotice() {
  return (
    <div className="mb-6 border border-[var(--color-sand-dark)] bg-[var(--color-sand)] p-4 text-sm leading-7 text-[var(--color-gray-900)]">
      Database is not configured or is using the local placeholder. You can view fallback content,
      but saving, deleting, and status updates require a real PostgreSQL database such as Neon.
    </div>
  );
}
