import { format, formatDistanceToNow, isToday, isYesterday } from 'date-fns';
import type { Timestamp } from 'firebase/firestore';

export function formatDate(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'MMM dd, yyyy');
}

export function formatTime(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'h:mm a');
}

export function formatDateTime(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'MMM dd, yyyy h:mm a');
}

export function formatRelativeTime(timestamp: Timestamp): string {
  const date = timestamp.toDate();
  if (isToday(date)) {
    return format(date, 'h:mm a');
  }
  if (isYesterday(date)) {
    return 'Yesterday';
  }
  return formatDistanceToNow(date, { addSuffix: true });
}

export function formatShortDate(timestamp: Timestamp): string {
  return format(timestamp.toDate(), 'MMM dd');
}
