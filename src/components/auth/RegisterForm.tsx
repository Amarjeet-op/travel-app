'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { registerUser } from '@/lib/firebase/auth';
import { toast } from 'react-hot-toast';
import { UserPlus } from 'lucide-react';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return; }
    setLoading(true);
    try {
      const user = await registerUser(form.email, form.password);
      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/session', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ idToken }) });
      if (!res.ok) throw new Error('Session creation failed');
      toast.success('Account created!');
      router.push('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="reg-email" className="text-base">Email</Label>
        <Input id="reg-email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-password" className="text-base">Password</Label>
        <Input id="reg-password" type="password" placeholder="Min 8 characters" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="reg-confirm" className="text-base">Confirm Password</Label>
        <Input id="reg-confirm" type="password" placeholder="Re-enter your password" value={form.confirmPassword} onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })} required />
      </div>
      <Button type="submit" className="w-full btn-primary-enhanced h-12 text-base rounded-xl" disabled={loading}>
        <UserPlus className="mr-2 h-5 w-5" />
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <button type="button" className="text-primary font-medium hover:underline" onClick={onSwitchToLogin}>Sign in</button>
      </p>
    </form>
  );
}