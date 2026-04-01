import { rtdb } from './config';
import { ref, set, onValue, onDisconnect, remove, DataSnapshot } from 'firebase/database';

export function setOnlineStatus(userId: string) {
  const statusRef = ref(rtdb, `status/${userId}`);
  set(statusRef, { state: 'online', lastChanged: Date.now() });
  onDisconnect(statusRef).set({ state: 'offline', lastChanged: Date.now() });
}

export function listenToStatus(userId: string, callback: (data: { state: string; lastChanged: number }) => void) {
  const statusRef = ref(rtdb, `status/${userId}`);
  return onValue(statusRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) callback(data);
  });
}

export function setTyping(conversationId: string, userId: string, isTyping: boolean) {
  const typingRef = ref(rtdb, `typing/${conversationId}/${userId}`);
  if (isTyping) {
    set(typingRef, true);
    onDisconnect(typingRef).remove();
  } else {
    remove(typingRef);
  }
}

export function listenToTyping(conversationId: string, callback: (typingUsers: string[]) => void) {
  const typingRef = ref(rtdb, `typing/${conversationId}`);
  return onValue(typingRef, (snapshot: DataSnapshot) => {
    const data = snapshot.val();
    if (data) {
      callback(Object.keys(data));
    } else {
      callback([]);
    }
  });
}
