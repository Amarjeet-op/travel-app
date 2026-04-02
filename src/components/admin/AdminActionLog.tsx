import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { User, MapPin, FileText, MessageSquare, AlertTriangle, CheckCircle, XCircle, Shield, Eye, Siren } from 'lucide-react';

const actionConfig: Record<string, { label: string; icon: any; variant: 'success' | 'destructive' | 'default' | 'secondary' }> = {
  'verify': { label: 'Verified', icon: CheckCircle, variant: 'success' },
  'verify_user': { label: 'Verified', icon: CheckCircle, variant: 'success' },
  'suspend': { label: 'Suspended', icon: XCircle, variant: 'destructive' },
  'suspend_user': { label: 'Suspended', icon: XCircle, variant: 'destructive' },
  'unsuspend': { label: 'Reinstated', icon: CheckCircle, variant: 'success' },
  'unsuspend_user': { label: 'Reinstated', icon: CheckCircle, variant: 'success' },
  'make_admin': { label: 'Made Admin', icon: Shield, variant: 'default' },
  'remove_trip': { label: 'Removed Trip', icon: XCircle, variant: 'destructive' },
  'resolve_report': { label: 'Resolved', icon: CheckCircle, variant: 'success' },
  'dismiss_report': { label: 'Dismissed', icon: XCircle, variant: 'destructive' },
  'investigate_report': { label: 'Investigating', icon: Eye, variant: 'default' },
  'review_feedback': { label: 'Reviewed', icon: CheckCircle, variant: 'success' },
  'update_user': { label: 'Updated', icon: User, variant: 'secondary' },
  'delete_user': { label: 'Deleted', icon: XCircle, variant: 'destructive' },
  'assign_report': { label: 'Assigned', icon: User, variant: 'default' },
  'create_trip': { label: 'Created Trip', icon: MapPin, variant: 'success' },
  'update_trip': { label: 'Updated Trip', icon: MapPin, variant: 'secondary' },
  'resolve_sos': { label: 'Resolved', icon: CheckCircle, variant: 'success' },
  'dismiss_sos': { label: 'Dismissed', icon: XCircle, variant: 'destructive' },
  'investigate_sos': { label: 'Investigating', icon: Eye, variant: 'default' },
};

export default function AdminActionLog({ log }: { log: any }) {
  const rawAction = log.action || '';
  const config = actionConfig[rawAction] || { label: rawAction.replace(/_/g, ' '), icon: FileText, variant: 'secondary' as const };
  
  const targetName = log.targetDisplayName || log.targetName || log.targetId?.slice(0, 8) || 'Unknown';
  const targetType = log.targetType || 'item';
  
  // Build the action description
  const getActionDescription = () => {
    const actionLabel = config.label.toLowerCase();
    const targetLabel = targetType === 'sos' ? 'SOS alert' : targetType === 'report' ? 'report' : targetType === 'trip' ? 'trip' : targetType === 'feedback' ? 'feedback' : 'user';
    
    if (['verify', 'verify_user', 'suspend', 'suspend_user', 'unsuspend', 'unsuspend_user', 'make_admin'].some(a => rawAction.includes(a))) {
      return `${actionLabel} ${targetLabel}`;
    } else if (['resolve_report', 'dismiss_report', 'investigate_report', 'assign_report', 'resolve_sos', 'dismiss_sos', 'investigate_sos'].some(a => rawAction.includes(a))) {
      return `${actionLabel} ${targetLabel}`;
    } else if (['remove_trip', 'create_trip', 'update_trip'].some(a => rawAction.includes(a))) {
      return `${actionLabel}`;
    } else if (['review_feedback'].some(a => rawAction.includes(a))) {
      return `${actionLabel}`;
    }
    return `${actionLabel} ${targetLabel}`;
  };
  
  return (
    <div className="flex items-center justify-between p-3 sm:p-4 border rounded-lg hover:bg-muted/30 transition-colors gap-2">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
        <Badge variant={config.variant} className="text-[10px] sm:text-xs font-semibold px-1.5 py-0.5 shrink-0">
          <config.icon className="h-3 w-3 mr-1" />
          {config.label}
        </Badge>
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="font-semibold text-xs sm:text-sm text-blue-600">Admin</span>
          <span className="text-[10px] sm:text-xs text-muted-foreground shrink-0">{getActionDescription()}</span>
          <span className="font-medium text-xs sm:text-sm truncate">{targetName !== targetType ? targetName : ''}</span>
        </div>
      </div>
      <div className="shrink-0">
        <span className="text-[10px] sm:text-xs text-muted-foreground whitespace-nowrap">
          {log.createdAt?.toDate ? formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true }) : ''}
        </span>
      </div>
    </div>
  );
}