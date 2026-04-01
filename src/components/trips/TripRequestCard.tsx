import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Check, X } from 'lucide-react';
import type { TripRequest } from '@/types/trip';
import { formatDistanceToNow } from 'date-fns';

export default function TripRequestCard({ request, onAccept, onReject }: { request: TripRequest; onAccept: (id: string) => void; onReject: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-4">
        <Avatar className="h-10 w-10"><AvatarImage src={request.requesterPhoto || ''} /><AvatarFallback>{request.requesterName?.[0] || 'U'}</AvatarFallback></Avatar>
        <div className="flex-1">
          <p className="font-semibold">{request.requesterName}</p>
          <p className="text-sm text-muted-foreground">{request.message}</p>
          <p className="text-xs text-muted-foreground">{request.createdAt?.toDate ? formatDistanceToNow(request.createdAt.toDate(), { addSuffix: true }) : ''}</p>
        </div>
        {request.status === 'pending' && (
          <div className="flex gap-2">
            <Button size="sm" variant="default" onClick={() => onAccept(request.id)}><Check className="h-4 w-4" /></Button>
            <Button size="sm" variant="destructive" onClick={() => onReject(request.id)}><X className="h-4 w-4" /></Button>
          </div>
        )}
        {request.status !== 'pending' && <Badge variant={request.status === 'accepted' ? 'success' : 'destructive'}>{request.status}</Badge>}
      </CardContent>
    </Card>
  );
}
