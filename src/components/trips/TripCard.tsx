import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Calendar, Users } from 'lucide-react';
import Link from 'next/link';
import type { Trip } from '@/types/trip';
import { format } from 'date-fns';

export default function TripCard({ trip }: { trip: Trip }) {
  const spotsLeft = trip.maxCompanions - trip.currentCompanions;
  return (
    <Link href={`/trips/${trip.id}`}>
      <Card className="hover:shadow-md transition-shadow h-full">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span className="font-semibold">{trip.fromCity} → {trip.toCity}</span>
            </div>
            <Badge variant={trip.status === 'active' ? 'success' : 'secondary'}>{trip.status}</Badge>
          </div>
          <div className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="h-4 w-4" />{trip.departureDate?.toDate ? format(trip.departureDate.toDate(), 'MMM dd, yyyy') : ''}</div>
            <div className="flex items-center gap-2"><Users className="h-4 w-4" />{trip.currentCompanions}/{trip.maxCompanions} companions · {spotsLeft} spots left</div>
            <div className="flex items-center gap-2"><Badge variant="outline" className="text-xs capitalize">{trip.transportMode}</Badge><Badge variant="outline" className="text-xs capitalize">{trip.budgetRange}</Badge></div>
          </div>
        </CardContent>
        <CardFooter className="border-t pt-4">
          <div className="flex items-center gap-2">
            <Avatar className="h-6 w-6"><AvatarImage src={trip.creatorPhoto || ''} /><AvatarFallback>{trip.creatorName?.[0] || 'U'}</AvatarFallback></Avatar>
            <span className="text-sm">{trip.creatorName}</span>
            {trip.creatorVerified && <Badge variant="success" className="text-xs">Verified</Badge>}
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
