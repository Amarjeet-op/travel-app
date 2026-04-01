'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Home, MapPin, MessageSquare, Shield, User, Settings, Bell, Users, AlertTriangle, FileText, ScrollText } from 'lucide-react';

const userLinks = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/trips', label: 'Trips', icon: MapPin },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/safety-checker', label: 'Safety', icon: Shield },
  { href: '/feedback', label: 'Feedback', icon: FileText },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/notifications', label: 'Notifications', icon: Bell },
];

const adminLinks = [
  { href: '/admin', label: 'Overview', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/admin/trips', label: 'Trips', icon: MapPin },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

export default function Sidebar({ isAdmin = false }: { isAdmin?: boolean }) {
  const pathname = usePathname();
  const links = isAdmin ? adminLinks : userLinks;

  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card/50 backdrop-blur-sm min-h-[calc(100vh-4.5rem)]">
      <nav className="flex-1 p-4 space-y-1.5">
        {links.map((link) => (
          <Link 
            key={link.href} 
            href={link.href} 
            className={cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
              pathname === link.href 
                ? 'bg-gradient-to-r from-primary/15 to-primary/5 text-primary shadow-sm' 
                : 'text-muted-foreground hover:bg-muted/60 hover:text-foreground hover:translate-x-0.5'
            )}
          >
            <link.icon className="h-5 w-5" />
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}