import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import type { SafetySignal } from '@/types/safety';
import Link from 'next/link';

export default function SavedCheckCard({ check }: { check: { id: string; city: string; area: string; signal: SafetySignal; savedAt: Date } }) {
  const colors = { green: 'bg-green-500', yellow: 'bg-yellow-500', red: 'bg-red-500' };
  return (
    <Link href={`/safety-checker/saved/${check.id}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardContent className="flex items-center justify-between p-4">
          <div>
            <p className="font-semibold">{check.area}, {check.city}</p>
            <p className="text-sm text-muted-foreground">{check.savedAt ? format(new Date(check.savedAt), 'MMM dd, yyyy') : ''}</p>
          </div>
          <div className={colors[check.signal] + ' w-3 h-3 rounded-full'} />
        </CardContent>
      </Card>
    </Link>
  );
}
