'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { loginUser } from '@/lib/firebase/auth';
import { toast } from 'react-hot-toast';
import Link from 'next/link';
import { Shield, Lock, ArrowLeft, Sparkles, Eye, EyeOff, Users, AlertTriangle, BarChart3, Key } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);

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

      const verifyRes = await fetch('/api/auth/verify');
      const verifyData = await verifyRes.json();

      if (!verifyData.admin) {
        toast.error('You do not have admin access');
        await fetch('/api/auth/session', { method: 'DELETE' });
        router.push('/auth');
        return;
      }

      toast.success('Welcome, Admin!');
      router.push('/admin');
    } catch (error: any) {
      toast.error(error.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-red-500/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-amber-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-red-500/3 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(0,0,0,0.03)_1px,transparent_0)] bg-[size:40px_40px]" />
      </div>

      <motion.div 
        className="relative z-10 w-full max-w-6xl min-h-[600px] bg-card rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1),0_10px_30px_rgba(0,0,0,0.05)] border border-white/10 ring-1 ring-black/5 overflow-hidden flex flex-col lg:flex-row"
        initial={{ opacity: 0, y: 30, rotateX: 5 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
        style={{ perspective: '1000px' }}
      >
        {/* 3D Depth Highlight */}
        <div className="absolute inset-0 pointer-events-none border-t border-white/20 rounded-3xl z-30" />
        
        {/* Left: Admin Branding (Desktop only split) */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-red-900 via-red-800 to-orange-900 relative overflow-hidden border-r border-white/10">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-white/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-white/5 rounded-full blur-2xl" />
            {/* Shield pattern */}
            <div className="absolute inset-0 opacity-5 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.3)_1px,transparent_0)] bg-[size:30px_30px]" />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div>
                  <span className="text-xl font-bold text-white font-display block leading-tight">Abhayam</span>
                  <span className="text-[10px] text-white/60 leading-tight uppercase tracking-wider font-bold">अभयम् · Admin Portal</span>
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-6">
                <Lock className="h-3 w-3 text-white" />
                <span className="text-xs font-bold text-white italic">Secure Access Only</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl xl:text-4xl font-bold text-white leading-[1.1] mb-4">
                Admin<br />
                <span className="text-orange-300 italic font-display">Dashboard</span>
              </h1>

              <p className="text-white/70 text-sm leading-relaxed mb-8 max-w-sm">
                Manage users, moderate content, and ensure platform safety from the command center.
              </p>

              {/* Feature cards */}
              <div className="space-y-4">
                {[
                  { icon: Users, title: 'User Management', desc: 'Verify & manage accounts' },
                  { icon: AlertTriangle, title: 'Safety Reports', desc: 'Handle SOS & incidents' },
                  { icon: BarChart3, title: 'Analytics', desc: 'Platform insights & stats' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-4 group/item">
                    <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center shrink-0 transition-transform group-hover/item:scale-110">
                      <feature.icon className="h-5 w-5 text-orange-300" />
                    </div>
                    <div>
                      <h3 className="font-bold text-white text-sm">{feature.title}</h3>
                      <p className="text-xs text-white/50">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-white/40 text-[11px] mt-8 font-medium">
              <Key className="h-3.5 w-3.5 text-orange-300" />
              <span>Authorized personnel only</span>
            </div>
          </div>
        </div>

        {/* Right: Login Form Section */}
        <div className="flex-1 flex flex-col bg-slate-50/50 backdrop-blur-sm relative">
          {/* Back to home */}
          <Link 
            href="/" 
            className="absolute top-6 left-6 z-20 inline-flex items-center gap-2 text-slate-600 hover:text-primary transition-all duration-300 text-sm font-bold group bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform text-primary" />
            <span>Go Home</span>
          </Link>

          {/* Mobile Branding */}
          <div className="lg:hidden w-full bg-gradient-to-br from-red-900 via-red-800 to-orange-900 p-6 pt-20 pb-8 shadow-sm relative overflow-hidden border-b border-white/10">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
                  <Shield className="h-5 w-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white font-display">Abhayam Admin</span>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2 leading-tight">
                Admin Portal
              </h2>
              <p className="text-white/60 text-sm leading-relaxed mb-4">
                Secure access for platform administrators
              </p>

              <div className="grid grid-cols-2 gap-3">
                {[
                  { icon: Lock, title: 'Secure' },
                  { icon: Shield, title: 'Verified' },
                ].map((feature, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-white/10 border border-white/20">
                    <feature.icon className="h-4 w-4 text-orange-300" />
                    <div className="text-[10px] font-bold text-white uppercase">{feature.title}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-16">
            <div className="w-full max-w-sm">
              <div className="text-center mb-8 px-4">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-red-600 to-orange-600 flex items-center justify-center shadow-lg shadow-red-500/20">
                  <Lock className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
                  Admin Sign In
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Enter your credentials to access the admin dashboard
                </p>
              </div>

              <div className="space-y-6">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="email" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="admin@example.com"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                      className="h-12 border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-xl transition-all font-medium"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="password" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={form.password}
                        onChange={(e) => setForm({ ...form, password: e.target.value })}
                        required
                        className="h-12 border-slate-200 focus:border-red-500 focus:ring-red-500/10 rounded-xl transition-all font-medium pr-12"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-12 text-base font-bold shadow-xl shadow-red-500/20 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-700 hover:to-orange-700 rounded-xl transition-all duration-300 transform active:scale-95 mt-2" 
                    disabled={loading}
                  >
                    {loading ? 'Signing in...' : 'Sign In as Admin'}
                  </Button>
                </form>

                <div className="relative flex items-center gap-4 py-2">
                  <div className="flex-1 h-[1px] bg-slate-200"></div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest whitespace-nowrap">Need Access?</span>
                  <div className="flex-1 h-[1px] bg-slate-200"></div>
                </div>

                <div className="text-center">
                  <p className="text-slate-500 text-sm font-medium">
                    Not an admin?{' '}
                    <button 
                      className="text-primary font-bold hover:underline underline-offset-4 decoration-2" 
                      onClick={() => router.push('/auth')}
                    >
                      User Login
                    </button>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
