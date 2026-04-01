'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin, Calendar, Users, CheckCircle, XCircle, Clock,
  ArrowRight, Plane, Send, Loader2, Check, X, MessageSquare
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'react-hot-toast';

export default function MyTripsPage() {
  const [data, setData] = useState<any>({
    posted: [], activeTrips: [], pastTrips: [],
    pendingRequests: [], rejectedRequests: [], joined: [],
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('active');
  const [processing, setProcessing] = useState<string | null>(null);

  useEffect(() => { fetchTrips(); }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips/my-trips');
      const json = await res.json();
      if (res.ok) {
        setData(json);
      } else {
        toast.error(json.error || 'Failed to fetch trips');
      }
    } catch {
      console.error('Failed to fetch trips');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (requestId: string, action: 'accept' | 'reject') => {
    setProcessing(requestId);
    try {
      const res = await fetch(`/api/trips/requests`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requestId, action }),
      });
      if (!res.ok) throw new Error('Failed');
      toast.success(action === 'accept' ? 'Request accepted!' : 'Request declined');
      fetchTrips();
    } catch (e: any) {
      toast.error(e.message || 'Failed');
    } finally {
      setProcessing(null);
    }
  };

  const tabs = [
    { id: 'active', label: 'Active', count: data?.activeTrips?.length || 0 },
    { id: 'posted', label: 'Posted', count: data?.posted?.length || 0 },
    { id: 'pending', label: 'Pending', count: data?.pendingRequests?.length || 0 },
    { id: 'joined', label: 'Joined', count: data?.joined?.length || 0 },
    { id: 'past', label: 'Past', count: data?.pastTrips?.length || 0 },
    { id: 'rejected', label: 'Rejected', count: data?.rejectedRequests?.length || 0 },
  ];

  const TripCard = ({ trip, showActions }: { trip: any; showActions?: boolean }) => {
    const depDate = trip?.departureDate?.toDate ? trip.departureDate.toDate() : new Date(trip?.departureDate);
    return (
      <div className="group relative rounded-2xl bg-gradient-to-br p-px transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:hover:shadow-xl">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
        <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50 group-hover:border-primary/10 transition-all">
          <div className="flex items-start justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-glow rounded-lg flex items-center justify-center shadow-md shadow-primary/20">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-bold text-sm sm:text-base leading-tight break-words">
                  {trip?.fromCity} <span className="text-primary mx-0.5">→</span> {trip?.toCity}
                </p>
                <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-wider">
                  {depDate instanceof Date && !isNaN(depDate.getTime()) ? format(depDate, 'MMM dd, yyyy') : 'No date set'}
                </p>
              </div>
            </div>
            <Badge variant={trip?.status === 'active' ? 'success' : 'secondary'} className="shrink-0 uppercase text-[10px] tracking-wider">
              {trip?.status}
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
            <Users className="h-4 w-4" />
            <span>{trip?.currentCompanions || 0}/{trip?.maxCompanions} companions</span>
          </div>
          <div className="flex gap-2">
            <Link href={`/trips/${trip?.id}`}>
              <Button variant="outline" size="sm" className="gap-1.5">
                <MapPin className="h-3.5 w-3.5" /> View
              </Button>
            </Link>
            <Link href="/messages">
              <Button size="sm" className="gap-1.5">
                <MessageSquare className="h-3.5 w-3.5" /> Chat
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  };

  const RequestCard = ({ req, showActions }: { req: any; showActions?: boolean }) => (
    <div className="group relative rounded-2xl bg-gradient-to-br p-px transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg">
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-amber-500/10 to-orange-500/10 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
      <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 border border-border/50">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={req?.requesterPhoto || ''} />
              <AvatarFallback className="bg-primary/10 text-primary text-xs">
                {req?.requesterName?.[0] || 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <p className="font-bold text-sm sm:text-base truncate">{req?.requesterName}</p>
              <p className="text-xs text-muted-foreground line-clamp-1 font-medium">{req?.tripTitle}</p>
              {req?.message && (
                <p className="text-[11px] text-muted-foreground mt-1.5 italic line-clamp-2 leading-relaxed bg-muted/30 p-2 rounded-lg border border-border/30">
                  &ldquo;{req.message}&rdquo;
                </p>
              )}
            </div>
          </div>
          <div className="flex gap-1.5 shrink-0">
            {showActions ? (
              <>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-green-600 hover:text-green-600 hover:bg-green-50"
                  onClick={() => handleAction(req.id, 'accept')} disabled={!!processing}>
                  {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                </Button>
                <Button size="sm" variant="outline" className="h-8 w-8 p-0 text-destructive hover:bg-destructive/10"
                  onClick={() => handleAction(req.id, 'reject')} disabled={!!processing}>
                  {processing === req.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
                </Button>
              </>
            ) : (
              <Badge variant={req?.status === 'accepted' ? 'success' : req?.status === 'rejected' ? 'destructive' : 'secondary'}>
                {req?.status}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-muted rounded" />
          {[...Array(3)].map((_, i) => <div key={i} className="h-24 bg-muted rounded-2xl" />)}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-5xl mx-auto">
      {data?.error && (
        <div className="mb-6 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm font-medium">
          Error: {data.error}
        </div>
      )}

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">
          My <span className="text-gradient">Trips</span>
        </h1>
        <p className="text-muted-foreground mt-1 text-sm">Manage your trips and requests</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-primary/10 text-primary shadow-sm'
                : 'text-muted-foreground hover:bg-muted/60'
            }`}
          >
            {tab.label}
            {tab.count > 0 && (
              <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                activeTab === tab.id ? 'bg-primary/20' : 'bg-muted'
              }`}>
                {tab.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'active' && (
        <div className="space-y-4">
          {!data?.activeTrips || data.activeTrips.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No active trips</h3>
              <p className="text-sm text-muted-foreground mb-4">Post a trip to get started</p>
              <Link href="/trips/new"><Button size="sm">Post a Trip</Button></Link>
            </div>
          ) : (
            data.activeTrips.map((trip: any) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      )}

      {activeTab === 'posted' && (
        <div className="space-y-4">
          {!data?.posted || data.posted.length === 0 ? (
            <div className="text-center py-16">
              <MapPin className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No posted trips</h3>
              <Link href="/trips/new"><Button size="sm">Post a Trip</Button></Link>
            </div>
          ) : (
            data.posted.map((trip: any) => <TripCard key={trip.id} trip={trip} showActions />)
          )}
        </div>
      )}

      {activeTab === 'pending' && (
        <div className="space-y-4">
          {!data?.pendingRequests || data.pendingRequests.length === 0 ? (
            <div className="text-center py-16">
              <Clock className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No pending requests</h3>
              <p className="text-sm text-muted-foreground">Requests to join your trips will appear here</p>
            </div>
          ) : (
            data.pendingRequests.map((req: any) => <RequestCard key={req.id} req={req} showActions />)
          )}
        </div>
      )}

      {activeTab === 'joined' && (
        <div className="space-y-4">
          {!data?.joined || data.joined.length === 0 ? (
            <div className="text-center py-16">
              <Users className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No joined trips</h3>
              <p className="text-sm text-muted-foreground mb-4">Request to join a trip to get started</p>
              <Link href="/trips"><Button size="sm">Browse Trips</Button></Link>
            </div>
          ) : (
            data.joined.map((trip: any) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      )}

      {activeTab === 'past' && (
        <div className="space-y-4">
          {!data?.pastTrips || data.pastTrips.length === 0 ? (
            <div className="text-center py-16">
              <Calendar className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No past trips</h3>
              <p className="text-sm text-muted-foreground">Your completed trips will appear here</p>
            </div>
          ) : (
            data.pastTrips.map((trip: any) => <TripCard key={trip.id} trip={trip} />)
          )}
        </div>
      )}

      {activeTab === 'rejected' && (
        <div className="space-y-4">
          {!data?.rejectedRequests || data.rejectedRequests.length === 0 ? (
            <div className="text-center py-16">
              <XCircle className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
              <h3 className="font-semibold mb-1">No rejected requests</h3>
              <p className="text-sm text-muted-foreground">Declined requests will appear here</p>
            </div>
          ) : (
            data.rejectedRequests.map((req: any) => <RequestCard key={req.id} req={req} />)
          )}
        </div>
      )}
    </div>
  );
}
