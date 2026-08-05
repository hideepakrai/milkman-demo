"use client";

export default function AuthErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <div className="w-full max-w-sm rounded-[28px] border border-[var(--border)] bg-[var(--surface)] p-8 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-2xl">
          ⚠️
        </div>
        <h2 className="mt-4 text-lg font-bold text-[var(--ink-900)]">
          Something went wrong
        </h2>
        <p className="mt-2 text-sm text-[var(--ink-400)]">
          {error.message || "An unexpected error occurred while loading this page."}
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-6 w-full rounded-[18px] bg-[var(--brand)] py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-ink)]"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
