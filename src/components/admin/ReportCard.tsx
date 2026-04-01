import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatDistanceToNow } from 'date-fns';

export default function ReportCard({ report, onAction }: { report: any; onAction: (id: string, action: string) => void }) {
  const isSOS = report.type === 'sos';
  return (
    <Card className={isSOS ? 'border-red-500' : ''}>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge variant={isSOS ? 'destructive' : 'secondary'}>{isSOS ? '🚨 SOS' : 'Report'}</Badge>
            <Badge variant={report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : 'secondary'}>{report.status}</Badge>
          </div>
          <span className="text-xs text-muted-foreground">{report.createdAt?.toDate ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : ''}</span>
        </div>
        <p className="text-sm">{report.description}</p>
        {report.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" onClick={() => onAction(report.id, 'investigate')}>Investigate</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'resolve')}>Resolve</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'dismiss')}>Dismiss</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
