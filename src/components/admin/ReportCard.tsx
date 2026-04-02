import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Phone, User, UserPlus } from 'lucide-react';
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

        {(report.userName || report.userEmail) && (
          <div className="bg-muted/50 p-2 rounded-lg">
            <p className="font-semibold flex items-center gap-2">
              <User className="h-4 w-4" />
              {report.userName || 'Unknown User'}
            </p>
            <p className="text-sm text-muted-foreground">{report.userEmail || ''}</p>
          </div>
        )}

        {report.userPhone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Phone:</span>
            <span>{report.userPhone}</span>
          </div>
        )}

        {(report.emergencyContactName || report.emergencyContactPhone) && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-2 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400 text-sm">
              <UserPlus className="h-4 w-4" />
              Emergency Contact
            </p>
            <div className="mt-1 space-y-1 text-sm">
              <p><span className="font-medium">Name:</span> {report.emergencyContactName}</p>
              <p><span className="font-medium">Phone:</span> {report.emergencyContactPhone}</p>
              {report.emergencyContactRelation && (
                <p><span className="font-medium">Relation:</span> {report.emergencyContactRelation}</p>
              )}
            </div>
          </div>
        )}

        {report.description && (
          <p className="text-sm">{report.description}</p>
        )}

        {report.status === 'pending' && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" onClick={() => onAction(report.id, 'investigate')}>Investigate</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'resolve')}>Resolve</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'dismiss')}>Dismiss</Button>
          </div>
        )}

        {report.status === 'investigating' && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction(report.id, 'resolve')}>Mark Completed</Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'dismiss')}>Dismiss</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
