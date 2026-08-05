export default function AuthLoading() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[var(--bg)] p-4">
      <div className="w-full max-w-sm space-y-6">
        <div className="mx-auto h-16 w-16 animate-pulse rounded-2xl bg-[var(--brand-soft)]" />
        <div className="h-8 w-2/3 animate-pulse rounded-xl bg-[var(--border)] mx-auto" />
        <div className="h-6 w-1/2 animate-pulse rounded-xl bg-[var(--border)] mx-auto" />
        <div className="h-14 animate-pulse rounded-[18px] bg-[var(--border)]" />
        <div className="h-14 animate-pulse rounded-[18px] bg-[var(--border)]" />
        <div className="h-14 animate-pulse rounded-[18px] bg-[var(--brand-soft)]" />
      </div>
    </main>
  );
}
