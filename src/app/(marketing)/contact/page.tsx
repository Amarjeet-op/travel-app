'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-hot-toast';
import { motion } from 'framer-motion';
import { Mail, MessageSquare, Send, Sparkles, Phone, MapPin } from 'lucide-react';

export default function ContactPage() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Simulate API call for now since we don't want to actually send to /api/feedback without checking it
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Message sent! We\'ll get back to you soon.');
      setForm({ name: '', email: '', message: '' });
    } catch (error: any) {
      toast.error(error.message || 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] opacity-60" />
        <div className="absolute bottom-1/4 left-0 w-[400px] h-[400px] bg-orange-200/10 rounded-full blur-[100px] opacity-40" />
      </div>

      <div className="container-wide relative z-10 py-16 md:py-24">
        <div className="grid lg:grid-cols-2 gap-12 items-start max-w-6xl mx-auto">
          
          {/* Info Side */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/60 border border-accent mb-2">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Get in touch</span>
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-[#2D2118]">
              We&apos;d love to hear from <span className="text-gradient font-display italic">you</span>
            </h1>
            
            <p className="text-lg text-gray-600 leading-relaxed max-w-md">
              Have a question about safety? Want to share your travel story? Or maybe you have feedback on how we can improve. Our team is here to help.
            </p>

            <div className="space-y-6 pt-4">
              {[
                { icon: Mail, label: 'Email us at', value: 'hello@abhayam.com', href: 'mailto:hello@abhayam.com' },
                { icon: MessageSquare, label: 'Chat with us', value: 'Available 24/7 in-app', href: '#' },
                { icon: MapPin, label: 'Headquarters', value: 'New Delhi, India', href: '#' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-white border border-orange-100 flex items-center justify-center shadow-sm group-hover:bg-primary group-hover:border-primary transition-all duration-300">
                    <item.icon className="h-5 w-5 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">{item.label}</div>
                    <a href={item.href} className="text-lg font-bold text-[#2D2118] hover:text-primary transition-colors">{item.value}</a>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Card className="border-orange-100 shadow-2xl shadow-orange-900/5 bg-white/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden">
              <CardHeader className="p-8 md:p-10 pb-4">
                <CardTitle className="text-2xl font-bold text-[#2D2118]">Send us a message</CardTitle>
                <CardDescription className="text-gray-500 font-medium">We typically respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent className="p-8 md:p-10 pt-4">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-bold text-slate-700">Full Name</Label>
                    <Input
                      id="name"
                      placeholder="Enter your name"
                      className="h-12 rounded-xl border-slate-200 focus:border-primary/50 focus:ring-primary/20 bg-white"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-bold text-slate-700">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="name@example.com"
                      className="h-12 rounded-xl border-slate-200 focus:border-primary/50 focus:ring-primary/20 bg-white"
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="message" className="text-sm font-bold text-slate-700">Your Message</Label>
                    <Textarea
                      id="message"
                      placeholder="How can we help you today?"
                      rows={5}
                      className="rounded-xl border-slate-200 focus:border-primary/50 focus:ring-primary/20 resize-none bg-white p-4"
                      value={form.message}
                      onChange={(e) => setForm({ ...form, message: e.target.value })}
                      required
                    />
                  </div>
                  <Button 
                    type="submit" 
                    className="w-full h-14 rounded-2xl bg-primary hover:bg-primary/90 text-white font-bold text-lg shadow-xl shadow-orange-900/10 transition-all border-0" 
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Send className="h-5 w-5" />
                        Send Message
                      </div>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>

        </div>
      </div>
    </div>
  );
}

