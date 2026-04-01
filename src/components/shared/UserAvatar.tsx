import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils/cn';

interface UserAvatarProps {
  name: string;
  photoURL?: string | null;
  size?: 'sm' | 'md' | 'lg';
  isOnline?: boolean;
  className?: string;
}

export default function UserAvatar({ name, photoURL, size = 'md', isOnline, className }: UserAvatarProps) {
  const sizes = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' };
  return (
    <div className={cn('relative inline-block', className)}>
      <Avatar className={sizes[size]}><AvatarImage src={photoURL || ''} /><AvatarFallback>{name?.[0] || 'U'}</AvatarFallback></Avatar>
      {isOnline !== undefined && <span className={cn('absolute bottom-0 right-0 block rounded-full ring-2 ring-white', isOnline ? 'bg-green-400' : 'bg-gray-300', size === 'sm' ? 'h-2 w-2' : 'h-3 w-3')} />}
    </div>
  );
}
