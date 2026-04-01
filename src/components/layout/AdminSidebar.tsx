'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils/cn';
import { Home, Users, AlertTriangle, MessageSquare, MapPin, ScrollText } from 'lucide-react';

const links = [
  { href: '/admin', label: 'Overview', icon: Home },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/reports', label: 'Reports', icon: AlertTriangle },
  { href: '/admin/feedback', label: 'Feedback', icon: MessageSquare },
  { href: '/admin/trips', label: 'Trips', icon: MapPin },
  { href: '/admin/logs', label: 'Logs', icon: ScrollText },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  return (
    <aside className="hidden md:flex flex-col w-64 border-r bg-card min-h-[calc(100vh-4rem)]">
      <nav className="flex-1 p-4 space-y-1">
        {links.map((link) => (
          <Link key={link.href} href={link.href} className={cn('flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors', pathname === link.href ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-muted hover:text-foreground')}>
            <link.icon className="h-4 w-4" />{link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
}
