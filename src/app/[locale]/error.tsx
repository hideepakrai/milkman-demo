"use client";

export default function LocaleErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="app-shell-main">
      <div className="flex min-h-[60vh] items-center justify-center p-6">
        <div className="card w-full max-w-md rounded-[28px] p-8 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-2xl">
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
            className="mt-6 rounded-[18px] bg-[var(--brand)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--brand-ink)]"
          >
            Try again
          </button>
        </div>
      </div>
    </main>
  );
}
