'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import AdminActionLog from '@/components/admin/AdminActionLog';
import AdminFilters from '@/components/admin/AdminFilters';

export default function AdminLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [adminFilter, setAdminFilter] = useState('all');
  const [actionFilter, setActionFilter] = useState('all');
  const [targetFilter, setTargetFilter] = useState('all');

  const fetchLogs = useCallback(async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/logs?limit=20`;
      
      if (adminFilter !== 'all') url += `&adminId=${adminFilter}`;
      if (actionFilter !== 'all') url += `&action=${actionFilter}`;
      if (targetFilter !== 'all') url += `&targetType=${targetFilter}`;
      if (cursor) url += `&cursor=${cursor}`;

      const res = await fetch(url);
      const data = await res.json();
      setLogs(data.logs || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [adminFilter, actionFilter, targetFilter]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors([...prevCursors, nextCursor]);
      fetchLogs(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursors.length > 1) {
      const newCursors = prevCursors.slice(0, -1);
      setPrevCursors(newCursors);
      fetchLogs(newCursors[newCursors.length - 1]);
    } else if (prevCursors.length === 1) {
      setPrevCursors([]);
      fetchLogs();
    }
  };

  const handleFilterChange = () => {
    setPrevCursors([]);
    fetchLogs();
  };

  if (loading && logs.length === 0) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Activity Logs</h1>

      <Card>
        <CardHeader>
          <CardTitle>Activity Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <AdminFilters
            status={targetFilter}
            onStatusChange={(value) => { setTargetFilter(value); setPrevCursors([]); fetchLogs(); }}
            statusOptions={[
              { value: 'user', label: 'User Actions' },
              { value: 'report', label: 'Report Actions' },
              { value: 'trip', label: 'Trip Actions' },
              { value: 'feedback', label: 'Feedback Actions' },
            ]}
            type={actionFilter}
            onTypeChange={(value) => { setActionFilter(value); setPrevCursors([]); fetchLogs(); }}
            typeOptions={[
              { value: 'verify_user', label: 'Verify User' },
              { value: 'suspend_user', label: 'Suspend User' },
              { value: 'unsuspend_user', label: 'Unsuspend User' },
              { value: 'make_admin', label: 'Make Admin' },
              { value: 'resolve_report', label: 'Resolve Report' },
              { value: 'dismiss_report', label: 'Dismiss Report' },
              { value: 'investigate_report', label: 'Investigate Report' },
              { value: 'remove_trip', label: 'Remove Trip' },
              { value: 'review_feedback', label: 'Review Feedback' },
            ]}
            placeholder="Filter logs..."
          />

          {logs.length === 0 ? (
            <p className="text-center py-8 text-muted-foreground">No logs found</p>
          ) : (
            <div className="space-y-2">
              {logs.map((log) => (
                <AdminActionLog key={log.id} log={log} />
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
    </div>
  );
}
