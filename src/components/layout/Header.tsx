'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Shield, Bell, LogOut, Menu, Sun, Moon, Home, MapPin, MessageSquare, User, MessageCircleQuestion, Plane, AlertTriangle } from 'lucide-react';
import { useTheme } from '@/components/providers/ThemeProvider';
import { useState, useEffect, useRef } from 'react';
import SOSButton from '@/components/emergency/SOSButton';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home },
  { href: '/trips', label: 'Trips', icon: MapPin },
  { href: '/trips/my-trips', label: 'My Trips', icon: Plane },
  { href: '/messages', label: 'Messages', icon: MessageSquare },
  { href: '/safety-checker', label: 'Safety', icon: Shield },
  { href: '/profile', label: 'Profile', icon: User },
];

export default function Header() {
  const { user, userData, isAdmin } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [notificationCount, setNotificationCount] = useState(0);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const lastFetchRef = useRef<number>(0);

  const fetchNotifications = async () => {
    if (!user) return;
    const now = Date.now();
    // Throttle: don't fetch more often than every 2s
    if (now - lastFetchRef.current < 2000) return;
    lastFetchRef.current = now;

    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const data = await res.json();
        setNotificationCount(data.unreadCount || 0);
      }
    } catch (e) { console.error('Failed to fetch notifications', e); }
  };

  useEffect(() => {
    fetchNotifications();
  }, [user?.uid, pathname]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOutUser();
    await fetch('/api/auth/session', { method: 'DELETE' });
    router.push('/auth');
  };

  return (
    <>
    <header className={`sticky top-0 z-40 transition-all duration-500 ${
      scrolled 
        ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
        : 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
    }`}>
      {/* 3D depth layer */}
      <div className="absolute inset-x-0 top-full h-1 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20 dark:from-primary/30 dark:via-primary/50 dark:to-primary/30" />
      
      <div className={`relative backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-all duration-500 ${
        scrolled 
          ? 'bg-white/80 dark:bg-gray-900/85' 
          : 'bg-white/90 dark:bg-gray-900/95'
      }`}>
        <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
          {/* Left: Logo + Nav */}
          <div className="flex items-center gap-5">
          <Link href={user ? '/dashboard' : '/'} className="flex items-center gap-3 group shrink-0">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5 animate-[gradientShift_6s_ease-in-out_infinite] bg-[length:200%_200%]">
                <Shield className="h-5 w-5 text-white animate-[spin_20s_linear_infinite]" />
              </div>
              <div className="absolute -inset-0.5 rounded-xl bg-primary/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>
            <div className="hidden lg:block">
              <span className="text-lg font-bold font-display bg-gradient-to-r from-foreground via-foreground/90 to-foreground/70 bg-clip-text text-transparent group-hover:from-primary group-hover:via-primary-glow group-hover:to-primary transition-all duration-300 leading-tight block">
                Abhayam
              </span>
              <span className="text-[10px] font-medium text-muted-foreground/70 leading-tight block">
                अभयम् · निर्भयं यात्रा
              </span>
            </div>
          </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`relative group/nav flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                      isActive 
                        ? 'text-primary' 
                        : 'text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    {/* Active background */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-primary/10 to-primary/5 border border-primary/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] dark:shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]" />
                    )}
                    {/* Hover background */}
                    {!isActive && (
                      <div className="absolute inset-0 rounded-xl bg-muted/60 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                    )}
                    
                    <item.icon className={`relative h-4 w-4 transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'group-hover/nav:scale-110 group-hover/nav:-translate-y-0.5'}`} />
                    <span className={`relative transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-primary to-primary-glow bg-clip-text text-transparent' : ''}`}>
                      {item.label}
                    </span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Theme Toggle */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative rounded-xl h-9 w-9 overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md"
              onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
            >
              <div className="absolute inset-0 bg-muted/60 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
              <span className="relative">
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </span>
            </Button>

            <Link href="/notifications">
              <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9 overflow-visible transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md">
                <div className="absolute inset-0 bg-muted/60 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative">
                  <Bell className="h-4 w-4" />
                  {notificationCount > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-bold text-white shadow-sm ring-2 ring-background animate-in zoom-in duration-300">
                      {notificationCount > 9 ? '9+' : notificationCount}
                    </span>
                  )}
                </span>
              </Button>
            </Link>

            {/* Feedback */}
            <Link href="/feedback">
              <Button variant="ghost" size="icon" className="relative rounded-xl h-9 w-9 overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md" title="Feedback">
                <div className="absolute inset-0 bg-muted/60 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative">
                  <MessageCircleQuestion className="h-4 w-4" />
                </span>
              </Button>
            </Link>

            {/* Admin Back Link */}
            {isAdmin && (
              <Link href="/admin" className="flex-none">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="relative rounded-xl border-2 border-rose-500/50 bg-rose-500/5 text-rose-600 dark:text-rose-400 hover:bg-rose-500/10 h-8 px-4 text-[10px] font-black transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-lg shadow-sm whitespace-nowrap min-w-[100px]"
                >
                  <Shield className="mr-2 h-3.5 w-3.5" />
                  ← ADMIN PORTAL
                </Button>
              </Link>
            )}

            {/* Verification Status Badge */}
            {user && !isAdmin && !userData?.isVerified && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full border-2 border-yellow-500/50 bg-yellow-500/5 text-yellow-600 dark:text-yellow-400 group transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 shadow-sm">
                <AlertTriangle className="h-3.5 w-3.5 animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-wider">Verification Pending</span>
              </div>
            )}

            {/* Profile Avatar */}
            <Link href="/profile">
              <Avatar className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 hover:shadow-lg ring-2 ring-primary/20 ring-offset-2 ring-offset-background">
                <AvatarImage src={userData?.photoURL || user?.photoURL || ''} />
                <AvatarFallback className={`font-semibold text-xs ${isAdmin ? 'bg-red-500 text-white' : 'bg-gradient-to-br from-primary/20 to-primary/10 text-primary'}`}>
                  {isAdmin ? 'A' : (() => {
                    const name = userData?.displayName || userData?.name || user?.displayName || '';
                    if (name.length >= 2) return name.slice(0, 2).toUpperCase();
                    if (name.length === 1) return name[0].toUpperCase();
                    return 'U';
                  })()}
                </AvatarFallback>
              </Avatar>
            </Link>

            {/* Menu / Sign Out */}
            <div className="relative" ref={menuRef}>
              <Button variant="ghost" size="icon" className={`relative rounded-xl h-9 w-9 overflow-hidden transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 hover:shadow-md ${mobileMenuOpen ? 'bg-muted/60 scale-105' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                <div className="absolute inset-0 bg-muted/60 rounded-xl opacity-0 hover:opacity-100 transition-opacity" />
                <span className="relative">
                  <Menu className="h-4 w-4" />
                </span>
              </Button>

              {mobileMenuOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border bg-popover/95 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.15)] dark:shadow-[0_12px_40px_rgba(0,0,0,0.4)] py-1 z-50 animate-in fade-in zoom-in-95 duration-200">
                  <button
                    onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                    className="w-full flex items-center gap-2 px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-lg mx-1 font-medium"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
    <SOSButton />
    </>
  );
}
