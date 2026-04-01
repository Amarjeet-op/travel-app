import { formatDistanceToNow, format } from 'date-fns';
import { Badge } from '@/components/ui/badge';

const actionLabels: Record<string, string> = {
  'verify': 'Verified user account',
  'suspend': 'Suspended user account',
  'unsuspend': 'Reinstated user account',
  'make_admin': 'Promoted to admin',
  'remove_trip': 'Removed trip',
  'resolve_report': 'Resolved a report',
  'dismiss_report': 'Dismissed a report',
  'investigate_report': 'Started investigating a report',
  'review_feedback': 'Reviewed feedback',
  'update_user': 'Updated user profile',
  'delete_user': 'Deleted user',
};

const targetTypeLabels: Record<string, string> = {
  'user': 'User',
  'trip': 'Trip',
  'report': 'Report',
  'feedback': 'Feedback',
};

export default function AdminActionLog({ log }: { log: any }) {
  const actionLabel = actionLabels[log.action] || log.action.replace(/_/g, ' ').replace(/\b\w/g, (c: string) => c.toUpperCase());
  const targetLabel = targetTypeLabels[log.targetType] || log.targetType;
  
  const getActionBadgeVariant = (action: string) => {
    if (action.includes('verify') || action.includes('unsuspend')) return 'success';
    if (action.includes('suspend') || action.includes('remove') || action.includes('dismiss')) return 'destructive';
    if (action.includes('make_admin')) return 'default';
    return 'secondary';
  };
  
  return (
    <div className="flex items-start justify-between p-4 border rounded-lg hover:bg-muted/30 transition-colors">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center min-w-[60px]">
          <Badge variant={getActionBadgeVariant(log.action)} className="text-xs font-semibold">
            {actionLabel}
          </Badge>
        </div>
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{log.adminName || log.adminEmail}</span>
            <span className="text-xs text-muted-foreground">performed action on</span>
            <span className="text-sm font-medium">{targetLabel}</span>
            <span className="text-xs text-muted-foreground font-mono bg-muted px-1.5 py-0.5 rounded">{log.targetId?.slice(0, 8)}...</span>
          </div>
          {log.details && (
            <p className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
              <span className="italic">&quot;{log.details}&quot;</span>
            </p>
          )}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1">
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          {log.createdAt?.toDate ? formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true }) : ''}
        </span>
        <span className="text-[10px] text-muted-foreground/70">
          {log.createdAt?.toDate ? format(log.createdAt.toDate(), 'MMM dd, yyyy HH:mm') : ''}
        </span>
      </div>
    </div>
  );
}