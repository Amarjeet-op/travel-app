export default function SafetySkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-4">
      <div className="skeleton-shimmer h-6 w-48 rounded" />
      <div className="skeleton-shimmer h-4 w-full rounded" />
      <div className="skeleton-shimmer h-4 w-3/4 rounded" />
      <div className="skeleton-shimmer h-4 w-5/6 rounded" />
      <div className="skeleton-shimmer h-24 w-full rounded" />
      <div className="skeleton-shimmer h-24 w-full rounded" />
    </div>
  );
}
