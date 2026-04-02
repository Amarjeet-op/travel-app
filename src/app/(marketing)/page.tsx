'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Users, Shield, MessageSquare, MapPin, ArrowRight, Sparkles, Heart, Globe, Plane, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FAF7F2] via-white to-[#F5F1E8]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-12 sm:pt-20 sm:pb-16 md:pt-24 md:pb-20 lg:pt-28 lg:pb-24">
        {/* 3D Background elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-[100px] animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary/15 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/3 left-1/4 w-48 h-48 bg-violet-500/10 rounded-full blur-[80px] animate-float" style={{ animationDelay: '4s' }} />
          <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-amber-500/10 rounded-full blur-[90px] animate-float" style={{ animationDelay: '1s' }} />
          {/* Grid pattern */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(var(--primary),0.05)_1px,transparent_0)] bg-[size:40px_40px]" />
        </div>

        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/60 border border-accent mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Your journey begins here</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6 leading-tight text-[#2D2118] dark:text-white">
              Travel Fearlessly.
              <br />
              <span className="text-gradient font-display italic">Together.</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl text-gray-700 dark:text-gray-300 max-w-2xl mx-auto mb-10 leading-relaxed font-medium px-2">
              Find verified travel companions, check area safety with AI, and explore India with confidence. 
              Built with safety at its core, designed for the modern explorer.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg" 
                className="btn-primary-enhanced text-base px-8 py-6 rounded-xl shadow-xl shadow-primary/30 hover:shadow-2xl hover:shadow-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
                onClick={() => router.push('/auth')}
              >
                Get Started
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="text-base px-8 py-6 rounded-xl border-2 hover:border-primary/50 hover:bg-accent/30 hover:-translate-y-0.5 hover:shadow-md transition-all duration-300 dark:border-gray-600 dark:hover:border-primary/50 dark:hover:bg-accent/30"
                onClick={() => router.push('/about')}
              >
                Learn More
              </Button>
            </div>
          </motion.div>

          {/* 3D Stats */}
          <motion.div 
            className="mt-16 md:mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            {[
              { value: '10K+', label: 'Active Users', icon: Users, gradient: 'from-blue-500/10 to-cyan-500/10' },
              { value: '50K+', label: 'Trips Completed', icon: Plane, gradient: 'from-violet-500/10 to-purple-500/10' },
              { value: '99%', label: 'Safety Rating', icon: Shield, gradient: 'from-emerald-500/10 to-green-500/10' },
              { value: '500+', label: 'Cities Covered', icon: MapPin, gradient: 'from-amber-500/10 to-orange-500/10' },
            ].map((stat, i) => (
              <div key={i} className={`relative rounded-2xl bg-gradient-to-br ${stat.gradient} p-px group hover:-translate-y-1 transition-all duration-300`}>
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 blur-xl transition-opacity" />
                <div className="relative rounded-2xl bg-white dark:bg-gray-800 p-4 sm:p-5 border border-border/50 dark:border-gray-700">
                  <stat.icon className="h-5 w-5 text-primary mx-auto mb-2" />
                  <div className="text-2xl sm:text-3xl font-bold text-gradient font-display">{stat.value}</div>
                  <div className="text-xs sm:text-sm text-muted-foreground dark:text-gray-400 mt-1">{stat.label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="section-spacing bg-background">
        <div className="container-wide">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-calligraphy text-primary text-2xl mb-2 block">Discover the difference</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Why Choose Abhayam?</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Every feature designed with your safety and comfort in mind
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {[
              {
                icon: Users,
                title: 'Find Travel Companions',
                description: 'Post trips and connect with verified travelers heading your way.',
                gradient: 'from-blue-500/10 to-cyan-500/10',
                iconBg: 'bg-gradient-to-br from-blue-500 to-cyan-500',
                iconShadow: 'shadow-blue-500/30',
                accent: 'from-blue-500 to-cyan-500',
              },
              {
                icon: Shield,
                title: 'AI Safety Checker',
                description: 'Get real-time safety assessments for any area using AI powered by Google.',
                gradient: 'from-emerald-500/10 to-green-500/10',
                iconBg: 'bg-gradient-to-br from-emerald-500 to-green-500',
                iconShadow: 'shadow-emerald-500/30',
                accent: 'from-emerald-500 to-green-500',
              },
              {
                icon: MessageSquare,
                title: 'Real-time Chat',
                description: 'Communicate securely with your travel companions before and during trips.',
                gradient: 'from-amber-500/10 to-orange-500/10',
                iconBg: 'bg-gradient-to-br from-amber-500 to-orange-500',
                iconShadow: 'shadow-amber-500/30',
                accent: 'from-amber-500 to-orange-500',
              },
              {
                icon: MapPin,
                title: 'Emergency SOS',
                description: 'One-tap emergency alerts with location sharing to your contacts.',
                gradient: 'from-red-500/10 to-pink-500/10',
                iconBg: 'bg-gradient-to-br from-red-500 to-pink-500',
                iconShadow: 'shadow-red-500/30',
                accent: 'from-red-500 to-pink-500',
              },
            ].map((feature, i) => (
              <motion.div key={feature.title} variants={itemVariants}>
                <div className="group relative rounded-2xl bg-gradient-to-br p-px transition-all duration-300 hover:-translate-y-2 hover:shadow-xl cursor-pointer">
                  <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.accent} opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-300`} />
                    <div className="relative rounded-2xl bg-white dark:bg-gray-800 p-6 h-full border border-gray-100 dark:border-gray-700 group-hover:border-primary/10 dark:group-hover:border-primary/20 transition-all duration-300">
                    <div className={`w-14 h-14 ${feature.iconBg} rounded-xl flex items-center justify-center mb-4 shadow-lg ${feature.iconShadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                      <feature.icon className="h-7 w-7 text-white" />
                    </div>
                    <h3 className="text-xl font-display font-semibold mb-2 text-[#2D2118] dark:text-white group-hover:text-primary transition-colors">{feature.title}</h3>
                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed font-medium">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="section-spacing relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-accent/40 rounded-full blur-3xl" />
        </div>

        <div className="container-wide relative z-10">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-calligraphy text-primary text-2xl mb-2 block">Simple steps to adventure</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
              Three simple steps to your next safe journey
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 lg:gap-12 max-w-5xl mx-auto relative">
            {/* Connecting line */}
            <div className="hidden md:block absolute top-16 left-1/6 right-1/6 h-0.5 bg-gradient-to-r from-primary/20 via-primary/40 to-primary/20" />

            {[
              { step: '1', title: 'Sign Up', desc: 'Create your account and complete your profile with verification.', gradient: 'from-blue-500 to-cyan-500', shadow: 'shadow-blue-500/30' },
              { step: '2', title: 'Find Trips', desc: 'Browse trips or post your own. Connect with verified travelers.', gradient: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/30' },
              { step: '3', title: 'Travel Safe', desc: 'Chat, plan, and travel with confidence using our safety tools.', gradient: 'from-emerald-500 to-green-500', shadow: 'shadow-emerald-500/30' },
            ].map((item, i) => (
              <motion.div 
                key={item.step} 
                className="text-center relative group"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2, duration: 0.6 }}
              >
                <div className="relative inline-flex mb-6">
                  <div className={`w-16 h-16 bg-gradient-to-br ${item.gradient} text-white rounded-2xl flex items-center justify-center text-2xl font-bold shadow-lg ${item.shadow} group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    {item.step}
                  </div>
                  <div className={`absolute -inset-2 bg-gradient-to-br ${item.gradient} rounded-2xl blur-sm -z-10 opacity-30 group-hover:opacity-60 transition-opacity`} />
                </div>
                <h3 className="text-2xl font-display font-semibold mb-3 dark:text-white">{item.title}</h3>
                <p className="text-muted-foreground dark:text-gray-400 text-base leading-relaxed max-w-xs mx-auto">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials / Trust Section */}
      <section className="section-spacing bg-background">
        <div className="container-wide">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-sm font-calligraphy text-primary text-2xl mb-2 block">Trusted by travelers</span>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Built With Love & Safety</h2>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: Heart, title: 'Community First', desc: 'A supportive community of verified travelers who look out for each other.', gradient: 'from-rose-500/10 to-pink-500/10', iconBg: 'bg-gradient-to-br from-rose-500 to-pink-500', shadow: 'shadow-rose-500/30' },
              { icon: Shield, title: 'Privacy Focused', desc: 'Your data is encrypted and never shared. Safety without compromising privacy.', gradient: 'from-violet-500/10 to-purple-500/10', iconBg: 'bg-gradient-to-br from-violet-500 to-purple-500', shadow: 'shadow-violet-500/30' },
              { icon: Globe, title: 'Pan-India Coverage', desc: 'From metros to hidden gems, our safety network covers all of India.', gradient: 'from-sky-500/10 to-indigo-500/10', iconBg: 'bg-gradient-to-br from-sky-500 to-indigo-500', shadow: 'shadow-sky-500/30' },
            ].map((item, i) => (
              <motion.div key={item.title} variants={itemVariants} className="group relative rounded-2xl bg-gradient-to-br p-px transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 blur-xl transition-opacity`} />
                <div className="relative rounded-2xl bg-white dark:bg-gray-800 p-6 text-center border border-gray-100 dark:border-gray-700 group-hover:border-primary/10 dark:group-hover:border-primary/20 transition-all duration-300">
                  <div className={`w-14 h-14 mx-auto mb-4 ${item.iconBg} rounded-xl flex items-center justify-center shadow-lg ${item.shadow} group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300`}>
                    <item.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-display font-semibold mb-2 text-[#2D2118] dark:text-white">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="section-spacing relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary-glow to-primary dark:from-primary dark:via-primary dark:to-primary" />
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djZoLTZWMzRoLTZ2LTZoNlYyMmg2djZoNnY2aC02eiIvPjwvZz48L2c+PC9zdmc+')] opacity-30 dark:opacity-20" />
        
        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white">
              Ready to Travel Fearlessly?
            </h2>
            <p className="text-lg md:text-xl mb-10 opacity-90 text-white/90 max-w-2xl mx-auto">
              Join thousands of travelers who trust Abhayam for safe, connected journeys across India.
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-10 py-7 rounded-xl shadow-xl hover:shadow-2xl hover:scale-105 hover:-translate-y-0.5 transition-all duration-300 bg-white text-primary hover:bg-white/95"
              onClick={() => router.push('/auth')}
            >
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t bg-muted/20 dark:bg-gray-900">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 via-blue-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-primary/20 dark:shadow-primary/40">
                  <Shield className="h-5 w-5 text-white animate-[spin_20s_linear_infinite]" />
                </div>
              </div>
              <div>
                <span className="font-display font-semibold text-xl block leading-tight dark:text-white">Abhayam</span>
                <span className="text-[9px] text-muted-foreground dark:text-gray-400 block leading-tight">अभयम् · निर्भयं यात्रा</span>
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground dark:text-gray-400">
              &copy; 2026 Abhayam. All rights reserved.
            </p>
            
            <div className="flex gap-6">
              <Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy</Link>
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms</Link>
              <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">Contact</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
