'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'react-hot-toast';

export default function TripRequestButton({ tripId, tripTitle }: { tripId: string; tripTitle: string }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/trips/${tripId}/requests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message }),
      });
      if (!res.ok) throw new Error('Failed to send request');
      toast.success('Request sent!');
      setOpen(false);
      setMessage('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild><Button>Request to Join</Button></DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Request to Join</DialogTitle><DialogDescription>Trip: {tripTitle}</DialogDescription></DialogHeader>
        <Textarea placeholder="Why do you want to join this trip?" value={message} onChange={(e) => setMessage(e.target.value)} maxLength={200} rows={4} />
        <p className="text-xs text-muted-foreground text-right">{message.length}/200</p>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={loading}>{loading ? 'Sending...' : 'Send Request'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
