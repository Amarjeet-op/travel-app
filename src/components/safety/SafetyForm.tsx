'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { CITIES } from '@/constants/cities';
import { Shield } from 'lucide-react';

export default function SafetyForm({ onCheck }: { onCheck: (data: any) => void }) {
  const [form, setForm] = useState({ area: '', city: '', travelerType: 'solo-woman', timeOfVisit: 'evening', concerns: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await onCheck(form);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader><CardTitle className="flex items-center gap-2"><Shield className="h-5 w-5" />Check Area Safety</CardTitle></CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Area/Locality</Label><Input placeholder="e.g., Connaught Place" value={form.area} onChange={(e) => setForm({ ...form, area: e.target.value })} required /></div>
            <div className="space-y-2"><Label>City</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} required><option value="">Select</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}</select></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Traveler Type</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.travelerType} onChange={(e) => setForm({ ...form, travelerType: e.target.value })}><option value="solo-woman">Solo Woman</option><option value="solo-man">Solo Man</option><option value="couple">Couple</option><option value="group">Group</option><option value="family">Family</option></select></div>
            <div className="space-y-2"><Label>Time of Visit</Label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.timeOfVisit} onChange={(e) => setForm({ ...form, timeOfVisit: e.target.value })}><option value="morning">Morning</option><option value="afternoon">Afternoon</option><option value="evening">Evening</option><option value="night">Night</option></select></div>
          </div>
          <div className="space-y-2"><Label>Specific Concerns (Optional)</Label><Textarea placeholder="e.g., Is it safe to walk at night?" value={form.concerns} onChange={(e) => setForm({ ...form, concerns: e.target.value })} rows={3} /></div>
          <Button type="submit" className="w-full" disabled={loading}>{loading ? 'Checking...' : 'Check Safety'}</Button>
        </form>
      </CardContent>
    </Card>
  );
}
