import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Shield, AlertTriangle, FileText, MessageSquare, CheckCircle } from 'lucide-react';

const statCards = [
  { label: 'Total Users', value: 0, icon: Users, color: 'text-blue-500' },
  { label: 'Pending Verification', value: 0, icon: Shield, color: 'text-yellow-500' },
  { label: 'Active Trips', value: 0, icon: FileText, color: 'text-green-500' },
  { label: 'Active SOS', value: 0, icon: AlertTriangle, color: 'text-red-500' },
  { label: 'Pending Reports', value: 0, icon: AlertTriangle, color: 'text-orange-500' },
  { label: 'Unread Feedback', value: 0, icon: MessageSquare, color: 'text-purple-500' },
];

export default function StatsCards({ stats }: { stats?: any }) {
  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
      {statCards.map((stat) => {
        const Icon = stat.icon;
        const value = stats ? stats[stat.label.toLowerCase().replace(/ /g, '')] ?? 0 : stat.value;
        return (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <Icon className={`h-5 w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent><div className="text-3xl font-bold">{value}</div></CardContent>
          </Card>
        );
      })}
    </div>
  );
}
