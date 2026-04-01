'use client';

import { motion } from 'framer-motion';
import { Shield, Sparkles, MapPin, MessageSquare, Users, Plane, Globe, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export default function AboutPage() {
  const router = useRouter();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[120px] -mr-48 -mt-24" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-200/10 rounded-full blur-[100px] -ml-24 -mb-24" />
        </div>

        <div className="container-wide relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/60 border border-accent mb-8 shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-accent-foreground">Our Story & Mission</span>
            </div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-6 text-[#2D2118]">
              Abhayam — <span className="text-gradient italic font-display">Fearlessness</span>
            </h1>
            
            <p className="text-lg md:text-xl text-gray-700 max-w-3xl mx-auto leading-relaxed font-medium mb-12">
              Sanskrit for &quot;Fearlessness&quot;, Abhayam is more than just a platform. 
              It&apos;s a safety-first ecosystem designed specifically for the unique travel landscapes of India.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content Sections */}
      <section className="pb-24">
        <div className="container-wide">
          <motion.div 
            className="grid lg:grid-cols-2 gap-12 items-center mb-24"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <motion.div variants={itemVariants} className="space-y-6">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                <Heart className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-[#2D2118]">Our Mission</h2>
              <p className="text-gray-600 text-lg leading-relaxed">
                We believe everyone should be able to travel fearlessly across our beautiful country. 
                Abhayam empowers travelers to find verified companions, check area safety with AI-driven insights, 
                and stay connected with a community that looks out for one another.
              </p>
              <div className="flex flex-col gap-4">
                {[
                  'Safety without compromising privacy',
                  'Verified community of real travelers',
                  'Real-time AI-powered protection'
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="h-5 w-5 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                    <span className="font-semibold text-slate-700">{item}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 to-orange-100/50 rounded-3xl blur-3xl" />
              <div className="relative bg-white p-8 md:p-12 rounded-3xl border border-orange-100 shadow-xl shadow-orange-500/5">
                <div className="grid grid-cols-2 gap-6">
                  {[
                    { icon: Shield, title: 'Safe', count: '99%' },
                    { icon: Users, title: 'Social', count: '10K+' },
                    { icon: Globe, title: 'India', count: '500+' },
                    { icon: Heart, title: 'Trust', count: '100%' },
                  ].map((stat, i) => (
                    <div key={i} className="text-center p-4 rounded-2xl bg-[#FAF7F2] border border-slate-100">
                      <stat.icon className="h-6 w-6 text-primary mx-auto mb-2" />
                      <div className="text-2xl font-bold text-[#2D2118]">{stat.count}</div>
                      <div className="text-xs text-slate-500 font-bold uppercase tracking-widest">{stat.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-5xl font-bold text-[#2D2118] mb-4">What We Offer</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Every feature in Abhayam is designed from the ground up with safety and community in mind.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              { icon: MapPin, title: 'Companion Matching', desc: 'Post and discover trips across India City-to-City or Local.' },
              { icon: Sparkles, title: 'AI Safety Checker', desc: 'Real-time safety assessments using Google Gemini AI.' },
              { icon: MessageSquare, title: 'Secure Chat', desc: 'End-to-end communication with your verified travel buddies.' },
              { icon: Shield, title: 'SOS Alerts', desc: 'Instant emergency contact notification with real-time location.' },
              { icon: Users, title: 'Admin Moderation', desc: 'Strict verification system ensuring a safe and clean community.' },
              { icon: Plane, title: 'Curated Hidden Gems', desc: 'Discover safety-verified destinations off the beaten path.' },
            ].map((feature, i) => (
              <motion.div 
                key={i} 
                variants={itemVariants}
                className="group p-8 rounded-3xl bg-white border border-gray-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-orange-500/10 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-bold text-[#2D2118] mb-3">{feature.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed italic">{feature.desc}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="mt-24 p-12 rounded-[2.5rem] bg-gradient-to-br from-[#2D2118] to-[#403026] text-white text-center relative overflow-hidden"
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 pointer-events-none opacity-30">
              <div className="absolute top-0 left-0 w-96 h-96 bg-primary rounded-full blur-[120px] -ml-48 -mt-48" />
              <div className="absolute bottom-0 right-0 w-80 h-80 bg-orange-300 rounded-full blur-[100px] -mr-40 -mb-40" />
            </div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">Ready to travel fearlessly?</h2>
              <p className="text-orange-100/80 text-lg mb-10 leading-relaxed">
                Join the Abhayam community today and discover a safer, more connected way to explore India.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-primary hover:bg-primary/90 text-white font-bold h-14 px-10 rounded-2xl shadow-xl shadow-orange-900/20"
                  onClick={() => router.push('/auth')}
                >
                  Join the Community
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="bg-transparent border-white/20 hover:bg-white/10 text-white font-bold h-14 px-10 rounded-2xl"
                  onClick={() => router.push('/')}
                >
                  Back to Home
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

