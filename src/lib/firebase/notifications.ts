import { getAdminDb } from '@/lib/firebase/admin';

export type NotificationType = 
  | 'trip_request'
  | 'request_accepted'
  | 'request_rejected'
  | 'new_message'
  | 'trip_cancelled'
  | 'account_verified'
  | 'sos_resolved'
  | 'admin_action';

export interface NotificationData {
  tripId?: string;
  conversationId?: string;
  userId?: string;
  reportId?: string;
}

export async function createNotification(
  userId: string,
  type: NotificationType,
  options: {
    title: string;
    body: string;
    link?: string;
    data?: NotificationData;
  }
) {
  try {
    const db = getAdminDb();
    
    await db.collection('notifications').add({
      userId,
      type,
      title: options.title,
      body: options.body,
      link: options.link || '/',
      read: false,
      data: options.data || {},
      createdAt: new Date(),
    });
    
    return true;
  } catch (error) {
    console.error('Failed to create notification:', error);
    return false;
  }
}