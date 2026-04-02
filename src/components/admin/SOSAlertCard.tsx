import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Clock, MapPin, Phone, User, UserPlus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import dynamic from 'next/dynamic';

const ReportMap = dynamic(() => import('./ReportMap'), { ssr: false, loading: () => <div className="h-32 bg-muted rounded-lg flex items-center justify-center text-muted-foreground">Loading map...</div> });

export default function SOSAlertCard({ report, onAction }: { report: any; onAction: (id: string, action: string) => void }) {
  return (
    <Card className="border-red-500 border-2">
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <Badge variant="destructive">SOS Alert</Badge>
            <Badge variant="warning">Urgent</Badge>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {report.createdAt?.toDate ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : ''}
          </div>
        </div>

        <div className="bg-red-50 dark:bg-red-900/20 p-3 rounded-lg">
          <p className="font-semibold flex items-center gap-2">
            <User className="h-4 w-4" />
            {report.userName || report.reporterName || 'Unknown User'}
          </p>
          <p className="text-sm text-muted-foreground">{report.userEmail || report.reporterEmail || ''}</p>
        </div>

        {report.userPhone && (
          <div className="flex items-center gap-2 text-sm">
            <Phone className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">User Phone:</span>
            <span>{report.userPhone}</span>
          </div>
        )}

        {(report.emergencyContactName || report.emergencyContactPhone) && (
          <div className="bg-orange-50 dark:bg-orange-900/20 p-3 rounded-lg border border-orange-200 dark:border-orange-800">
            <p className="font-semibold flex items-center gap-2 text-orange-700 dark:text-orange-400">
              <UserPlus className="h-4 w-4" />
              Emergency Contact
            </p>
            <div className="mt-2 space-y-1 text-sm">
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

        {report.location && (
          <div className="space-y-2">
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Location: {report.location.lat?.toFixed(4)}, {report.location.lng?.toFixed(4)}</span>
            </div>
            <ReportMap location={report.location} height="h-32" />
          </div>
        )}

        {report.status === 'pending' && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="destructive" onClick={() => onAction(report.id, 'investigate')}>
              Start Investigation
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'resolve')}>
              Mark Resolved
            </Button>
          </div>
        )}

        {report.status === 'investigating' && (
          <div className="flex flex-wrap gap-2">
            <Button size="sm" className="bg-green-600 hover:bg-green-700" onClick={() => onAction(report.id, 'resolve')}>
              Mark Completed
            </Button>
            <Button size="sm" variant="outline" onClick={() => onAction(report.id, 'dismiss')}>
              Dismiss
            </Button>
          </div>
        )}

        {report.status === 'resolved' && (
          <div className="flex items-center gap-2 text-green-600">
            <Badge variant="success">Completed</Badge>
            {report.resolvedAt?.toDate && (
              <span className="text-xs">
                Resolved {formatDistanceToNow(report.resolvedAt.toDate(), { addSuffix: true })}
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
