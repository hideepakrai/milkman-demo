export default function AdminLoading() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div
            key={index}
            className="admin-panel h-28 animate-pulse rounded-[28px]"
          />
        ))}
      </div>
      <div className="admin-panel h-64 animate-pulse rounded-[28px]" />
    </div>
  );
}
