import { Timestamp } from 'firebase/firestore';

export interface Conversation {
  id: string;
  participants: string[];
  participantDetails: Record<string, { name: string; photoURL: string | null }>;
  tripId: string;
  tripTitle: string;
  lastMessage: string;
  lastMessageAt: Timestamp;
  lastMessageBy: string;
  unread: Record<string, number>;
  createdAt: Timestamp;
  status: 'active' | 'archived';
}

export type MessageType = 'text' | 'image' | 'system';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderPhoto?: string;
  type: MessageType;
  content: string;
  readBy: string[];
  createdAt: Timestamp;
}
