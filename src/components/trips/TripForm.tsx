'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { CITIES, getCityByName } from '@/constants/cities';
import { toast } from 'react-hot-toast';

export default function TripForm({ initialData, onSubmit }: { initialData?: any; onSubmit?: (data: any) => void }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    fromCity: initialData?.fromCity || '',
    toCity: initialData?.toCity || '',
    departureDate: initialData?.departureDate || '',
    returnDate: initialData?.returnDate || '',
    transportMode: initialData?.transportMode || 'train',
    maxCompanions: initialData?.maxCompanions || 2,
    budgetRange: initialData?.budgetRange || 'budget',
    description: initialData?.description || '',
    preferences: initialData?.preferences || [],
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const fromCityData = getCityByName(form.fromCity);
      const toCityData = getCityByName(form.toCity);
      if (!fromCityData || !toCityData) { toast.error('Please select valid cities'); setLoading(false); return; }
      const res = await fetch('/api/trips', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, fromCoordinates: { lat: fromCityData.lat, lng: fromCityData.lng }, toCoordinates: { lat: toCityData.lat, lng: toCityData.lng }, departureDate: new Date(form.departureDate), returnDate: form.returnDate ? new Date(form.returnDate) : null }),
      });
      if (!res.ok) throw new Error('Failed to create trip');
      const data = await res.json();
      toast.success('Trip posted!');
      onSubmit?.(data);
      router.push(`/trips/${data.id}`);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create trip');
    } finally {
      setLoading(false);
    }
  };

  const togglePref = (pref: string) => setForm((p) => ({ ...p, preferences: p.preferences.includes(pref) ? p.preferences.filter((x: string) => x !== pref) : [...p.preferences, pref] }));

  return (
    <Card>
      <CardHeader><CardTitle>{initialData ? 'Edit Trip' : 'Post a New Trip'}</CardTitle><CardDescription>Fill in your travel details</CardDescription></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>From City</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.fromCity} onChange={(e) => setForm({ ...form, fromCity: e.target.value })} required><option value="">Select</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}</select></div>
            <div className="space-y-2"><Label>To City</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.toCity} onChange={(e) => setForm({ ...form, toCity: e.target.value })} required><option value="">Select</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Departure Date</Label><Input type="date" value={form.departureDate} onChange={(e) => setForm({ ...form, departureDate: e.target.value })} min={new Date().toISOString().split('T')[0]} required /></div>
            <div className="space-y-2"><Label>Return Date (Optional)</Label><Input type="date" value={form.returnDate} onChange={(e) => setForm({ ...form, returnDate: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Transport</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.transportMode} onChange={(e) => setForm({ ...form, transportMode: e.target.value })}><option value="train">Train</option><option value="bus">Bus</option><option value="flight">Flight</option><option value="car">Car</option><option value="other">Other</option></select></div>
            <div className="space-y-2"><Label>Max Companions</Label><Input type="number" min={1} max={5} value={form.maxCompanions} onChange={(e) => setForm({ ...form, maxCompanions: parseInt(e.target.value) })} /></div>
            <div className="space-y-2"><Label>Budget</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.budgetRange} onChange={(e) => setForm({ ...form, budgetRange: e.target.value })}><option value="budget">Budget</option><option value="mid-range">Mid-range</option><option value="premium">Premium</option></select></div>
          </div>
          <div className="space-y-2"><Label>Description</Label><Textarea placeholder="Describe your trip..." value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} maxLength={500} rows={4} /><p className="text-xs text-muted-foreground text-right">{form.description.length}/500</p></div>
          <div className="space-y-2"><Label>Preferences</Label><div className="flex flex-wrap gap-2">{['Women only', 'Non-smoker', 'Quiet traveler', 'Adventurous', 'Flexible plans'].map((p) => <Badge key={p} variant={form.preferences.includes(p) ? 'default' : 'outline'} className="cursor-pointer" onClick={() => togglePref(p)}>{p}</Badge>)}</div></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Posting...' : 'Post Trip'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
