import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types/chat';
import { format } from 'date-fns';
import { Check, CheckCheck } from 'lucide-react';

export default function MessageBubble({ message, isOwn }: { message: Message; isOwn: boolean }) {
  return (
    <div className={cn('flex', isOwn ? 'justify-end' : 'justify-start')}>
      <div className={cn('max-w-[70%] rounded-lg px-4 py-2', isOwn ? 'bg-primary text-primary-foreground' : 'bg-muted')}>
        <p className="text-sm break-words">{message.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">{message.createdAt?.toDate ? format(message.createdAt.toDate(), 'h:mm a') : ''}</span>
          {isOwn && (message.readBy?.length > 0 ? <CheckCheck className="h-3 w-3 text-blue-300" /> : <Check className="h-3 w-3 opacity-70" />)}
        </div>
      </div>
    </div>
  );
}
