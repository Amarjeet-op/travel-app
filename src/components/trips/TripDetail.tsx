'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Users, ArrowLeft, Edit, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import dynamic from 'next/dynamic';
import { toast } from 'react-hot-toast';
import ConfirmDialog from '@/components/shared/ConfirmDialog';

const TripMap = dynamic(() => import('@/components/trips/TripMap'), { ssr: false });

export default function TripDetail({ trip }: { trip?: any }) {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  const [data, setData] = useState(trip || null);
  const [loading, setLoading] = useState(!trip);

  useEffect(() => {
    if (!trip) fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId, trip]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      const d = await res.json();
      setData(d);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleDelete = async () => {
    try {
      await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
      toast.success('Trip deleted');
      router.push('/trips');
    } catch (e: any) { toast.error(e.message || 'Failed to delete'); }
  };

  if (loading) return <div className="container mx-auto px-4 py-8"><div className="skeleton-shimmer h-96 rounded-lg" /></div>;
  if (!data) return <div className="container mx-auto px-4 py-8 text-center"><h2 className="text-2xl font-bold mb-4">Trip not found</h2><Link href="/trips"><Button>Back to Trips</Button></Link></div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/trips" className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6"><ArrowLeft className="h-4 w-4" />Back to Trips</Link>
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-2xl">{data.fromCity} → {data.toCity}</CardTitle>
                <Badge variant={data.status === 'active' ? 'success' : 'secondary'}>{data.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2"><Calendar className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">Departure</p><p className="font-medium">{data.departureDate?.toDate ? format(data.departureDate.toDate(), 'MMM dd, yyyy') : ''}</p></div></div>
                <div className="flex items-center gap-2"><MapPin className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">Transport</p><p className="font-medium capitalize">{data.transportMode}</p></div></div>
                <div className="flex items-center gap-2"><Users className="h-5 w-5 text-muted-foreground" /><div><p className="text-sm text-muted-foreground">Companions</p><p className="font-medium">{data.currentCompanions || 0}/{data.maxCompanions}</p></div></div>
                <div><p className="text-sm text-muted-foreground">Budget</p><p className="font-medium capitalize">{data.budgetRange}</p></div>
              </div>
              {data.description && <div><h3 className="font-semibold mb-2">Description</h3><p className="text-muted-foreground">{data.description}</p></div>}
              {data.preferences?.length > 0 && <div><h3 className="font-semibold mb-2">Preferences</h3><div className="flex flex-wrap gap-2">{data.preferences.map((p: string) => <Badge key={p} variant="outline">{p}</Badge>)}</div></div>}
            </CardContent>
            <CardFooter className="gap-2">
              <Link href={`/trips/${tripId}/edit`}><Button variant="outline" size="sm"><Edit className="h-4 w-4 mr-1" />Edit</Button></Link>
              <ConfirmDialog title="Delete Trip" description="Are you sure? This cannot be undone." variant="destructive" confirmText="Delete" onConfirm={handleDelete} trigger={<Button variant="destructive" size="sm"><Trash2 className="h-4 w-4 mr-1" />Delete</Button>} />
            </CardFooter>
          </Card>
          <Card><CardHeader><CardTitle>Route Map</CardTitle></CardHeader><CardContent><div className="h-64 rounded-lg overflow-hidden"><TripMap fromCoordinates={data.fromCoordinates} toCoordinates={data.toCoordinates} fromCity={data.fromCity} toCity={data.toCity} /></div></CardContent></Card>
        </div>
        <div className="space-y-6">
          <Card><CardHeader><CardTitle>Trip Creator</CardTitle></CardHeader><CardContent><div className="flex items-center gap-3"><Avatar className="h-12 w-12"><AvatarImage src={data.creatorPhoto || ''} /><AvatarFallback>{data.creatorName?.[0] || 'U'}</AvatarFallback></Avatar><div><p className="font-semibold">{data.creatorName}</p>{data.creatorVerified && <Badge variant="success" className="text-xs">Verified</Badge>}</div></div></CardContent></Card>
          <Button className="w-full" size="lg">Request to Join</Button>
        </div>
      </div>
    </div>
  );
}
