import { ExternalLink } from 'lucide-react';
import type { SafetySource } from '@/types/safety';

export default function SafetySourcesList({ sources }: { sources: SafetySource[] }) {
  if (!sources?.length) return null;
  return (
    <div className="space-y-1">
      <h3 className="font-semibold text-sm">Sources</h3>
      {sources.map((s, i) => <a key={i} href={s.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-primary hover:underline"><ExternalLink className="h-3 w-3" />{s.title}</a>)}
    </div>
  );
}
