import { Timestamp } from 'firebase/firestore';

export interface Coordinates {
  lat: number;
  lng: number;
}

export type TransportMode = 'train' | 'bus' | 'flight' | 'car' | 'other';
export type BudgetRange = 'budget' | 'mid-range' | 'premium';
export type TripStatus = 'active' | 'full' | 'expired' | 'completed' | 'cancelled';

export interface Trip {
  id: string;
  createdBy: string;
  creatorName: string;
  creatorPhoto: string | null;
  creatorVerified: boolean;
  fromCity: string;
  fromCoordinates: Coordinates;
  toCity: string;
  toCoordinates: Coordinates;
  departureDate: Timestamp;
  returnDate: Timestamp | null;
  transportMode: TransportMode;
  maxCompanions: number;
  currentCompanions: number;
  companions: string[];
  budgetRange: BudgetRange;
  description: string;
  preferences: string[];
  coverImage: string | null;
  status: TripStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type TripRequestStatus = 'pending' | 'accepted' | 'rejected' | 'cancelled';

export interface TripRequest {
  id: string;
  tripId: string;
  tripTitle: string;
  requesterId: string;
  requesterName: string;
  requesterPhoto: string | null;
  tripCreatorId: string;
  message: string;
  status: TripRequestStatus;
  rejectionReason: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
