'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import FeedbackCard from '@/components/admin/FeedbackCard';
import AdminFilters from '@/components/admin/AdminFilters';
import { toast } from 'react-hot-toast';

export default function AdminFeedbackPage() {
  const [feedback, setFeedback] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const fetchFeedback = useCallback(async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/feedback?limit=20`;
      
      if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
      
      if (categoryFilter !== 'all') url += `&category=${categoryFilter}`;
      if (cursor) url += `&cursor=${cursor}`;

      const res = await fetch(url);
      const data = await res.json();
      setFeedback(data.feedback || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [activeTab, categoryFilter]);

  useEffect(() => {
    fetchFeedback();
  }, [fetchFeedback]);

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors([...prevCursors, nextCursor]);
      fetchFeedback(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursors.length > 1) {
      const newCursors = prevCursors.slice(0, -1);
      setPrevCursors(newCursors);
      fetchFeedback(newCursors[newCursors.length - 1]);
    } else if (prevCursors.length === 1) {
      setPrevCursors([]);
      fetchFeedback();
    }
  };

  const handleAction = async (feedbackId: string, status: string) => {
    try {
      const notes = status === 'addressed' ? prompt('Enter response notes (optional):') || '' : '';
      await fetch('/api/admin/feedback', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedbackId, status, notes }),
      });
      toast.success('Feedback updated successfully');
      fetchFeedback();
    } catch (e: any) { toast.error(e.message || 'Update failed'); }
  };

  if (loading && feedback.length === 0) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const tabs = [
    { value: 'all', label: 'All Feedback' },
    { value: 'new', label: 'New' },
    { value: 'reviewed', label: 'Reviewed' },
    { value: 'addressed', label: 'Addressed' },
  ];

  const categoryOptions = [
    { value: 'bug', label: 'Bug Report' },
    { value: 'feature', label: 'Feature Request' },
    { value: 'complaint', label: 'Complaint' },
    { value: 'general', label: 'General' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">User Feedback</h1>
        <Link href="/admin" className={buttonVariants({ variant: 'outline' }) + " flex items-center gap-2"}>
            ← Back to Dashboard
        </Link>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          {tabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>{tab.label}</TabsTrigger>
          ))}
        </TabsList>

        {tabs.map((tab) => (
          <TabsContent key={tab.value} value={tab.value}>
            <Card>
              <CardHeader>
                <CardTitle>{tab.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <AdminFilters
                  type={categoryFilter}
                  onTypeChange={setCategoryFilter}
                  typeOptions={categoryOptions}
                  placeholder="Filter by category..."
                />

                {feedback.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No feedback in this category</p>
                ) : (
                  <div className="space-y-4">
                    {feedback.map((f) => (
                      <FeedbackCard key={f.id} feedback={f} onAction={handleAction} />
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
