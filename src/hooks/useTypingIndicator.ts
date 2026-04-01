'use client';

import { useEffect, useState, useRef } from 'react';
import { listenToTyping, setTyping } from '@/lib/firebase/realtime';

export function useTypingIndicator(conversationId: string, userId: string) {
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!conversationId) return;
    const unsub = listenToTyping(conversationId, (users) => setTypingUsers(users.filter((u) => u !== userId)));
    return () => unsub();
  }, [conversationId, userId]);

  const startTyping = () => {
    if (conversationId) setTyping(conversationId, userId, true);
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      if (conversationId) setTyping(conversationId, userId, false);
    }, 2000);
  };

  return { typingUsers, startTyping };
}
