'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CITIES } from '@/constants/cities';
import { Filter, X } from 'lucide-react';

interface TripFiltersProps {
  filters: { fromCity: string; toCity: string; transportMode: string; budgetRange: string; womenOnly: boolean };
  onFilterChange: (filters: any) => void;
  onReset: () => void;
}

export default function TripFilters({ filters, onFilterChange, onReset }: TripFiltersProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold flex items-center gap-2"><Filter className="h-4 w-4" />Filters</h3>
        <Button variant="ghost" size="sm" onClick={() => setOpen(!open)}>{open ? 'Hide' : 'Show'}</Button>
      </div>
      {open && (
        <div className="space-y-4 p-4 border rounded-lg">
          <div><label className="text-sm font-medium mb-1 block">From City</label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={filters.fromCity} onChange={(e) => onFilterChange({ ...filters, fromCity: e.target.value })}><option value="">All</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
          <div><label className="text-sm font-medium mb-1 block">To City</label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={filters.toCity} onChange={(e) => onFilterChange({ ...filters, toCity: e.target.value })}><option value="">All</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}</select></div>
          <div><label className="text-sm font-medium mb-1 block">Transport</label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={filters.transportMode} onChange={(e) => onFilterChange({ ...filters, transportMode: e.target.value })}><option value="">All</option><option value="train">Train</option><option value="bus">Bus</option><option value="flight">Flight</option><option value="car">Car</option></select></div>
          <div><label className="text-sm font-medium mb-1 block">Budget</label><select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={filters.budgetRange} onChange={(e) => onFilterChange({ ...filters, budgetRange: e.target.value })}><option value="">All</option><option value="budget">Budget</option><option value="mid-range">Mid-range</option><option value="premium">Premium</option></select></div>
          <div className="flex items-center gap-2"><input type="checkbox" id="womenOnly" checked={filters.womenOnly} onChange={(e) => onFilterChange({ ...filters, womenOnly: e.target.checked })} /><label htmlFor="womenOnly" className="text-sm">Women only</label></div>
          <Button variant="outline" size="sm" onClick={onReset} className="w-full"><X className="h-3 w-3 mr-1" />Reset Filters</Button>
        </div>
      )}
    </div>
  );
}
