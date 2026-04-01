'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuthContext } from '@/components/providers/AuthProvider';
import { CITIES } from '@/constants/cities';
import { toast } from 'react-hot-toast';
import { db, storage } from '@/lib/firebase/config';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function OnboardingForm() {
  const router = useRouter();
  const { user } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: '', gender: '', age: '', phone: '', homeCity: '',
    bio: '', emergencyContactName: '', emergencyContactPhone: '', emergencyContactRelationship: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);

  const handleNext = () => {
    if (step === 1 && (!form.displayName || !form.gender || !form.age)) { toast.error('Please fill all fields'); return; }
    if (step === 2 && (!form.phone || !form.homeCity)) { toast.error('Please fill all fields'); return; }
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    try {
      let photoURL = null;
      if (photo) {
        const photoRef = ref(storage, `profiles/${user.uid}/avatar.jpg`);
        await uploadBytes(photoRef, photo);
        photoURL = await getDownloadURL(photoRef);
      }
      await setDoc(doc(db, 'users', user.uid), {
        displayName: form.displayName, gender: form.gender, age: parseInt(form.age),
        phone: form.phone, homeCity: form.homeCity, bio: form.bio, photoURL,
        emergencyContacts: [{ name: form.emergencyContactName, phone: form.emergencyContactPhone, relationship: form.emergencyContactRelationship }],
        profileCompleted: true, updatedAt: serverTimestamp(),
      }, { merge: true });
      toast.success('Profile completed!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="w-full bg-muted rounded-full h-2">
        <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${(step / 3) * 100}%` }} />
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {step === 1 && (
          <>
            <div className="space-y-2"><Label>Full Name</Label><Input value={form.displayName} onChange={(e) => setForm({ ...form, displayName: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Gender</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.gender} onChange={(e) => setForm({ ...form, gender: e.target.value })} required>
                <option value="">Select</option><option value="male">Male</option><option value="female">Female</option><option value="other">Other</option><option value="prefer-not-to-say">Prefer not to say</option>
              </select>
            </div>
            <div className="space-y-2"><Label>Age</Label><Input type="number" min={18} value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} required /></div>
            <Button type="button" onClick={handleNext} className="w-full">Next</Button>
          </>
        )}
        {step === 2 && (
          <>
            <div className="space-y-2"><Label>Phone</Label><Input type="tel" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Home City</Label>
              <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm" value={form.homeCity} onChange={(e) => setForm({ ...form, homeCity: e.target.value })} required>
                <option value="">Select</option>{CITIES.map((c) => <option key={c.name} value={c.name}>{c.name}, {c.state}</option>)}
              </select>
            </div>
            <div className="space-y-2"><Label>Photo (Optional)</Label><Input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] || null)} /></div>
            <div className="flex gap-4"><Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1">Back</Button><Button type="button" onClick={handleNext} className="flex-1">Next</Button></div>
          </>
        )}
        {step === 3 && (
          <>
            <div className="space-y-2"><Label>Bio</Label><Textarea placeholder="Tell others about yourself..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} maxLength={300} rows={3} /></div>
            <div className="space-y-2"><Label>Emergency Contact</Label>
              <Input placeholder="Name" value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} required />
              <Input placeholder="Phone" value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} required />
              <Input placeholder="Relationship" value={form.emergencyContactRelationship} onChange={(e) => setForm({ ...form, emergencyContactRelationship: e.target.value })} required />
            </div>
            <div className="flex gap-4"><Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1">Back</Button><Button type="submit" disabled={loading} className="flex-1">{loading ? 'Saving...' : 'Complete'}</Button></div>
          </>
        )}
      </form>
    </div>
  );
}
