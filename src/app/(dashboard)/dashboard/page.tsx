'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Users, MapPin, Shield, MessageSquare, Bell, User, ArrowRight, CheckCircle, AlertTriangle } from 'lucide-react';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, userData, loading } = useAuthContext();
  const router = useRouter();

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const isVerified = userData?.isVerified === true;
  const displayName = userData?.displayName || userData?.name || user?.displayName || 'Traveler';

  const cards = [
    {
      href: '/trips',
      title: 'Browse Trips',
      desc: 'Find travel companions and join trips',
      icon: MapPin,
      gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
      iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      iconShadow: 'shadow-blue-500/30',
      accent: 'from-blue-500 to-cyan-500',
    },
    {
      href: '/trips/new',
      title: 'Post a Trip',
      desc: isVerified ? 'Create a new travel plan and find companions' : 'Account verification required to post trips',
      icon: Users,
      gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
      iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
      iconShadow: 'shadow-violet-500/30',
      accent: 'from-violet-500 to-purple-500',
      disabled: !isVerified
    },
    {
      href: '/safety-checker',
      title: 'Safety Checker',
      desc: 'Check area safety with AI powered analysis',
      icon: Shield,
      gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
      iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
      iconShadow: 'shadow-emerald-500/30',
      accent: 'from-emerald-500 to-green-500',
      disabled: !isVerified
    },
    {
      href: '/messages',
      title: 'Messages',
      desc: 'Chat with your travel companions in real-time',
      icon: MessageSquare,
      gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
      iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
      iconShadow: 'shadow-amber-500/30',
      accent: 'from-amber-500 to-orange-500',
      disabled: !isVerified
    },
    {
      href: '/notifications',
      title: 'Notifications',
      desc: 'View your alerts and important updates',
      icon: Bell,
      gradient: 'from-rose-500/10 to-pink-500/10 dark:from-rose-500/20 dark:to-pink-500/20',
      iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500',
      iconShadow: 'shadow-rose-500/30',
      accent: 'from-rose-500 to-pink-500',
    },
    {
      href: '/profile',
      title: 'My Profile',
      desc: isVerified ? 'Manage your account and preferences' : 'Complete your profile for verification',
      icon: User,
      gradient: 'from-sky-500/10 to-indigo-500/10 dark:from-sky-500/20 dark:to-indigo-500/20',
      iconBg: 'bg-gradient-to-br from-sky-500 to-indigo-500',
      iconShadow: 'shadow-sky-500/30',
      accent: 'from-sky-500 to-indigo-500',
    },
  ];

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Verification Warning */}
      {!isVerified && (
        <div className="mb-8 p-4 rounded-xl border border-yellow-500/20 bg-yellow-500/10 flex items-center gap-4 animate-in fade-in slide-in-from-top-4 duration-500">
          <div className="h-10 w-10 rounded-full bg-yellow-500 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-black" />
          </div>
          <div>
            <h3 className="font-bold text-yellow-600 dark:text-yellow-500">Verification Pending</h3>
            <p className="text-sm text-yellow-700/80 dark:text-yellow-500/70">
              Your account is currently in <span className="font-bold">Read-Only</span> mode while we review your profile. You&apos;ll be notified once an admin approves your verification request.
            </p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
          Welcome back, <span className="text-gradient capitalize">{displayName}</span>
          {isVerified && <CheckCircle className="inline-block ml-2 h-6 w-6 text-green-500" />}
        </h1>
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">
          {isVerified ? 'Your account is verified. All features are enabled.' : 'Explore travel plans while your profile is being verified.'}
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
        {cards.map((card) => (
          <Link 
            key={card.href} 
            href={isVerified || !card.disabled ? card.href : '#'}
            onClick={(e) => {
              if (!isVerified && card.disabled) {
                e.preventDefault();
                // Optional: add a toast message here
              }
            }}
          >
            <div
              className={`group relative rounded-2xl bg-gradient-to-br ${card.gradient} p-px transition-all duration-300 ${!isVerified && card.disabled ? 'opacity-60 cursor-not-allowed' : 'hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl cursor-pointer'}`}
            >
              {/* 3D shadow layer */}
              <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${card.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
              
              <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 h-full border border-transparent group-hover:border-primary/10 dark:group-hover:border-primary/20 transition-all duration-300">
                {/* Icon */}
                <div className={`w-12 h-12 sm:w-14 sm:h-14 ${card.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg ${card.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                  <card.icon className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
                </div>

                {/* Content */}
                <h3 className="text-lg sm:text-xl font-semibold mb-1.5 group-hover:text-primary transition-colors">
                  {card.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  {card.desc}
                </p>

                {/* Arrow */}
                <div className={`mt-4 flex items-center gap-1.5 text-sm font-medium ${!isVerified && card.disabled ? 'text-muted-foreground/50' : 'text-muted-foreground group-hover:text-primary'} transition-colors`}>
                  <span>{!isVerified && card.disabled ? 'Locked' : 'Explore'}</span>
                  {!isVerified && card.disabled ? <Shield className="h-4 w-4" /> : <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
