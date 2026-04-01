'use client';

import { useEffect, useState } from 'react';
import { collection, query, where, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import type { Notification } from '@/types/notification';
import { useNotificationStore } from '@/stores/notificationStore';

export function useNotifications(userId: string) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const setUnreadCount = useNotificationStore((s) => s.setUnreadCount);

  useEffect(() => {
    if (!userId) return;
    const q = query(collection(db, 'notifications'), where('userId', '==', userId), orderBy('createdAt', 'desc'), limit(50));
    const unsub = onSnapshot(q, (snap) => {
      const notifs = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Notification));
      setNotifications(notifs);
      setUnreadCount(notifs.filter((n) => !n.read).length);
      setLoading(false);
    });
    return () => unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  return { notifications, loading };
}
