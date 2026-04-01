import { cn } from '@/lib/utils/cn';
import type { SafetySignal } from '@/types/safety';

export default function SafetySignal({ signal, score }: { signal: SafetySignal; score: number }) {
  const colors = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  const labels = { green: 'Generally Safe', yellow: 'Exercise Caution', red: 'High Risk Area' };
  return (
    <div className="flex items-center gap-3">
      <div className={cn('w-4 h-4 rounded-full', colors[signal])} />
      <span className="font-semibold">{labels[signal]}</span>
      <span className="text-sm text-muted-foreground">Score: {score}/10</span>
    </div>
  );
}
