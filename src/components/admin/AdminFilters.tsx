'use client';

import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';

interface AdminFiltersProps {
  search?: string;
  onSearchChange?: (value: string) => void;
  status?: string;
  onStatusChange?: (value: string) => void;
  statusOptions?: { value: string; label: string }[];
  type?: string;
  onTypeChange?: (value: string) => void;
  typeOptions?: { value: string; label: string }[];
  placeholder?: string;
}

export default function AdminFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  statusOptions = [],
  type,
  onTypeChange,
  typeOptions = [],
  placeholder = 'Search...',
}: AdminFiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {onSearchChange && (
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={placeholder}
            className="pl-10"
            value={search || ''}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      )}

      {onStatusChange && statusOptions.length > 0 && (
        <Select value={status || 'all'} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statusOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {onTypeChange && typeOptions.length > 0 && (
        <Select value={type || 'all'} onValueChange={onTypeChange}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            {typeOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
