import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

export default function FeedbackCard({ feedback, onAction }: { feedback: any; onAction: (id: string, status: string) => void }) {
  return (
    <Card>
      <CardContent className="p-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src={feedback.userPhotoURL || ''} />
              <AvatarFallback className="text-xs">{feedback.userName?.[0] || 'U'}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium">{feedback.userName || 'Unknown User'}</p>
              <p className="text-xs text-muted-foreground">{feedback.userEmail || ''}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{feedback.category}</Badge>
            <Badge variant={feedback.status === 'new' ? 'default' : feedback.status === 'addressed' ? 'success' : 'secondary'}>{feedback.status}</Badge>
            <span className="text-xs text-muted-foreground">{feedback.createdAt?.toDate ? formatDistanceToNow(feedback.createdAt.toDate(), { addSuffix: true }) : ''}</span>
          </div>
        </div>
        <p className="text-sm">{feedback.message}</p>
        {feedback.rating && <p className="text-sm">Rating: {'⭐'.repeat(feedback.rating)}</p>}
        {feedback.adminNotes && <p className="text-xs text-muted-foreground bg-muted p-2 rounded">Admin Notes: {feedback.adminNotes}</p>}
        {feedback.status !== 'addressed' && <Button size="sm" onClick={() => onAction(feedback.id, 'addressed')}>Mark Addressed</Button>}
      </CardContent>
    </Card>
  );
}
