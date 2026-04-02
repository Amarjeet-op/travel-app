'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  LayoutDashboard, Users, MapPin, MessageSquare, FileText,
  Shield, LogOut, Menu, Sun, Moon, BarChart3, Settings,
  MessageCircleQuestion
} from 'lucide-react';
import { ThemeProvider, useTheme } from '@/components/providers/ThemeProvider';
import { useState, useEffect, useRef } from 'react';
import { signOutUser } from '@/lib/firebase/auth';
import { useRouter } from 'next/navigation';

const adminNavItems = [
  { href: '/admin', label: 'Overview', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/trips', label: 'Trips', icon: MapPin },
  { href: '/admin/feedback', label: 'Feedback', icon: FileText },
  { href: '/admin/reports', label: 'Reports', icon: BarChart3 },
  { href: '/admin/logs', label: 'Logs', icon: MessageSquare },
];

function AdminLayoutContent({ children }: { children: React.ReactNode }) {
  const { user } = useAuthContext();
  const { theme, setTheme } = useTheme();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
    <div className="min-h-screen flex flex-col bg-[#FAF7F2] dark:bg-background">
      {/* Admin Header */}
      <header className={`sticky top-0 z-40 transition-all duration-500 ${
        scrolled 
          ? 'shadow-[0_8px_32px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_32px_rgba(0,0,0,0.3)]' 
          : 'shadow-[0_4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_4px_20px_rgba(0,0,0,0.2)]'
      }`}>
        <div className="absolute inset-x-0 top-full h-1 bg-gradient-to-r from-red-500/20 via-red-500/40 to-red-500/20 dark:from-red-500/30 dark:via-red-500/50 dark:to-red-500/30" />
        <div className={`relative backdrop-blur-xl border-b border-white/20 dark:border-white/10 transition-all duration-500 ${
          scrolled ? 'bg-white/80 dark:bg-gray-900/85' : 'bg-white/90 dark:bg-gray-900/95'
        }`}>
          <div className="max-w-[1400px] mx-auto flex h-16 items-center justify-between px-4">
            {/* Left: Logo + Nav */}
            <div className="flex items-center gap-5">
              <Link href="/admin" className="flex items-center gap-3 group shrink-0">
                <div className="relative">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center shadow-[0_4px_12px_rgba(0,0,0,0.15)] group-hover:shadow-[0_6px_20px_rgba(0,0,0,0.25)] transition-all duration-300 group-hover:scale-105 group-hover:-translate-y-0.5">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  <div className="absolute -inset-0.5 rounded-xl bg-red-500/20 blur-sm -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                <div className="hidden lg:block">
                  <span className="text-lg font-bold font-display bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent leading-tight block">
                    Admin Panel
                  </span>
                  <span className="text-[10px] text-muted-foreground/70 leading-tight">Manage Abhayam</span>
                </div>
              </Link>

              <nav className="hidden lg:flex items-center gap-1">
                {adminNavItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`relative group/nav flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300 ${
                        isActive ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {isActive && (
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-b from-red-500/10 to-red-500/5 border border-red-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.1)]" />
                      )}
                      {!isActive && (
                        <div className="absolute inset-0 rounded-xl bg-muted/60 opacity-0 group-hover/nav:opacity-100 transition-opacity duration-300" />
                      )}
                      <item.icon className={`relative h-4 w-4 transition-all duration-300 ${isActive ? 'scale-110 -translate-y-0.5' : 'group-hover/nav:scale-110 group-hover/nav:-translate-y-0.5'}`} />
                      <span className={`relative transition-all duration-300 ${isActive ? 'bg-gradient-to-r from-red-600 to-rose-500 bg-clip-text text-transparent' : ''}`}>
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center gap-1.5 shrink-0">
              <Button 
                variant="ghost" 
                size="icon" 
                className="rounded-xl h-9 w-9 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
              >
                {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </Button>

              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="rounded-xl border-primary/30 text-primary hover:bg-primary/10 h-8 px-3 text-xs font-bold transition-all duration-300 hover:scale-105">
                  User View →
                </Button>
              </Link>

              <Link href="/profile">
                <Avatar className="h-8 w-8 cursor-pointer transition-all duration-300 hover:scale-110 hover:-translate-y-0.5 ring-2 ring-red-500/20 ring-offset-2 ring-offset-background">
                  <AvatarImage src={user?.photoURL || ''} />
                  <AvatarFallback className="bg-red-500 text-white font-semibold text-xs">
                    A
                  </AvatarFallback>
                </Avatar>
              </Link>

              <div className="relative" ref={menuRef}>
                <Button variant="ghost" size="icon" className={`rounded-xl h-9 w-9 transition-all duration-300 hover:scale-105 hover:-translate-y-0.5 ${mobileMenuOpen ? 'bg-muted/60 scale-105' : ''}`} onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
                  <Menu className="h-4 w-4" />
                </Button>

                {mobileMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] p-2 z-50 animate-scale-in">
                    <div className="mb-2 px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Admin Navigation</p>
                    </div>
                    <div className="space-y-1">
                      {adminNavItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.href}
                            href={item.href}
                            onClick={() => setMobileMenuOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 ${
                              isActive 
                                ? 'bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <item.icon className={`h-4 w-4 ${isActive ? 'scale-110' : ''}`} />
                            {item.label}
                          </Link>
                        );
                      })}
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold text-red-600 hover:bg-red-50 transition-all dark:hover:bg-red-500/10"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-8">
        {children}
      </main>
    </div>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <AdminLayoutContent>{children}</AdminLayoutContent>
    </ThemeProvider>
  );
}
