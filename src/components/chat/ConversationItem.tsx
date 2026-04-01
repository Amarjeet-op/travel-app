import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function ConversationItem({ conversation, userId }: { conversation: any; userId: string }) {
  const otherId = conversation.participants?.find((p: string) => p !== userId);
  const other = conversation.participantDetails?.[otherId] || { name: 'Unknown', photoURL: null };
  return (
    <Link href={`/messages/${conversation.id}`}>
      <div className="flex items-center gap-3 p-3 hover:bg-muted/50 rounded-lg cursor-pointer transition-colors">
        <div className="relative">
          <Avatar className="h-10 w-10"><AvatarImage src={other.photoURL || ''} /><AvatarFallback>{other.name?.[0] || '?'}</AvatarFallback></Avatar>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <p className="font-medium text-sm truncate">{other.name}</p>
            <span className="text-xs text-muted-foreground">{conversation.lastMessageAt?.toDate ? formatDistanceToNow(conversation.lastMessageAt.toDate(), { addSuffix: true }) : ''}</span>
          </div>
          <p className="text-xs text-muted-foreground truncate">{conversation.lastMessage}</p>
        </div>
        {conversation.unread?.[userId] > 0 && <Badge variant="default" className="text-xs rounded-full">{conversation.unread[userId]}</Badge>}
      </div>
    </Link>
  );
}
