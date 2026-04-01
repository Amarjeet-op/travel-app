'use client';

import { useEffect, useState } from 'react';
import { ref, onValue, set, onDisconnect } from 'firebase/database';
import { rtdb } from '@/lib/firebase/config';

export function usePresence(userId: string) {
  const [isOnline, setIsOnline] = useState(false);
  const [lastSeen, setLastSeen] = useState<number | null>(null);

  useEffect(() => {
    if (!userId) return;
    const statusRef = ref(rtdb, `status/${userId}`);
    set(statusRef, { state: 'online', lastChanged: Date.now() });
    onDisconnect(statusRef).set({ state: 'offline', lastChanged: Date.now() });
    const unsub = onValue(statusRef, (snap) => {
      const data = snap.val();
      if (data) {
        setIsOnline(data.state === 'online');
        setLastSeen(data.lastChanged);
      }
    });
    return () => unsub();
  }, [userId]);

  return { isOnline, lastSeen };
}
