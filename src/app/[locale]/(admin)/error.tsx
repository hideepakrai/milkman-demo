"use client";

export default function AdminErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] items-center justify-center p-6">
      <div className="admin-panel w-full max-w-md rounded-[28px] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--admin-danger-soft)] text-2xl">
          ⚠️
        </div>
        <h2 className="mt-4 text-lg font-bold text-[var(--admin-text)]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[var(--admin-muted)]">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="admin-primary-button mt-6 px-6 py-3 text-sm font-semibold"
        >
          Try again
        </button>
      </div>
    </div>
  );
}
