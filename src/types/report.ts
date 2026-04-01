import { Timestamp } from 'firebase/firestore';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type ReportType = 'sos' | 'report';
export type ReportStatus = 'pending' | 'investigating' | 'resolved' | 'dismissed';
export type ReportPriority = 'normal' | 'urgent';

export interface Report {
  id: string;
  type: ReportType;
  reporterId: string;
  reporterName: string;
  reporterEmail: string;
  reportedUserId: string | null;
  reportedUserName: string | null;
  description: string;
  location: Coordinates | null;
  evidenceURLs: string[];
  isAnonymous: boolean;
  status: ReportStatus;
  priority: ReportPriority;
  adminNotes: string | null;
  assignedTo: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  resolvedAt: Timestamp | null;
}

export interface SOSAlert extends Report {
  type: 'sos';
  location: Coordinates;
  priority: 'urgent';
}
