import { ReactNode } from 'react';
import { AlertTriangle, MapPin, MessageSquare, Shield, FileText } from 'lucide-react';

interface EmptyStateProps {
  icon?: 'trips' | 'messages' | 'safety' | 'notifications' | 'reports';
  title: string;
  description: string;
  action?: ReactNode;
}

const iconMap = {
  trips: MapPin,
  messages: MessageSquare,
  safety: Shield,
  notifications: AlertTriangle,
  reports: FileText,
};

export default function EmptyState({ icon = 'trips', title, description, action }: EmptyStateProps) {
  const Icon = iconMap[icon];
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Icon className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-muted-foreground mb-6 max-w-sm">{description}</p>
      {action}
    </div>
  );
}
