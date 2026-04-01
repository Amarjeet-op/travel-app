'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Home, MapPin, MessageSquare, Shield, User, Settings, Bell, LayoutDashboard } from 'lucide-react';
import { cn } from '@/lib/utils/cn';
import { useAuthContext } from '@/components/providers/AuthProvider';

const navItems = [
  { href: '/dashboard', label: 'Home', icon: Home },
  { href: '/trips', label: 'Trips', icon: MapPin },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/safety-checker', label: 'Safety', icon: Shield },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function MobileNav() {
  const pathname = usePathname();
  const { userData, isAdmin } = useAuthContext();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t bg-background/95 backdrop-blur-md md:hidden">
      <div className="flex justify-around py-2">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              'flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] transition-all duration-300',
              pathname === item.href ? 'text-primary scale-110 font-bold' : 'text-muted-foreground'
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </Link>
        ))}
        {isAdmin && (
          <Link
            href="/admin"
            className="flex flex-col items-center gap-1 px-3 py-1.5 text-[10px] transition-all duration-300 text-rose-500 font-bold animate-pulse"
          >
            <LayoutDashboard className="h-5 w-5" />
            Admin
          </Link>
        )}
      </div>
    </nav>
  );
}
