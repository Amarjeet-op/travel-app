'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { CITIES, getCityByName } from '@/constants/cities';
import { toast } from 'react-hot-toast';

export default function NewTripPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fromCity: '',
    toCity: '',
    departureDate: '',
    returnDate: '',
    transportMode: 'train',
    maxCompanions: 2,
    budgetRange: 'budget',
    description: '',
    preferences: [] as string[],
  });

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

      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...form,
          fromCoordinates: { lat: fromCityData.lat, lng: fromCityData.lng },
          toCoordinates: { lat: toCityData.lat, lng: toCityData.lng },
          departureDate: new Date(form.departureDate),
          returnDate: form.returnDate ? new Date(form.returnDate) : null,
        }),
      });

      if (!res.ok) throw new Error('Failed to create trip');

      const data = await res.json();
      toast.success('Trip posted successfully!');
      router.push(`/trips/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const togglePreference = (pref: string) => {
    setForm((prev) => ({
      ...prev,
      preferences: prev.preferences.includes(pref)
        ? prev.preferences.filter((p) => p !== pref)
        : [...prev.preferences, pref],
    }));
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardHeader>
          <CardTitle>Post a New Trip</CardTitle>
          <CardDescription>Fill in your travel details to find companions</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fromCity">From City</Label>
                <select
                  id="fromCity"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.fromCity}
                  onChange={(e) => setForm({ ...form, fromCity: e.target.value })}
                  required
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="toCity">To City</Label>
                <select
                  id="toCity"
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  value={form.toCity}
                  onChange={(e) => setForm({ ...form, toCity: e.target.value })}
                  required
                >
                  <option value="">Select city</option>
                  {CITIES.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}, {city.state}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="departureDate">Departure Date</Label>
                <Input
                  id="departureDate"
                  type="date"
                  value={form.departureDate}
                  onChange={(e) => setForm({ ...form, departureDate: e.target.value })}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="returnDate">Return Date (Optional)</Label>
                <Input
                  id="returnDate"
                  type="date"
                  value={form.returnDate}
                  onChange={(e) => setForm({ ...form, returnDate: e.target.value })}
                  min={form.departureDate || new Date().toISOString().split('T')[0]}
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="transportMode">Transport</Label>
                <select
                  id="transportMode"
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
                <Label htmlFor="maxCompanions">Max Companions</Label>
                <Input
                  id="maxCompanions"
                  type="number"
                  min={1}
                  max={5}
                  value={form.maxCompanions}
                  onChange={(e) => setForm({ ...form, maxCompanions: parseInt(e.target.value) })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="budgetRange">Budget</Label>
                <select
                  id="budgetRange"
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Describe your trip, plans, and what you're looking for in a companion..."
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
                {['Women only', 'Non-smoker', 'Quiet traveler', 'Adventurous', 'Flexible plans'].map((pref) => (
                  <Badge
                    key={pref}
                    variant={form.preferences.includes(pref) ? 'default' : 'outline'}
                    className="cursor-pointer"
                    onClick={() => togglePreference(pref)}
                  >
                    {pref}
                  </Badge>
                ))}
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Posting Trip...' : 'Post Trip'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
