'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle, UserPlus, ShieldPlus, AlertTriangle, Scale, RefreshCw, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2]">
      {/* Header */}
      <section className="pt-20 pb-12 border-b border-orange-100 bg-white/50 backdrop-blur-sm">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 border border-orange-200 mb-6">
              <Scale className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary uppercase tracking-wider">User Agreement</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D2118] mb-4 font-display">Terms of Service</h1>
            <p className="text-slate-500 font-medium">Agreement between you and Abhayam • January 2026</p>
          </motion.div>
        </div>
      </section>

      <div className="container-wide py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-10"
          >
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <p className="text-slate-600 leading-relaxed font-medium">
                By accessing or using <span className="font-bold text-[#2D2118]">Abhayam</span>, you agree to be bound by these Terms. 
                Our platform is built on trust, and we expect every traveler to uphold our community standards.
              </p>
            </motion.div>

            {[
              { 
                step: '01', 
                icon: UserPlus, 
                title: 'User Accounts', 
                desc: 'You must provide accurate, verified information. You are responsible for your account security. We reserve the right to suspend accounts that violate our safety policies.' 
              },
              { 
                step: '02', 
                icon: ShieldPlus, 
                title: 'Mandatory Verification', 
                desc: 'All travelers must complete identity verification before posting trips. Providing false documents is grounds for immediate and permanent termination.' 
              },
              { 
                step: '03', 
                icon: AlertTriangle, 
                title: 'SOS Tool Disclaimer', 
                desc: 'The SOS feature is a secondary tool. In immediate danger, always call 112 first. Abhayam is not liable for delayed message delivery or network failures.' 
              },
              { 
                step: '04', 
                icon: Sparkles, 
                title: 'AI Safety Checker', 
                desc: 'Assessments are AI-generated based on pattern analysis. Use them as guidance, but always prioritize local news and your own judgment.' 
              },
              { 
                step: '05', 
                icon: Scale, 
                title: 'Limitation of Liability', 
                desc: 'Abhayam is a connector. We do not guarantee the safety of companions or trips. Users agree to travel at their own risk.' 
              },
              { 
                step: '06', 
                icon: RefreshCw, 
                title: 'Updates to Terms', 
                desc: 'We may modify these terms as our safety tools evolve. Continued use of the platform after changes constitutes your legal agreement.' 
              }
            ].map((section, i) => (
              <motion.section 
                key={i} 
                variants={itemVariants}
                className="group relative flex gap-6 md:gap-8 p-6 md:p-8 rounded-3xl bg-white border border-slate-100 hover:border-primary/20 hover:shadow-xl hover:shadow-orange-900/5 transition-all duration-300"
              >
                <div className="shrink-0">
                  <div className="w-14 h-14 rounded-2xl bg-[#FAF7F2] flex items-center justify-center border border-slate-100 group-hover:bg-primary group-hover:border-primary transition-all duration-500">
                    <section.icon className="h-6 w-6 text-primary group-hover:text-white transition-colors" />
                  </div>
                  <div className="mt-4 text-center text-xs font-black text-slate-200 group-hover:text-primary/20 transition-colors uppercase">{section.step}</div>
                </div>
                <div className="space-y-3">
                  <h3 className="text-xl font-bold text-[#2D2118]">{section.title}</h3>
                  <p className="text-slate-600 leading-relaxed font-normal">{section.desc}</p>
                </div>
              </motion.section>
            ))}

            <motion.div 
              variants={itemVariants}
              className="mt-16 p-10 rounded-[2.5rem] bg-[#2D2118] text-white text-center relative overflow-hidden"
            >
              <div className="absolute inset-0 opacity-10 pointer-events-none">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary rounded-full blur-3xl -mr-32 -mt-32" />
                <div className="absolute bottom-0 left-0 w-64 h-64 bg-primary rounded-full blur-3xl -ml-32 -mb-32" />
              </div>
              <div className="relative z-10 max-w-2xl mx-auto space-y-6">
                <ShieldCheck className="h-12 w-12 text-primary mx-auto opacity-80" />
                <h3 className="text-2xl font-bold">Safety is our shared responsibility.</h3>
                <p className="text-orange-100/60 text-sm italic">
                  By joining Abhayam, you become part of a movement to make India the safest destination for travelers worldwide.
                </p>
                <Button 
                  className="bg-primary hover:bg-primary/90 text-white font-bold h-12 px-8 rounded-xl shadow-lg shadow-primary/20 border-0"
                  onClick={() => window.location.href = '/'}
                >
                  Return Home
                </Button>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

