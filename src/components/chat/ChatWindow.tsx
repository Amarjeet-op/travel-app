'use client';

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, onSnapshot, addDoc, serverTimestamp, doc, updateDoc } from 'firebase/firestore';
import type { Message } from '@/types/chat';
import MessageBubble from './MessageBubble';
import MessageInput from './MessageInput';
import TypingIndicator from './TypingIndicator';
import { listenToTyping, setTyping } from '@/lib/firebase/realtime';

export default function ChatWindow({ conversationId, userId, userName }: { conversationId: string; userId: string; userName: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [otherUser, setOtherUser] = useState<{ name: string; photoURL: string | null; isOnline?: boolean }>({ name: '', photoURL: null });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;
    const q = query(collection(db, `conversations/${conversationId}/messages`), orderBy('createdAt', 'asc'), limit(100));
    const unsub = onSnapshot(q, (snap) => {
      setMessages(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Message)));
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => unsub();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = listenToTyping(conversationId, (users) => setTypingUsers(users.filter((u) => u !== userId)));
    return () => unsub();
  }, [conversationId, userId]);

  const sendMessage = async (content: string, type: 'text' | 'image' = 'text') => {
    if (!content.trim() || !conversationId) return;
    await addDoc(collection(db, `conversations/${conversationId}/messages`), {
      content: content.trim(), type, senderId: userId, senderName: userName, readBy: [], createdAt: serverTimestamp(),
    });
    setTyping(conversationId, userId, false);
  };

  const handleTyping = (isTyping: boolean) => {
    if (conversationId) setTyping(conversationId, userId, isTyping);
  };

  return (
    <Card className="flex flex-col h-[calc(100vh-12rem)]">
      <CardContent className="flex-1 flex flex-col overflow-hidden p-0">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map((msg) => <MessageBubble key={msg.id} message={msg} isOwn={msg.senderId === userId} />)}
          <div ref={messagesEndRef} />
        </div>
        <TypingIndicator users={typingUsers} />
        <MessageInput onSend={sendMessage} onTyping={handleTyping} />
      </CardContent>
    </Card>
  );
}
