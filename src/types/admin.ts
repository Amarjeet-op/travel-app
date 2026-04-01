import { Timestamp } from 'firebase/firestore';

export type AdminAction =
  | 'verify_user'
  | 'suspend_user'
  | 'unsuspend_user'
  | 'make_admin'
  | 'resolve_report'
  | 'dismiss_report'
  | 'investigate_report'
  | 'remove_trip'
  | 'review_feedback';

export type AdminTargetType = 'user' | 'report' | 'trip' | 'feedback';

export interface AdminLog {
  id: string;
  adminId: string;
  adminEmail: string;
  adminName: string;
  action: AdminAction;
  targetType: AdminTargetType;
  targetId: string;
  details: string;
  createdAt: Timestamp;
}

export interface Feedback {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  category: 'bug' | 'feature' | 'complaint' | 'general';
  message: string;
  rating: number | null;
  status: 'new' | 'reviewed' | 'addressed';
  adminNotes: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
