'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Users, AlertTriangle, Shield, MessageSquare, 
  FileText, CheckCircle, BarChart3, Clock 
} from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [logs, setLogs] = useState<any[]>([]);
  const [pendingUsers, setPendingUsers] = useState<any[]>([]);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [activeReports, setActiveReports] = useState<any[]>([]);
  const [weeklyUsers, setWeeklyUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [statsRes, logsRes, usersRes, tripsRes, reportsRes] = await Promise.all([
        fetch('/api/admin/stats'),
        fetch('/api/admin/logs?limit=5'),
        fetch('/api/admin/users?verified=false&limit=5'),
        fetch('/api/trips?limit=5'),
        fetch('/api/admin/reports?status=pending&limit=5'),
      ]);

      const [statsData, logsData, usersData, tripsData, reportsData] = await Promise.all([
        statsRes.json(),
        logsRes.json(),
        usersRes.json(),
        tripsRes.json(),
        reportsRes.json(),
      ]);

      setStats(statsData);
      setLogs(logsData.logs || []);
      setPendingUsers(usersData.users || []);
      setRecentTrips(tripsData.trips || []);
      setActiveReports(reportsData.reports || []);

      // Calculate weekly registrations
      const allUsersRes = await fetch('/api/admin/users?limit=200');
      const allUsersData = await allUsersRes.json();
      const users = allUsersData.users || [];
      const now = new Date();
      const weeks = Array.from({ length: 8 }, (_, i) => {
        const start = new Date(now);
        start.setDate(start.getDate() - (i * 7));
        start.setHours(0, 0, 0, 0);
        const end = new Date(start);
        end.setDate(end.getDate() + 7);
        return { start, end, count: 0, label: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) };
      }).reverse();

      users.forEach((user: any) => {
        const createdAt = user.createdAt?.toDate ? user.createdAt.toDate() : new Date(user.createdAt);
        for (const week of weeks) {
          if (createdAt >= week.start && createdAt < week.end) { week.count++; break; }
        }
      });
      setWeeklyUsers(weeks);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (userId: string, action: string) => {
    try {
      await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, action, notes: `${action} by admin` }),
      });
      toast.success(`User updated`);
      fetchDashboardData();
    } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  if (loading) {
    return <div className="container mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Syncing dashboard data...</p>
      </div>
    </div>;
  }

  const statCards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500' },
    { label: 'Pending Verification', value: stats?.pendingVerifications || 0, icon: Shield, color: 'text-yellow-500' },
    { label: 'Active Trips', value: stats?.activeTrips || 0, icon: FileText, color: 'text-green-500' },
    { label: 'SOS Alerts', value: stats?.activeSOSAlerts || 0, icon: AlertTriangle, color: 'text-red-500' },
    { label: 'Pending Reports', value: stats?.pendingReports || 0, icon: AlertTriangle, color: 'text-orange-500' },
    { label: 'Unread Feedback', value: stats?.unreadFeedback || 0, icon: MessageSquare, color: 'text-purple-500' },
  ];

  const maxWeeklyCount = Math.max(...weeklyUsers.map(w => w.count), 1);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <Button onClick={fetchDashboardData} variant="outline" size="sm" className="gap-2">
          <Clock className="h-4 w-4" /> Refresh Data
        </Button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
        {statCards.map((stat) => (
          <Card key={stat.label} className="hover:shadow-lg transition-all hover:scale-105 duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2 p-4">
              <CardTitle className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.label}</CardTitle>
              <stat.icon className={`h-4 w-4 sm:h-5 sm:w-5 ${stat.color}`} />
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="text-2xl sm:text-3xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8 mb-8">
        {/* Left Column: Alerts & Users */}
        <div className="lg:col-span-2 space-y-8">
          {/* Pending Verifications */}
          <Card shadow-premium="true">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <Shield className="h-5 w-5 text-yellow-500" />
                Pending Verifications
              </CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {pendingUsers.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground text-sm">No pending verifications</p>
              ) : (
                <div className="space-y-4">
                  {pendingUsers.map(user => (
                    <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/30 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border">
                          <AvatarImage src={user.photoURL} />
                          <AvatarFallback>{user.displayName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="text-sm font-bold">{user.displayName}</p>
                          <p className="text-xs text-muted-foreground">{user.email}</p>
                        </div>
                      </div>
                      <Button size="sm" onClick={() => handleAction(user.id, 'verify')}>Verify</Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Active Reports / SOS */}
          <Card className={activeReports.length > 0 ? "border-red-100 dark:border-red-900/30" : ""}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-500" />
                Urgent Reports
              </CardTitle>
              <Link href="/admin/reports">
                <Button variant="ghost" size="sm">View All Reports</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {activeReports.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground text-sm">No active reports</p>
              ) : (
                <div className="space-y-3">
                  {activeReports.map(report => (
                    <div key={report.id} className="p-3 border rounded-lg bg-red-50/10 border-red-200/20">
                      <div className="flex justify-between items-start mb-2">
                        <Badge variant={report.type === 'sos' ? 'destructive' : 'warning'}>
                          {report.type.toUpperCase()}
                        </Badge>
                        <span className="text-[10px] text-muted-foreground">
                          {report.createdAt?.toDate ? formatDistanceToNow(report.createdAt.toDate(), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      <p className="text-sm font-medium">{report.reason || report.details}</p>
                      <p className="text-xs text-muted-foreground mt-1">From: {report.reporterName || 'Anonymous'}</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Trips */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg flex items-center gap-2">
                <FileText className="h-5 w-5 text-green-500" />
                Latest Trip Posts
              </CardTitle>
              <Link href="/trips">
                <Button variant="ghost" size="sm">View Public Feed</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {recentTrips.length === 0 ? (
                <p className="text-center py-4 text-muted-foreground text-sm">No trips posted yet</p>
              ) : (
                <div className="divide-y">
                  {recentTrips.map(trip => (
                    <div key={trip.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-center text-sm">
                        <span className="font-medium">{trip.fromCity} → {trip.toCity}</span>
                        <Badge variant="outline" className="text-[10px]">{trip.transportMode}</Badge>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-1">By {trip.creatorName} • {trip.maxCompanions} slots</p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Chart & Activity */}
        <div className="space-y-8">
          {/* User Growth Chart */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                User Registrations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1 h-32">
                {weeklyUsers.map((week, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1 group">
                    <div 
                      className="w-full bg-primary/80 rounded-t transition-all group-hover:bg-primary min-h-[2px]"
                      style={{ height: `${Math.max((week.count / maxWeeklyCount) * 100, 2)}%` }}
                    />
                    <span className="text-[8px] text-muted-foreground text-center rotate-45 mt-2 origin-left">{week.label}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recent Activity Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Admin Activity
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y max-h-[400px] overflow-y-auto">
                {logs.length === 0 ? (
                  <p className="text-muted-foreground text-center py-8 text-sm">No activity recorded</p>
                ) : (
                  logs.map((log) => (
                    <div key={log.id} className="p-4 hover:bg-muted/20">
                      <div className="flex justify-between items-start gap-2">
                        <p className="text-xs font-bold leading-none">{log.adminName || 'Admin'}</p>
                        <span className="text-[10px] text-muted-foreground shrink-0 uppercase">
                          {log.createdAt?.toDate ? formatDistanceToNow(log.createdAt.toDate(), { addSuffix: true }) : ''}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1 leading-snug">
                        <span className="font-medium text-foreground">{log.action.replace('_', ' ')}</span>
                        {" "}on {log.targetType}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
