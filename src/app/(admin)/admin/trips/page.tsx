'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button, buttonVariants } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ChevronLeft, ChevronRight, MapPin, Calendar, Users } from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import AdminFilters from '@/components/admin/AdminFilters';
import { toast } from 'react-hot-toast';

export default function AdminTripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [prevCursors, setPrevCursors] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => { fetchTrips(); }, [activeTab]);

  const fetchTrips = async (cursor?: string | null) => {
    setLoading(true);
    try {
      let url = `/api/admin/trips?limit=20`;
      
      if (activeTab !== 'all') {
        url += `&status=${activeTab}`;
      }
      
      if (cursor) url += `&cursor=${cursor}`;

      const res = await fetch(url);
      const data = await res.json();
      setTrips(data.trips || []);
      setNextCursor(data.nextCursor || null);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleNextPage = () => {
    if (nextCursor) {
      setPrevCursors([...prevCursors, nextCursor]);
      fetchTrips(nextCursor);
    }
  };

  const handlePrevPage = () => {
    if (prevCursors.length > 1) {
      const newCursors = prevCursors.slice(0, -1);
      setPrevCursors(newCursors);
      fetchTrips(newCursors[newCursors.length - 1]);
    } else if (prevCursors.length === 1) {
      setPrevCursors([]);
      fetchTrips();
    }
  };

  const handleAction = async (tripId: string, action: string) => {
    try {
      const notes = prompt('Enter reason for this action (optional):') || '';
      await fetch('/api/admin/trips', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId, action, notes }),
      });
      toast.success(`Trip ${action}ed successfully`);
      fetchTrips();
    } catch (e: any) { toast.error(e.message || 'Action failed'); }
  };

  if (loading && trips.length === 0) return <div className="container mx-auto px-4 py-8">Loading...</div>;

  const tabs = [
    { value: 'all', label: 'All Trips' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Trip Moderation</h1>
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
                {trips.length === 0 ? (
                  <p className="text-center py-8 text-muted-foreground">No trips in this category</p>
                ) : (
                  <div className="space-y-4">
                    {trips.map((trip) => (
                      <Card key={trip.id}>
                        <CardContent className="p-4">
                          <div className="flex items-start justify-between">
                            <div className="space-y-2 flex-1">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-4 w-4 text-muted-foreground" />
                                <p className="font-semibold text-lg">{trip.fromCity} → {trip.toCity}</p>
                              </div>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center gap-1">
                                  <Users className="h-4 w-4" />
                                  <span>By: {trip.creatorName}</span>
                                  {trip.creatorVerified && (
                                    <Badge variant="success" className="text-xs">Verified</Badge>
                                  )}
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  <span>
                                    {trip.departureDate?.toDate 
                                      ? format(trip.departureDate.toDate(), 'MMM dd, yyyy')
                                      : 'N/A'}
                                  </span>
                                </div>
                                <span>Companions: {trip.currentCompanions || 0}/{trip.maxCompanions || 0}</span>
                                <span>Transport: {trip.transportMode}</span>
                              </div>

                              {trip.description && (
                                <p className="text-sm text-muted-foreground line-clamp-2">{trip.description}</p>
                              )}
                            </div>

                            <div className="flex items-center gap-2 ml-4">
                              <Badge variant={trip.status === 'active' ? 'success' : trip.status === 'cancelled' ? 'destructive' : 'secondary'}>
                                {trip.status}
                              </Badge>
                              
                              {trip.status === 'active' && (
                                <Button
                                  size="sm"
                                  variant="destructive"
                                  onClick={() => handleAction(trip.id, 'cancel')}
                                >
                                  Cancel Trip
                                </Button>
                              )}
                              
                              {trip.status === 'cancelled' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleAction(trip.id, 'restore')}
                                >
                                  Restore
                                </Button>
                              )}
                            </div>
                          </div>
                        </CardContent>
                      </Card>
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
