'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { format } from 'date-fns';
import Link from 'next/link';

export default function MyTripsTabs({ trips }: { trips: { posted: any[]; requested: any[]; joined: any[] } }) {
  return (
    <Tabs defaultValue="posted">
      <TabsList>
        <TabsTrigger value="posted">Posted</TabsTrigger>
        <TabsTrigger value="requested">Requested</TabsTrigger>
        <TabsTrigger value="joined">Joined</TabsTrigger>
      </TabsList>
      <TabsContent value="posted">
        {trips.posted.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No posted trips. <Link href="/trips/new" className="text-primary hover:underline">Post one!</Link></p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.posted.map((t: any) => (
              <Card key={t.id}><CardHeader><CardTitle className="text-lg">{t.fromCity} → {t.toCity}</CardTitle></CardHeader><CardContent><Badge variant={t.status === 'active' ? 'success' : 'secondary'}>{t.status}</Badge><p className="text-sm text-muted-foreground mt-2">{t.departureDate?.toDate ? format(t.departureDate.toDate(), 'MMM dd, yyyy') : ''}</p><Link href={`/trips/${t.id}`}><Button variant="outline" size="sm" className="mt-2">View</Button></Link></CardContent></Card>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="requested">
        {trips.requested.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No requested trips</p>
        ) : (
          <div className="space-y-4">
            {trips.requested.map((r: any) => (
              <Card key={r.id}><CardContent className="flex items-center justify-between p-4"><div><p className="font-semibold">{r.tripTitle}</p><p className="text-sm text-muted-foreground">Status: {r.status}</p></div><Badge variant={r.status === 'accepted' ? 'success' : r.status === 'rejected' ? 'destructive' : 'secondary'}>{r.status}</Badge></CardContent></Card>
            ))}
          </div>
        )}
      </TabsContent>
      <TabsContent value="joined">
        {trips.joined.length === 0 ? (
          <p className="text-center py-12 text-muted-foreground">No joined trips yet</p>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {trips.joined.map((t: any) => (
              <Card key={t.id}><CardHeader><CardTitle className="text-lg">{t.fromCity} → {t.toCity}</CardTitle></CardHeader><CardContent><p className="text-sm text-muted-foreground">{t.departureDate?.toDate ? format(t.departureDate.toDate(), 'MMM dd, yyyy') : ''}</p><div className="flex gap-2 mt-2"><Link href={`/trips/${t.id}`}><Button variant="outline" size="sm">View</Button></Link><Link href="/messages"><Button size="sm">Chat</Button></Link></div></CardContent></Card>
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  );
}
