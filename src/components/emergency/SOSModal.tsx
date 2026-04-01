'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { AlertTriangle, Loader2, MapPin, CheckCircle } from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { toast } from 'react-hot-toast';
import { useSOSStore } from '@/stores/sosStore';

export default function SOSModal({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const [step, setStep] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [sending, setSending] = useState(false);
  const { location, loading, getLocation } = useGeolocation();
  const { setSOSActive } = useSOSStore();

  const startCountdown = () => {
    setStep(2);
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) { clearInterval(interval); sendSOS(); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const sendSOS = async () => {
    setSending(true);
    getLocation();
    try {
      const res = await fetch('/api/sos', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ location }) });
      if (!res.ok) throw new Error('Failed to send SOS');
      const data = await res.json();
      setSOSActive(true, location, data.reportId);
      setStep(3);
      toast.success('SOS alert sent! Help is on the way.');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send SOS');
    } finally {
      setSending(false);
    }
  };

  const cancelSOS = async () => {
    try {
      await fetch('/api/sos', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reportId: useSOSStore.getState().reportId }) });
      setSOSActive(false, null, null);
      toast.success('SOS cancelled. Stay safe!');
      onOpenChange(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to cancel SOS');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600"><AlertTriangle className="h-6 w-6" />Emergency SOS</DialogTitle>
        </DialogHeader>
        {step === 1 && (
          <>
            <DialogDescription className="text-base">
              <p className="font-semibold text-foreground mb-2">Are you in an emergency?</p>
              <p>This will alert your emergency contacts and send your location to our safety team.</p>
              <p className="mt-2 text-sm text-muted-foreground">If in immediate danger, call <strong>112</strong> first.</p>
            </DialogDescription>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
              <Button variant="destructive" onClick={startCountdown}>Yes, I Need Help</Button>
            </DialogFooter>
          </>
        )}
        {step === 2 && (
          <>
            <div className="text-center py-8">
              <p className="text-6xl font-bold text-red-600 mb-4">{countdown}</p>
              <p className="text-muted-foreground">Sending SOS alert...</p>
              {loading && <p className="text-sm mt-2">Getting your location...</p>}
              {location && <p className="text-sm mt-2 flex items-center justify-center gap-1"><MapPin className="h-3 w-3" />Location captured</p>}
            </div>
            <DialogFooter><Button variant="outline" onClick={() => { setStep(1); }}>Cancel</Button></DialogFooter>
          </>
        )}
        {step === 3 && (
          <>
            <div className="text-center py-8">
              <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
              <p className="text-xl font-semibold mb-2">Alert Sent!</p>
              <p className="text-muted-foreground">Stay safe. Help is on the way.</p>
            </div>
            <DialogFooter className="flex-col gap-2 sm:flex-row">
              <Button variant="outline" onClick={() => onOpenChange(false)}>Close</Button>
              <Button onClick={cancelSOS}>I&apos;m Safe Now</Button>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
