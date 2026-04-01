'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import SavedCheckCard from '@/components/safety/SavedCheckCard';
import SafetySkeleton from '@/components/safety/SafetySkeleton';

export default function SavedSafetyChecksPage() {
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchChecks();
  }, []);

  const fetchChecks = async () => {
    try {
      const res = await fetch('/api/safety/saved');
      const data = await res.json();
      setChecks(data.checks || []);
    } catch (error) {
      console.error('Failed to fetch saved checks:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto px-4 py-8 space-y-4"><SafetySkeleton /><SafetySkeleton /></div>;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Saved Safety Checks</h1>
        <Link href="/safety-checker"><Button>New Check</Button></Link>
      </div>
      {checks.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No saved checks yet</p>
          <Link href="/safety-checker"><Button>Check an Area</Button></Link>
        </div>
      ) : (
        <div className="space-y-4">
          {checks.map((check) => <SavedCheckCard key={check.id} check={check} />)}
        </div>
      )}
    </div>
  );
}
