import { Timestamp } from 'firebase/firestore';

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
}

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string | null;
  gender: 'male' | 'female' | 'other' | 'prefer-not-to-say';
  age: number;
  phone: string;
  homeCity: string;
  bio: string;
  emergencyContacts: EmergencyContact[];
  role: 'user' | 'admin';
  isVerified: boolean;
  isOnline: boolean;
  lastSeen: Timestamp | null;
  profileCompleted: boolean;
  tripsPosted: number;
  tripsJoined: number;
  status: 'active' | 'suspended' | 'disabled';
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt: Timestamp;
}

export type PublicUserProfile = Omit<
  UserProfile,
  'email' | 'phone' | 'emergencyContacts' | 'role' | 'status'
>;
