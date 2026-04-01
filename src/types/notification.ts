import { Timestamp } from 'firebase/firestore';

export type NotificationType =
  | 'trip_request'
  | 'request_accepted'
  | 'request_rejected'
  | 'new_message'
  | 'trip_cancelled'
  | 'account_verified'
  | 'sos_resolved'
  | 'admin_action';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  title: string;
  body: string;
  link: string;
  read: boolean;
  data?: {
    tripId?: string;
    conversationId?: string;
    userId?: string;
    reportId?: string;
  };
  createdAt: Timestamp;
}
