'use client';

import { useState, useEffect, useCallback } from 'react';
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

  const fetchReports = useCallback(async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/reports?limit=20`;
      
      if (activeTab === 'active-sos') {
        url += '&type=sos&status=pending';
      } else if (activeTab === 'dismissed') {
        url += '&status=dismissed';
      } else if (activeTab === 'investigating') {
        url += '&status=investigating';
      } else if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
      
      if (typeFilter !== 'all') url += `&type=${typeFilter}`;
      if (cursor) url += `&cursor=${cursor}`;

      const res = await fetch(url);
      const data = await res.json();
      setReports(data.reports || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, typeFilter]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

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
      const res = await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reportId, action, notes }),
      });
      
      if (res.ok) {
        toast.success(`Report ${action}ed successfully`);
        
        if (action === 'investigate') {
          setActiveTab('investigating');
        } else if (action === 'resolve') {
          setActiveTab('resolved');
        } else if (action === 'dismiss') {
          setActiveTab('resolved');
        }
        fetchReports();
      }
    } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  if (loading && reports.length === 0) return <div className="container mx-auto px-4 py-8 text-center">Loading reports...</div>;

  const tabs = [
    { value: 'active-sos', label: 'Active SOS', icon: AlertTriangle },
    { value: 'pending', label: 'Pending', icon: FileText },
    { value: 'investigating', label: 'Investigating', icon: FileText },
    { value: 'resolved', label: 'Resolved', icon: FileText },
    { value: 'dismissed', label: 'Dismissed', icon: FileText },
  ];

  return (
    <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold">Reports & SOS</h1>
        <Link href="/admin" className={buttonVariants({ variant: 'outline' }) + " flex items-center gap-2 text-sm"}>
            ← Back
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4 w-full flex overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value} className="flex items-center gap-1 flex-shrink-0 text-xs sm:text-sm">
              <tab.icon className="h-3 w-3 sm:h-4 sm:w-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader className="pb-3 sm:pb-4">
                <CardTitle className="text-lg sm:text-xl">{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                {reports.length === 0 ? (
                  <p className="text-center py-6 sm:py-8 text-muted-foreground">No reports in this category</p>
                ) : (
                  <div className="space-y-3 sm:space-y-4">
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

                <div className="flex justify-between mt-4 gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handlePrevPage}
                    disabled={prevCursors.length === 0}
                    className="flex-1 sm:flex-none"
                  >
                    <ChevronLeft className="h-4 w-4 sm:mr-1" /> <span className="hidden sm:inline">Previous</span>
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleNextPage}
                    disabled={!nextCursor}
                    className="flex-1 sm:flex-none"
                  >
                    <span className="hidden sm:inline">Next</span> <ChevronRight className="h-4 w-4 sm:ml-1" />
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
