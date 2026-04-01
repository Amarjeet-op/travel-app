'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Send, ArrowLeft, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { db } from '@/lib/firebase/config';
import { collection, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import type { Message } from '@/types/chat';

export default function ChatDetailPage() {
  const params = useParams();
  const conversationId = params.conversationId as string;
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [otherUser, setOtherUser] = useState<any>({ name: '', photo: '' });
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [status, setStatus] = useState<string>('active');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = React.useMemo(() => require('next/navigation').useRouter(), []);

  useEffect(() => {
    if (!conversationId) return;

    // Get current user session and conversation details
    const initChat = async () => {
      try {
        const [authRes, convsRes] = await Promise.all([
          fetch('/api/auth/me'),
          fetch('/api/conversations')
        ]);
        
        if (authRes.ok) {
          const user = await authRes.json();
          setCurrentUser(user);
        }

        if (convsRes.ok) {
          const data = await convsRes.json();
          const current = data.conversations?.find((c: any) => c.id === conversationId);
          if (current) {
            setOtherUser(current.otherParticipant);
            setStatus(current.status || 'active');
          }
        }
      } catch (err) {
        console.error('Chat init error:', err);
      }
    };
    
    initChat();
  }, [conversationId]);

  useEffect(() => {
    if (!conversationId) return;

    const q = query(
      collection(db, `conversations/${conversationId}/messages`), 
      orderBy('createdAt', 'asc'), 
      limit(100)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as Message));
      setMessages(msgs);
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    });

    return () => unsubscribe();
  }, [conversationId]);

  const sendMessage = async () => {
    if (!newMessage.trim() || !conversationId) return;

    const content = newMessage.trim();
    setNewMessage('');

    try {
      const res = await fetch(`/api/conversations/${conversationId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'text', content }),
      });
      if (!res.ok) {
        const data = await res.json();
        if (res.status === 403) {
          setErrorMsg(data.error);
          setStatus('post_trip');
        }
      } else {
        setErrorMsg(null);
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to hide this conversation?')) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      if (res.ok) {
        window.location.href = '/messages';
      }
    } catch (error) {
      console.error('Failed to hide conversation:', error);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] sm:h-[calc(100vh-8rem)] max-w-4xl mx-auto px-4">
      {/* Header */}
      <div className="flex items-center gap-4 py-4 border-b border-border/50">
        <Link href="/messages">
          <Button variant="ghost" size="icon" className="rounded-full hover:bg-primary/10 hover:text-primary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <Avatar className="h-12 w-12 border-2 border-primary/10 shadow-sm">
          {otherUser.isGroup ? (
             <div className="w-full h-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center rounded-full">
               <Users className="h-6 w-6 text-white" />
             </div>
          ) : (
            <>
              <AvatarImage src={otherUser.photo || ''} />
              <AvatarFallback className="bg-gradient-to-br from-violet-500/10 to-purple-500/10 text-violet-600 dark:text-violet-400 font-bold">
                {otherUser.name?.[0] || '?'}
              </AvatarFallback>
            </>
          )}
        </Avatar>
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold tracking-tight truncate">{otherUser.name}</h2>
          <div className="flex items-center gap-1.5 mt-0.5">
            {status === 'active' ? (
              <>
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">
                  {otherUser.isGroup ? `${otherUser.totalParticipants} Members` : 'Active'}
                </span>
              </>
            ) : (
              <>
                <span className="w-2 h-2 rounded-full bg-muted shadow-sm" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Locked (Post-Trip)</span>
              </>
            )}
          </div>
        </div>
        <Button
          variant="ghost" 
          size="icon"
          className="h-10 w-10 rounded-full text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-all shrink-0"
          onClick={handleDelete}
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-hide px-2">
        {messages.map((msg) => {
          const isMe = msg.senderId === currentUser?.uid;
          const msgDate = msg.createdAt?.toDate?.() || (msg.createdAt?.seconds ? new Date(msg.createdAt.seconds * 1000) : null);
          
          return (
            <div
              key={msg.id}
              className={`flex items-end gap-3 ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              {!isMe && (
                <Avatar className="h-8 w-8 mb-1 shrink-0 border border-border/50 shadow-sm relative group">
                  {/* Find sender info from participants map if available */}
                  <AvatarImage src={msg.senderPhoto || ''} />
                  <AvatarFallback className="text-[10px] bg-muted font-bold">
                    {msg.senderName?.[0] || '?'}
                  </AvatarFallback>
                </Avatar>
              )}
              <div
                className={`group relative max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 shadow-sm transition-all duration-300 ${
                  isMe
                    ? 'bg-gradient-to-br from-primary to-primary-glow text-white rounded-br-none hover:shadow-primary/20'
                    : 'bg-card dark:bg-card/95 border border-border/50 text-foreground rounded-bl-none hover:border-primary/10'
                }`}
              >
                {!isMe && otherUser.isGroup && (
                  <p className="text-[10px] font-black uppercase tracking-widest text-primary mb-1">
                    {msg.senderName}
                  </p>
                )}
                <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                <div className={`flex items-center justify-end gap-1.5 mt-1.5 opacity-60 ${isMe ? 'text-white' : 'text-muted-foreground'}`}>
                  <p className="text-[10px] font-medium uppercase tracking-tighter">
                    {msgDate ? msgDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      <div className="py-4 border-t border-border/50 bg-background mt-auto sticky bottom-0">
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-semibold animate-in fade-in slide-in-from-bottom-2">
             {errorMsg}
          </div>
        )}
        
        <div className="flex gap-3 items-center bg-card dark:bg-card/80 border border-border/50 rounded-2xl p-2 shadow-inner focus-within:ring-2 ring-primary/20 transition-all duration-300">
          <Input
            placeholder={status === 'post_trip' && currentUser?.uid !== otherUser.id ? "Chat is locked..." : "Write a message..."}
            value={newMessage}
            disabled={status === 'post_trip' && currentUser?.uid !== otherUser.id && !!errorMsg}
            className="flex-1 border-none focus-visible:ring-0 shadow-none bg-transparent h-10 px-3 text-sm sm:text-base"
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), sendMessage())}
          />
          <Button 
            onClick={sendMessage} 
            size="icon" 
            className="rounded-xl h-10 w-10 shrink-0 bg-gradient-to-br from-primary to-primary-glow hover:shadow-lg hover:shadow-primary/30 transition-all active:scale-95 disabled:grayscale disabled:opacity-50"
            disabled={!newMessage.trim() || (status === 'post_trip' && currentUser?.uid !== otherUser.id && !!errorMsg)}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
