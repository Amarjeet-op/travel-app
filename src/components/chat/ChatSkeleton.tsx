export default function ChatSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {[...Array(5)].map((_, i) => (
        <div key={i} className={`flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
          <div className={`skeleton-shimmer h-10 rounded-lg ${i % 2 === 0 ? 'w-48' : 'w-32'}`} />
        </div>
      ))}
    </div>
  );
}
