'use client';

import { AlertTriangle, MapPin } from 'lucide-react';
import { useSOSStore } from '@/stores/sosStore';
import { Button } from '@/components/ui/button';
import { toast } from 'react-hot-toast';

export default function SOSActiveAlert() {
  const { isActive, location, reportId, resetSOS } = useSOSStore();

  if (!isActive) return null;

  const handleCancel = async () => {
    try {
      await fetch('/api/sos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reportId }) });
      resetSOS();
      toast.success('SOS cancelled. Stay safe!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel SOS');
    }
  };

  return (
    <div className="fixed top-20 left-0 right-0 z-50 bg-red-600 text-white px-4 py-3 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-6 w-6 animate-pulse" />
          <div>
            <p className="font-bold">SOS Active</p>
            {location && <p className="text-sm flex items-center gap-1"><MapPin className="h-3 w-3" />{location.lat.toFixed(4)}, {location.lng.toFixed(4)}</p>}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleCancel}>I&apos;m Safe Now</Button>
      </div>
    </div>
  );
}
