'use client';

import React, { useState, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, MessageSquare, ArrowRight, Users, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      setConversations(data.conversations || []);
    } catch (error) {
      console.error('Failed to fetch conversations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (e: React.MouseEvent, conversationId: string) => {
    e.preventDefault();
    e.stopPropagation();
    if (!confirm('Are you sure you want to hide this conversation? It will reappear if you receive a new message.')) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}`, { method: 'DELETE' });
      if (res.ok) {
        setConversations(prev => prev.filter(c => c.id !== conversationId));
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
    }
  };

  const filtered = conversations.filter((c) =>
    c.otherParticipant?.name?.toLowerCase().includes(search.toLowerCase()) ||
    c.tripTitle?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
              <MessageSquare className="h-6 w-6 text-white" />
            </div>
            <span className="text-gradient">Messages</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {filtered.length} conversation{filtered.length !== 1 ? 's' : ''}
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            className="pl-10 h-10"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 rounded-2xl bg-muted animate-pulse border border-border/50" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-muted/60 flex items-center justify-center">
            <MessageSquare className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No conversations yet</h3>
          <p className="text-muted-foreground max-w-xs mx-auto">Join a trip or accept a companion to start chatting!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((conv) => {
            const otherUser = conv.otherParticipant || { name: 'User', photo: '' };
            const lastActive = conv.lastMessageAt?._seconds 
              ? new Date(conv.lastMessageAt._seconds * 1000) 
              : (conv.lastMessageAt instanceof Date ? conv.lastMessageAt : null);

            return (
              <div key={conv.id} className="group relative">
                <Link href={`/messages/${conv.id}`}>
                  <div className="relative rounded-2xl bg-card dark:bg-card/95 p-4 sm:p-5 border border-border/50 hover:border-primary/20 hover:shadow-xl dark:hover:shadow-2xl transition-all duration-300 overflow-hidden cursor-pointer">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    
                    <div className="flex items-center gap-4 relative z-10">
                      <Avatar className="h-14 w-14 ring-2 ring-primary/5 group-hover:ring-primary/10 transition-all duration-300 shrink-0 shadow-sm relative">
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
                      
                      <div className="flex-1 min-w-0 pr-8">
                        <div className="flex items-center justify-between gap-2 mb-1">
                          <p className="font-bold text-base sm:text-lg truncate group-hover:text-primary transition-colors">
                            {otherUser.name}
                          </p>
                          <span className="text-[10px] sm:text-xs text-muted-foreground uppercase tracking-wider font-medium">
                            {lastActive ? formatDistanceToNow(lastActive, { addSuffix: true }) : ''}
                          </span>
                        </div>
                        
                        <div className="flex items-center gap-1.5 mb-1 opacity-80">
                          <div className="w-1 h-1 rounded-full bg-primary/40" />
                          <p className="text-[10px] sm:text-xs font-semibold text-muted-foreground uppercase tracking-widest truncate uppercase">
                            Trip: {conv.tripTitle}
                          </p>
                          {conv.status === 'post_trip' && (
                            <span className="ml-2 text-[10px] px-1.5 py-0.5 rounded-full bg-muted text-muted-foreground border border-border/50 font-bold uppercase tracking-tighter">
                              Trip Ended
                            </span>
                          )}
                        </div>
                        
                        <p className="text-sm text-muted-foreground line-clamp-1 group-hover:text-foreground/80 transition-colors italic break-words">
                          &ldquo;{conv.lastMessage}&rdquo;
                        </p>
                      </div>

                      <div className="flex flex-col items-end gap-2 shrink-0">
                        {conv.unreadCount > 0 && (
                          <span className="bg-gradient-to-br from-primary to-primary-glow text-white text-[10px] font-black rounded-full min-w-6 h-6 px-1.5 flex items-center justify-center shadow-lg shadow-primary/20 border border-white/20">
                            {conv.unreadCount}
                          </span>
                        )}
                        <Button
                          variant="ghost" 
                          size="icon"
                          className="h-9 w-9 rounded-full text-muted-foreground opacity-100 sm:opacity-0 sm:group-hover:opacity-100 hover:text-destructive hover:bg-destructive/10 transition-all relative z-20 shrink-0"
                          onClick={(e) => handleDelete(e, conv.id)}
                        >
                          <Trash2 className="h-4.5 w-4.5" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
