'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { loginUser, registerUser, signInWithGoogle } from '@/lib/firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Shield, Users, MessageSquare, MapPin, ArrowLeft, Sparkles, Heart } from 'lucide-react';

export default function AuthPage() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (!isLogin && form.password !== form.confirmPassword) {
        toast.error('Passwords do not match');
        setLoading(false);
        return;
      }

      if (!isLogin && form.password.length < 8) {
        toast.error('Password must be at least 8 characters');
        setLoading(false);
        return;
      }

      let user;
      if (isLogin) {
        user = await loginUser(form.email, form.password);
      } else {
        user = await registerUser(form.email, form.password);
      }

      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });

      if (!res.ok) throw new Error('Session creation failed');

      toast.success(isLogin ? 'Welcome back!' : 'Account created!');
      router.push('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();
      const idToken = await user.getIdToken();
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idToken }),
      });
      if (!res.ok) throw new Error('Session creation failed');
      toast.success('Signed in with Google!');
      router.push('/onboarding');
    } catch (error: any) {
      toast.error(error.message || 'Google sign-in failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-6xl bg-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.05)] border border-white/10 ring-1 ring-black/5 overflow-hidden flex flex-col lg:flex-row min-h-[600px] relative">
      {/* 3D Depth Highlight */}
      <div className="absolute inset-0 pointer-events-none border-t border-white/20 rounded-3xl z-30" />
      
      {/* Left: Welcome Content (Desktop only split) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-orange-100/50 via-white to-orange-50 relative overflow-hidden group border-r">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
          <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-2xl" />
        </div>

        <div className="relative z-10 flex flex-col justify-between p-10 xl:p-16 w-full">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-xl font-bold text-slate-900 font-display block leading-tight">Abhayam</span>
                <span className="text-[10px] text-slate-500 leading-tight uppercase tracking-wider font-bold">Safe Travels · भारत</span>
              </div>
            </div>

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
              <Sparkles className="h-3 w-3 text-primary" />
              <span className="text-xs font-bold text-primary italic">Join the movement!</span>
            </div>

            {/* Heading */}
            <h1 className="text-4xl xl:text-5xl font-bold text-slate-900 leading-[1.1] mb-6">
              Travel <span className="text-primary italic font-display">Fearlessly</span>.<br />
              Grow Together.
            </h1>

            <p className="text-slate-600 text-base leading-relaxed mb-10 max-w-md">
              The premier safety-first travel companion platform designed specifically for the unique landscapes of India.
            </p>

            {/* Features list */}
            <div className="space-y-5">
              {[
                { icon: MapPin, title: 'Find Travel Companions', desc: 'Connect with verified travelers' },
                { icon: Shield, title: 'AI Safety Checker', desc: 'Real-time safety assessments' },
                { icon: MessageSquare, title: 'Real-time Chat', desc: 'Secure messaging with buddies' },
                { icon: Users, title: 'Verified Community', desc: 'Every member is verified' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-4 group/item">
                  <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover/item:scale-110">
                    <feature.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{feature.title}</h3>
                    <p className="text-xs text-slate-500">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-12 font-medium">
            <Heart className="h-3.5 w-3.5 text-primary" />
            <span>Empowering travelers across India since 2024</span>
          </div>
        </div>
      </div>

      {/* Right: Auth Form Section */}
      <div className="flex-1 flex flex-col bg-slate-50/50 backdrop-blur-sm relative">
        {/* Navigation handles */}
        <Link 
          href="/" 
          className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-all duration-300 text-sm font-bold group bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm"
        >
          <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-primary" />
          <span>Go Home</span>
        </Link>

        {/* Mobile Branding - Responsive Layout */}
        <div className="lg:hidden w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 pt-20 pb-10 shadow-sm relative overflow-hidden border-b border-slate-100">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                <Shield className="h-6 w-6 text-primary" />
              </div>
              <div>
                <span className="text-lg font-bold text-slate-900 block tracking-tight font-display">Abhayam</span>
                <span className="text-[10px] text-slate-500 block uppercase tracking-widest font-bold">Safe travels · भारत</span>
              </div>
            </div>

            <h2 className="text-3xl font-bold text-slate-900 mb-2 leading-tight">
              Welcome to the<br />
              <span className="text-primary italic font-display">Community</span>
            </h2>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm mb-6">
              Join thousands of travelers who trust Abhayam for safe, connected journeys.
            </p>

            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, title: 'Safe', desc: 'Verified profile' },
                { icon: Users, title: 'Social', desc: 'Find buddies' },
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-2xl bg-white border border-slate-100 shadow-sm">
                  <feature.icon className="h-4 w-4 text-primary" />
                  <div className="text-[10px] font-bold text-slate-900 uppercase">{feature.title}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Auth form area */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 lg:p-16">
          <div className="w-full max-w-sm">
            <div className="text-center mb-8 px-4">
              <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                {isLogin ? 'Welcome Back!' : 'Create Account'}
              </h2>
              <p className="text-slate-500 text-sm font-medium">
                {isLogin ? 'Sign in to access your travel dashboard' : 'Start your safer travel journey today'}
              </p>
            </div>

            <div className="space-y-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <Label htmlFor="email" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="name@example.com"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    required
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                  />
                </div>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <Label htmlFor="password" className="text-slate-700 text-xs font-bold uppercase tracking-wider">Password</Label>
                    {isLogin && <Link href="/forgot-password" title="reset password" className="text-[11px] text-primary font-bold hover:underline">Forgot?</Link>}
                  </div>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    required
                    className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                  />
                </div>
                {!isLogin && (
                  <div className="space-y-1.5 slide-in">
                    <Label htmlFor="confirmPassword" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Confirm Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                      required
                      className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                    />
                  </div>
                )}
                <Button 
                  type="submit" 
                  className="w-full h-12 text-base font-bold shadow-xl shadow-primary/20 bg-primary hover:bg-primary/90 rounded-xl transition-all duration-300 transform active:scale-95 mt-2" 
                  disabled={loading}
                >
                  {loading ? 'Processing...' : isLogin ? 'Sign In Now' : 'Join Abhayam'}
                </Button>
              </form>

              <div className="relative flex items-center gap-4 py-2">
                <div className="flex-1 h-[1px] bg-slate-200"></div>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Faster Access</span>
                <div className="flex-1 h-[1px] bg-slate-200"></div>
              </div>

              <Button 
                variant="outline" 
                className="w-full h-12 border-slate-200 hover:bg-slate-50 font-bold text-slate-700 rounded-xl transition-all flex items-center justify-center gap-3 group" 
                onClick={handleGoogleSignIn} 
                disabled={loading}
              >
                <svg className="h-5 w-5 transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" />
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Continue with Google
              </Button>

              <div className="text-center">
                <p className="text-slate-500 text-sm font-medium">
                  {isLogin ? "New to Abhayam?" : "Already verified?"}{' '}
                  <button 
                    className="text-primary font-bold hover:underline underline-offset-4 decoration-2" 
                    onClick={() => setIsLogin(!isLogin)}
                  >
                    {isLogin ? 'Create Account' : 'Sign In'}
                  </button>
                </p>
                <div className="mt-6 border-t border-slate-100 pt-4">
                  <Link href="/admin-login" className="text-[10px] font-bold text-slate-500 hover:text-primary transition-all duration-300 tracking-[0.2em] uppercase hover:underline underline-offset-4 decoration-2">
                    Admin Portal Access
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
