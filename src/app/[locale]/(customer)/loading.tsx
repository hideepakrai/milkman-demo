export default function CustomerLoading() {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, index) => (
          <div key={index} className="card h-24 animate-pulse rounded-[24px]" />
        ))}
      </div>
      <div className="card h-64 animate-pulse rounded-[24px]" />
    </div>
  );
}
