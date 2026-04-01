'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  MapPin, Calendar, Users, ArrowLeft, Edit, Trash2, Train, Bus,
  Plane, Car, Shield, Clock, IndianRupee, User, Send, Loader2, CheckCircle
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import { useAuthContext } from '@/components/providers/AuthProvider';

const TripMap = dynamic(() => import('@/components/trips/TripMap'), { ssr: false });

const transportIcons: Record<string, any> = {
  train: Train,
  bus: Bus,
  flight: Plane,
  car: Car,
};

const transportColors: Record<string, { gradient: string; iconBg: string; accent: string; shadow: string }> = {
  train: {
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    accent: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/30',
  },
  bus: {
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    accent: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/30',
  },
  flight: {
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
    accent: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/30',
  },
  car: {
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
    accent: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-500/30',
  },
};

export default function TripDetailPage() {
  const params = useParams();
  const { user, userData, loading: authLoading } = useAuthContext();
  const tripId = params.tripId as string;
  const [trip, setTrip] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);

  useEffect(() => {
    fetchTrip();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      const data = await res.json();
      setTrip(data);
    } catch (error) {
      console.error('Failed to fetch trip:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      toast.success('Trip deleted');
      window.location.href = '/trips';
    } catch (e: any) { toast.error(e.message || 'Failed to delete'); }
  };

  const handleJoin = async () => {
    setJoining(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tripId }),
      });
      const result = await res.json();
      if (!res.ok) throw new Error(result.error || 'Failed to join');
      toast.success('Join request sent!');
      fetchTrip();
    } catch (e: any) { toast.error(e.message || 'Failed to join'); }
    finally { setJoining(false); }
  };

  if (loading || authLoading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-muted rounded" />
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="grid md:grid-cols-2 gap-6">
            <div className="h-48 bg-muted rounded-2xl" />
            <div className="h-48 bg-muted rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!trip || trip.status === 'deleted') {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto text-center py-20">
        <Trash2 className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-destructive">Trip Deleted</h2>
        <p className="text-muted-foreground mb-6">This trip has been removed by the creator.</p>
        <Link href="/trips">
          <Button variant="outline">
            <ArrowLeft className="h-4 w-4 mr-2" /> Browse Other Trips
          </Button>
        </Link>
      </div>
    );
  }

  const isCreator = user?.uid === trip.creatorId;
  const TransportIcon = transportIcons[trip.transportMode] || MapPin;
  const colors = transportColors[trip.transportMode] || transportColors.car;

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Back Link */}
      <Link href="/trips" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors text-sm">
        <ArrowLeft className="h-4 w-4" />
        Back to Trips
      </Link>

      {/* Route Header */}
      <div className="relative rounded-2xl bg-gradient-to-br p-px mb-6 sm:mb-8">
        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.accent} opacity-10 blur-xl`} />
        <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-8 border border-border/50">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className={`w-14 h-14 sm:w-16 sm:h-16 ${colors.iconBg} rounded-xl flex items-center justify-center shadow-lg ${colors.shadow}`}>
                <TransportIcon className="h-7 w-7 sm:h-8 sm:w-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold">
                  {trip.fromCity} <span className="text-muted-foreground mx-1">→</span> {trip.toCity}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {trip.departureDate?.toDate ? format(trip.departureDate.toDate(), 'EEEE, MMMM dd, yyyy') : trip.departureDate}
                </p>
              </div>
            </div>
            <Badge variant={trip.status === 'active' ? 'success' : 'secondary'} className="text-sm px-3 py-1 shrink-0">
              {trip.status}
            </Badge>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Trip Details Card */}
          <div className="relative rounded-2xl bg-gradient-to-br p-px">
            <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" /> Trip Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Calendar className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Departure</p>
                    <p className="text-sm font-medium">
                      {trip.departureDate?.toDate ? format(trip.departureDate.toDate(), 'MMM dd, yyyy') : trip.departureDate}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <TransportIcon className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Transport</p>
                    <p className="text-sm font-medium capitalize">{trip.transportMode}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <Users className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Companions</p>
                    <p className="text-sm font-medium">{trip.currentCompanions || 0}/{trip.maxCompanions}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <IndianRupee className="h-4 w-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Budget</p>
                    <p className="text-sm font-medium capitalize">{trip.budgetRange || 'Not set'}</p>
                  </div>
                </div>
              </div>

              {trip.description && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{trip.description}</p>
                </div>
              )}

              {trip.preferences && trip.preferences.length > 0 && (
                <div className="mt-4">
                  <h3 className="font-semibold mb-2">Preferences</h3>
                  <div className="flex flex-wrap gap-2">
                    {trip.preferences.map((pref: string) => (
                      <Badge key={pref} variant="outline" className="text-xs">{pref}</Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Creator Actions */}
              {isCreator && (
                <div className="mt-6 pt-4 border-t flex gap-2">
                  <Link href={`/trips/${tripId}/edit`}>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4 mr-1" /> Edit
                    </Button>
                  </Link>
                  <ConfirmDialog
                    title="Delete Trip"
                    description="Are you sure? This cannot be undone."
                    variant="destructive"
                    confirmText="Delete"
                    onConfirm={handleDelete}
                    trigger={
                      <Button variant="destructive" size="sm">
                        <Trash2 className="h-4 w-4 mr-1" /> Delete
                      </Button>
                    }
                  />
                </div>
              )}
            </div>
          </div>

          {/* Map Card */}
          <div className="relative rounded-2xl bg-gradient-to-br p-px">
            <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-primary" /> Route Map
              </h2>
              <div className="h-56 sm:h-64 rounded-xl overflow-hidden">
                <TripMap
                  fromCoordinates={trip.fromCoordinates}
                  toCoordinates={trip.toCoordinates}
                  fromCity={trip.fromCity}
                  toCity={trip.toCity}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Creator Card */}
          <div className="relative rounded-2xl bg-gradient-to-br p-px">
            <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <User className="h-5 w-5 text-primary" /> Trip Creator
              </h2>
              <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                <Avatar className="h-12 w-12 ring-2 ring-primary/20">
                  <AvatarImage src={trip.creatorPhoto || ''} />
                  <AvatarFallback className="bg-primary/10 text-primary font-medium">
                    {trip.creatorName?.[0] || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold">{trip.creatorName}</p>
                  {trip.creatorVerified && (
                    <Badge variant="success" className="text-xs mt-1 flex items-center gap-1 w-fit">
                      <Shield className="h-3 w-3" /> Verified
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Join Card */}
          <div className="relative rounded-2xl bg-gradient-to-br p-px">
            <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
              {isCreator ? (
                <div className="text-center py-4">
                  <CheckCircle className="h-10 w-10 text-primary mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">You created this trip</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={handleJoin}
                    disabled={joining || !userData?.isVerified}
                  >
                    {joining ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Sending...
                      </>
                    ) : !userData?.isVerified ? (
                      <>
                        <Shield className="h-4 w-4 mr-2" /> Verify to Join
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" /> Request to Join
                      </>
                    )}
                  </Button>
                  {!userData?.isVerified && (
                    <p className="text-[10px] text-center text-rose-500 font-bold uppercase tracking-tight animate-pulse">
                      Can only request post verification
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
