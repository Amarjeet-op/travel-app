'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CITIES, getCityByName } from '@/constants/cities';
import { toast } from 'react-hot-toast';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function EditTripPage() {
  const params = useParams();
  const router = useRouter();
  const tripId = params.tripId as string;
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    departureDate: '',
    departureTime: '',
    returnDate: '',
    returnTime: '',
    transportMode: 'train',
    maxCompanions: 2,
    budgetRange: 'budget',
    description: '',
    preferences: [] as string[],
  });

  const preferenceOptions = [
    'Women Only', 'Men Only', 'Co-ed OK', 'Elderly OK', 'Senior Friendly',
    'Youth Only', 'Adults Only', 'Couples OK', 'Singles Only', 'Families OK',
    'Smoking', 'Non-Smoking', 'Vegetarian', 'Non-Vegetarian', 'Pets Allowed',
    'No Pets', 'Music', 'Silence', 'Chatty', 'Quiet', 'Breakfast', 'Lunch', 'Dinner',
    'Flexi Timing', 'Strict Timing', 'AC Preferred', 'Non-AC OK', 'Night Travel', 'Day Travel'
  ];

  useEffect(() => {
    fetchTrip();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tripId]);

  const fetchTrip = async () => {
    try {
      const res = await fetch(`/api/trips/${tripId}`);
      if (!res.ok) throw new Error('Failed to fetch trip');
      const data = await res.json();
      const formatDateTime = (d: any) => {
        if (!d) return { date: '', time: '' };
        let dateObj: Date;
        if (d._seconds) {
          dateObj = new Date(d._seconds * 1000);
        } else if (d.seconds) {
          dateObj = new Date(d.seconds * 1000);
        } else if (d.toDate) {
          dateObj = d.toDate();
        } else {
          dateObj = new Date(d);
        }
        if (isNaN(dateObj.getTime())) return { date: '', time: '' };
        return {
          date: dateObj.toISOString().split('T')[0],
          time: dateObj.toTimeString().slice(0, 5),
        };
      };
      const depDateTime = formatDateTime(data.departureDate);
      const retDateTime = formatDateTime(data.returnDate);
      setForm({
        fromCity: data.fromCity || '',
        toCity: data.toCity || '',
        departureDate: depDateTime.date,
        departureTime: depDateTime.time,
        returnDate: retDateTime.date,
        returnTime: retDateTime.time,
        transportMode: data.transportMode || 'train',
        maxCompanions: data.maxCompanions || 2,
        budgetRange: data.budgetRange || 'budget',
        description: data.description || '',
        preferences: data.preferences || [],
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to load trip');
      router.push(`/trips/${tripId}`);
    } finally {
      setFetching(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fromCityData = getCityByName(form.fromCity);
      const toCityData = getCityByName(form.toCity);
      if (!fromCityData || !toCityData) {
        toast.error('Please select valid cities');
        setLoading(false);
        return;
      }
      const res = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fromCoordinates: { lat: fromCityData.lat, lng: fromCityData.lng },
          toCoordinates: { lat: toCityData.lat, lng: toCityData.lng },
          departureDate: form.departureTime 
            ? new Date(`${form.departureDate}T${form.departureTime}:00`)
            : new Date(form.departureDate),
          returnDate: form.returnDate 
            ? (form.returnTime 
                ? new Date(`${form.returnDate}T${form.returnTime}:00`)
                : new Date(form.returnDate))
            : null,
        }),
      });
      if (!res.ok) throw new Error('Failed to update trip');
      toast.success('Trip updated!');
      router.push(`/trips/${tripId}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to update trip');
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (pref: string) =>
    setForm((p) => ({
      ...p,
      preferences: p.preferences.includes(pref)
        ? p.preferences.filter((x: string) => x !== pref)
        : [...p.preferences, pref],
    }));

  if (fetching) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="skeleton-shimmer h-96 rounded-lg" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href={`/trips/${tripId}`} className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4" />
        Back to Trip
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Trip</CardTitle>
          <CardDescription>Update your travel details</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>From City</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.fromCity}
                  onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label>To City</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.toCity}
                  onChange={(e) => setForm({ ...form, toCity: e.target.value })}
                  required
                >
                  <option value="">Select</option>
                  {CITIES.map((c) => (
                    <option key={c.name} value={c.name}>
                      {c.name}, {c.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Departure Date</Label>
                <Input
                  type="date"
                  value={form.departureDate}
                  onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label>Departure Time</Label>
                <Input
                  type="time"
                  value={form.departureTime}
                  onChange={(e) => setForm({ ...form, departureTime: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Return Date (Optional)</Label>
                <Input
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Return Time (Optional)</Label>
                <Input
                  type="time"
                  value={form.returnTime}
                  onChange={(e) => setForm({ ...form, returnTime: e.target.value })}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Transport</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.transportMode}
                  onChange={(e) => setForm({ ...form, transportMode: e.target.value })}
                >
                  <option value="train">Train</option>
                  <option value="bus">Bus</option>
                  <option value="flight">Flight</option>
                  <option value="car">Car</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label>Max Companions</Label>
                <Input
                  type="number"
                  min={1}
                  max={5}
                  value={form.maxCompanions}
                  onChange={(e) => setForm({ ...form, maxCompanions: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget</Label>
                <select
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.budgetRange}
                  onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}
                >
                  <option value="budget">Budget</option>
                  <option value="mid-range">Mid-range</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                placeholder="Describe your trip..."
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                maxLength={500}
                rows={4}
              />
              <p className="text-xs text-muted-foreground text-right">
                {form.description.length}/500
              </p>
            </div>
            <div className="space-y-2">
              <Label>Preferences</Label>
              <div className="flex flex-wrap gap-2">
                {preferenceOptions.map(
                  (p) => (
                    <Badge
                      key={p}
                      variant={form.preferences.includes(p) ? 'default' : 'outline'}
                      className="cursor-pointer"
                      onClick={() => togglePref(p)}
                    >
                      {p}
                    </Badge>
                  )
                )}
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Updating...' : 'Update Trip'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
