'use client';

import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Calendar, Users, Train, Bus, Plane, Car, Filter, ArrowRight, Plus } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';

const transportIcons: Record<string, any> = {
  train: Train,
  bus: Bus,
  flight: Plane,
  car: Car,
};

const transportColors: Record<string, { gradient: string; iconBg: string; accent: string; shadow: string }> = {
  train: {
    gradient: 'from-blue-500/10 to-cyan-500/10 dark:from-blue-500/20 dark:to-cyan-500/20',
    iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
    accent: 'from-blue-500 to-cyan-500',
    shadow: 'shadow-blue-500/30',
  },
  bus: {
    gradient: 'from-amber-500/10 to-orange-500/10 dark:from-amber-500/20 dark:to-orange-500/20',
    iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
    accent: 'from-amber-500 to-orange-500',
    shadow: 'shadow-amber-500/30',
  },
  flight: {
    gradient: 'from-violet-500/10 to-purple-500/10 dark:from-violet-500/20 dark:to-purple-500/20',
    iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500',
    accent: 'from-violet-500 to-purple-500',
    shadow: 'shadow-violet-500/30',
  },
  car: {
    gradient: 'from-emerald-500/10 to-green-500/10 dark:from-emerald-500/20 dark:to-green-500/20',
    iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
    accent: 'from-emerald-500 to-green-500',
    shadow: 'shadow-emerald-500/30',
  },
};

export default function TripsPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ fromCity: '', toCity: '', transportMode: '' });
  const [showFilters, setShowFilters] = useState(false);

  const { user, userData } = useAuthContext();
  const isVerified = userData?.isVerified === true;

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    try {
      const res = await fetch('/api/trips');
      const data = await res.json();
      setTrips(data.trips || []);
    } catch (error) {
      console.error('Failed to fetch trips:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrips = trips.filter((trip) => {
    if (trip.status === 'deleted' || trip.status === 'cancelled') return false;
    if (filters.fromCity && !trip.fromCity?.toLowerCase().includes(filters.fromCity.toLowerCase())) return false;
    if (filters.toCity && !trip.toCity?.toLowerCase().includes(filters.toCity.toLowerCase())) return false;
    if (filters.transportMode && trip.transportMode !== filters.transportMode) return false;
    return true;
  });

  if (loading) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-56 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            Browse <span className="text-gradient">Trips</span>
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            {filteredTrips.length} trip{filteredTrips.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="gap-2">
            <Filter className="h-4 w-4" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
          <Link href={isVerified ? "/trips/new" : "#"}>
            <Button size="sm" className="gap-2" disabled={!isVerified}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">
                {isVerified ? 'Post a Trip' : 'Verification Required'}
              </span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="mb-6 p-4 rounded-xl bg-card border border-border/50">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Input
              placeholder="From city..."
              value={filters.fromCity}
              onChange={(e) => setFilters({ ...filters, fromCity: e.target.value })}
              className="h-10"
            />
            <Input
              placeholder="To city..."
              value={filters.toCity}
              onChange={(e) => setFilters({ ...filters, toCity: e.target.value })}
              className="h-10"
            />
            <select
              className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              value={filters.transportMode}
              onChange={(e) => setFilters({ ...filters, transportMode: e.target.value })}
            >
              <option value="">All Transport</option>
              <option value="train">Train</option>
              <option value="bus">Bus</option>
              <option value="flight">Flight</option>
              <option value="car">Car</option>
            </select>
          </div>
        </div>
      )}

      {/* Trip Cards */}
      {filteredTrips.length === 0 ? (
        <div className="text-center py-16">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No trips found</h3>
          <p className="text-muted-foreground mb-6">Try adjusting your filters or post a new trip</p>
          <Link href="/trips/new">
            <Button>
              <Plus className="h-4 w-4 mr-2" /> Post a Trip
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 lg:gap-6">
          {filteredTrips.map((trip) => {
            const TransportIcon = transportIcons[trip.transportMode] || MapPin;
            const colors = transportColors[trip.transportMode] || transportColors.car;

            return (
              <Link key={trip.id} href={`/trips/${trip.id}`}>
                <div className="group relative rounded-2xl bg-gradient-to-br p-px transition-all duration-300 hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-2xl cursor-pointer"
                  style={{ backgroundImage: `linear-gradient(to bottom right, rgba(0,0,0,0.05), rgba(0,0,0,0.02))` }}
                >
                  {/* 3D shadow layer */}
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                  
                  <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 h-full border border-transparent group-hover:border-primary/10 dark:group-hover:border-primary/20 transition-all duration-300">
                    {/* Route */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-10 h-10 ${colors.iconBg} rounded-lg flex items-center justify-center shadow-lg ${colors.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                          <TransportIcon className="h-5 w-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-bold text-sm sm:text-base leading-tight break-words">
                            {trip.fromCity} <span className="text-primary mx-0.5 opacity-50">→</span> {trip.toCity}
                          </p>
                          <p className="text-[10px] sm:text-xs text-muted-foreground mt-0.5 font-medium uppercase tracking-widest">
                            Trip Route
                          </p>
                        </div>
                      </div>
                      <Badge variant={trip.status === 'active' ? 'success' : 'secondary'} className="shrink-0">
                        {trip.status}
                      </Badge>
                    </div>

                    {/* Details */}
                    <div className="space-y-2.5 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-primary shrink-0" />
                        <span>
                          {trip.departureDate?.toDate ? format(trip.departureDate.toDate(), 'MMM dd, yyyy') : trip.departureDate}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-primary shrink-0" />
                        <span>{trip.currentCompanions || 0}/{trip.maxCompanions} companions</span>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-3 border-t border-border/50">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-7 w-7">
                          <AvatarImage src={trip.creatorPhoto || ''} />
                          <AvatarFallback className="text-xs bg-primary/10 text-primary">
                            {trip.creatorName?.[0] || 'U'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium truncate max-w-[100px]">{trip.creatorName}</span>
                        {trip.creatorVerified && (
                          <Badge variant="success" className="text-xs px-1.5">✓</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-xs font-medium text-muted-foreground group-hover:text-primary transition-colors">
                        <span>View</span>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
