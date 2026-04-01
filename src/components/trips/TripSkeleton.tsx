export default function TripSkeleton() {
  return (
    <div className="rounded-lg border bg-card p-6 space-y-3">
      <div className="flex justify-between">
        <div className="skeleton-shimmer h-5 w-48 rounded" />
        <div className="skeleton-shimmer h-5 w-16 rounded-full" />
      </div>
      <div className="skeleton-shimmer h-4 w-32 rounded" />
      <div className="skeleton-shimmer h-4 w-40 rounded" />
      <div className="flex items-center gap-2 pt-2 border-t">
        <div className="skeleton-shimmer h-6 w-6 rounded-full" />
        <div className="skeleton-shimmer h-4 w-24 rounded" />
      </div>
    </div>
  );
}
