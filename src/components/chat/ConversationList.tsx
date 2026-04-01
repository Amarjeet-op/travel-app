'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { db } from '@/lib/firebase/config';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

export default function ConversationList({ userId }: { userId: string }) {
  const [conversations, setConversations] = useState<any[]>([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'conversations'), where('participants', 'array-contains', userId), orderBy('lastMessageAt', 'desc'));
    const unsub = onSnapshot(q, (snap) => {
      setConversations(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
    });
    return () => unsub();
  }, [userId]);

  const filtered = conversations.filter((c) => {
    const otherId = c.participants?.find((p: string) => p !== userId);
    const other = c.participantDetails?.[otherId];
    return other?.name?.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="space-y-2">
      <div className="relative mb-4">
        <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        <Input placeholder="Search conversations..." className="pl-10" value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      {filtered.length === 0 ? (
        <p className="text-center py-8 text-muted-foreground">No conversations yet</p>
      ) : (
        filtered.map((conv) => {
          const otherId = conv.participants?.find((p: string) => p !== userId);
          const other = conv.participantDetails?.[otherId] || { name: 'Unknown', photoURL: null };
          return (
            <Link key={conv.id} href={`/messages/${conv.id}`}>
              <Card className="hover:bg-muted/50 transition-colors cursor-pointer">
                <CardContent className="flex items-center gap-4 p-4">
                  <Avatar className="h-12 w-12"><AvatarImage src={other.photoURL || ''} /><AvatarFallback>{other.name?.[0] || '?'}</AvatarFallback></Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold truncate">{other.name}</p>
                      <span className="text-xs text-muted-foreground">{conv.lastMessageAt?.toDate ? formatDistanceToNow(conv.lastMessageAt.toDate(), { addSuffix: true }) : ''}</span>
                    </div>
                    <p className="text-sm text-muted-foreground truncate">{conv.lastMessage}</p>
                    <p className="text-xs text-muted-foreground">Trip: {conv.tripTitle}</p>
                  </div>
                  {conv.unread?.[userId] > 0 && <Badge className="rounded-full h-6 w-6 flex items-center justify-center p-0">{conv.unread[userId]}</Badge>}
                </CardContent>
              </Card>
            </Link>
          );
        })
      )}
    </div>
  );
}
