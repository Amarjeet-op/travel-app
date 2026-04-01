'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/lib/firebase/auth';
import { toast } from 'react-hot-toast';
import { LogIn } from 'lucide-react';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await loginUser(form.email, form.password);
      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error('Session creation failed');
      toast.success('Welcome back!');
      router.push('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="login-email" className="text-base">Email</Label>
        <Input id="login-email" type="email" placeholder="you@example.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
      </div>
      <div className="space-y-2">
        <Label htmlFor="login-password" className="text-base">Password</Label>
        <Input id="login-password" type="password" placeholder="Enter your password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required />
      </div>
      <Button type="submit" className="w-full btn-primary-enhanced h-12 text-base rounded-xl" disabled={loading}>
        <LogIn className="mr-2 h-5 w-5" />
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{' '}
        <button type="button" className="text-primary font-medium hover:underline" onClick={onSwitchToRegister}>Sign up</button>
      </p>
    </form>
  );
}