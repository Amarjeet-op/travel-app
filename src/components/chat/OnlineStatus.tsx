import { cn } from '@/lib/utils/cn';

export default function OnlineStatus({ isOnline }: { isOnline: boolean }) {
  return (
    <span className={cn('absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white', isOnline ? 'bg-green-400' : 'bg-gray-300')} />
  );
}
