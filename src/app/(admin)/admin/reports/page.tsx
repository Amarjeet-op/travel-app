'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChevronLeft, ChevronRight, AlertTriangle, FileText } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import ReportCard from '@/components/admin/ReportCard';
import SOSAlertCard from '@/components/admin/SOSAlertCard';
import ReportMap from '@/components/admin/ReportMap';
import AdminFilters from '@/components/admin/AdminFilters';
import { toast } from 'react-hot-toast';

export default function AdminReportsPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('active-sos');
  const [statusFilter, setStatusFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');

  useEffect(() => { fetchReports(); }, [activeTab]);

  const fetchReports = async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/reports?limit=20`;
      
      if (activeTab === 'active-sos') {
        url += '&type=sos&status=pending';
      } else if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
      
      if (typeFilter !== 'all') url += `&type=${typeFilter}`;
      if (cursor) url += `&cursor=${cursor}`;

      const res = await fetch(url);
      const data = await res.json();
      setReports(data.reports || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors([...prevCursors, nextCursor]);
      fetchReports(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursors.length > 1) {
      const newCursors = prevCursors.slice(0, -1);
      setPrevCursors(newCursors);
      fetchReports(newCursors[newCursors.length - 1]);
    } else if (prevCursors.length === 1) {
      setPrevCursors([]);
      fetchReports();
    }
  };

  const handleAction = async (reportId: string, action: string) => {
    try {
      const notes = action === 'resolve' || action === 'dismiss' ? prompt('Enter notes (optional):') || '' : '';
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, notes }),
      });
      toast.success(`Report ${action}ed successfully`);
      fetchReports();
    } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  if (loading && reports.length === 0) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const tabs = [
    { value: 'active-sos', label: 'Active SOS', icon: AlertTriangle },
    { value: 'pending', label: 'Pending', icon: FileText },
    { value: 'investigating', label: 'Investigating', icon: FileText },
    { value: 'resolved', label: 'Resolved', icon: FileText },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Reports & SOS Management</h1>
        <Link href="/admin" className={buttonVariants({ variant: 'outline' }) + " flex items-center gap-2"}>
            ← Back to Dashboard
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-2">
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No reports in this category</p>
                ) : (
                  <div className="space-y-4">
                    {reports.map((report) => (
                      <div key={report.id}>
                        {report.type === 'sos' && activeTab === 'active-sos' ? (
                          <SOSAlertCard report={report} onAction={handleAction} />
                        ) : (
                          <ReportCard report={report} onAction={handleAction} />
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex justify-between mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={prevCursors.length === 0}
                  >
                    <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextCursor}
                  >
                    Next <ChevronRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
