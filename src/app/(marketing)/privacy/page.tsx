'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, FileText, Eye, Trash2, Globe, Mail, Sparkles, ShieldAlert, Fingerprint, Database, UserCheck, Clock, Layers } from 'lucide-react';

export default function PrivacyPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-gray-900">
      {/* Hero Header */}
      <section className="pt-20 pb-12 border-b border-orange-100 dark:border-gray-700 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
        <div className="container-wide text-center">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20 dark:border-primary/30 mb-6">
              <Lock className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold text-primary dark:text-primary uppercase tracking-wider">Your Security Matters</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-[#2D2118] dark:text-white mb-4 font-display">Privacy Policy</h1>
            <p className="text-slate-500 dark:text-gray-400 font-medium">Last updated: January 2026 • Version 1.0</p>
          </motion.div>
        </div>
      </section>

      <div className="container-wide py-16 md:py-24">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-12"
          >
            {/* Introduction */}
            <motion.div variants={itemVariants} className="prose prose-slate dark:prose-invert max-w-none">
              <p className="text-lg text-slate-600 dark:text-gray-300 leading-relaxed italic border-l-4 border-primary/30 pl-6 bg-white/40 dark:bg-gray-800/40 py-4 rounded-r-2xl">
                At Abhayam, we believe that travel fearlessness starts with data fearlessness. 
                This policy explains how we collect, use, and protect your personal information while you explore India.
              </p>
            </motion.div>

            {/* Sections */}
            {[
              { 
                icon: Database, 
                title: 'Data Collection', 
                content: (
                  <>
                    <p className="text-slate-600 dark:text-gray-300 mb-4">We collect only what is necessary to ensure your safety and connect you with companions:</p>
                    <ul className="grid md:grid-cols-2 gap-3 pb-2">
                      {[
                        'Account (Email, Phone, Name)',
                        'Profile info (Photo, Bio, Home City)',
                        'Travel Preferences & Trip Data',
                        'Emergency Contact Details',
                        'Real-time Chat History',
                        'GPS Location (Consent required)'
                      ].map((li, i) => (
                        <li key={i} className="flex items-center gap-2 text-slate-700 dark:text-gray-300 bg-white dark:bg-gray-800 p-3 rounded-xl border border-slate-100 dark:border-gray-700 shadow-sm">
                          <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                          <span className="text-sm font-semibold">{li}</span>
                        </li>
                      ))}
                    </ul>
                  </>
                )
              },
              { 
                icon: ShieldCheck, 
                title: 'Data Storage & Security', 
                content: (
                  <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl border border-slate-100 dark:border-gray-700 shadow-sm space-y-4">
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
                      Your data is stored securely on <span className="font-bold text-primary">Google Cloud (Firebase)</span>. 
                      Our servers are located in <span className="font-bold text-[#2D2118] dark:text-white">Mumbai (asia-south1)</span> to comply with Indian data residency norms.
                    </p>
                    <p className="text-slate-600 dark:text-gray-300 leading-relaxed font-medium">
                      We use industry-standard <span className="font-bold text-[#2D2118] dark:text-white">AES-256 encryption</span> for data at rest and <span className="font-bold text-[#2D2118] dark:text-white">TLS 1.3</span> for data in transit.
                    </p>
                  </div>
                )
              },
              { 
                icon: UserCheck, 
                title: 'Your Digital Rights', 
                content: (
                  <>
                    <p className="text-slate-600 dark:text-gray-300 mb-4">In accordance with India&apos;s <span className="font-bold">DPDP Act 2023</span>, you have complete control over your digital footprint:</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {[
                        { icon: Eye, t: 'Right to Access', d: 'See all data we store about you.' },
                        { icon: Edit, t: 'Right to Correct', d: 'Fix any inaccuracies instantly.' },
                        { icon: Trash2, t: 'Right to Erase', d: 'Request permanent data deletion.' },
                        { icon: ShieldAlert, t: 'Withdraw Consent', d: 'Revoke permissions at any time.' },
                        { icon: Clock, t: 'Data Retention', d: 'Deleted 30 days after closing.' },
                      ].map((right, i) => (
                        <div key={i} className="p-4 rounded-xl bg-orange-50/50 dark:bg-orange-900/20 border border-orange-100 dark:border-orange-800 group hover:bg-orange-100/50 dark:hover:bg-orange-900/30 transition-colors">
                          <h4 className="font-bold text-[#2D2118] dark:text-white text-sm mb-1">{right.t}</h4>
                          <p className="text-xs text-slate-500 dark:text-gray-400 italic">{right.d}</p>
                        </div>
                      ))}
                    </div>
                  </>
                )
              },
              { 
                icon: Layers, 
                title: 'Third-Party Services', 
                content: (
                  <p className="text-slate-600 dark:text-gray-300 leading-relaxed">
                    We leverage trusted partners to power our platform: <span className="font-semibold text-[#2D2118] dark:text-white">Google Firebase</span> for auth/database, 
                    <span className="font-semibold text-[#2D2118] dark:text-white">Google Gemini</span> for AI safety insights, and 
                    <span className="font-semibold text-[#2D2118] dark:text-white">OpenStreetMap</span> for location visuals. 
                    No personal data is sold to advertisers.
                  </p>
                )
              },
              { 
                icon: Mail, 
                title: 'Contact Privacy Team', 
                content: (
                  <div className="p-6 rounded-2xl bg-[#2D2118] dark:bg-gray-800 text-white flex flex-col md:flex-row items-center justify-between gap-6 border border-gray-700">
                    <div>
                      <h4 className="font-bold text-lg mb-1">Grievance Redressal</h4>
                      <p className="text-orange-100/70 text-sm">Our Data Protection Officer is ready to assist you.</p>
                    </div>
                    <a 
                      href="mailto:privacy@abhayam.com" 
                      className="px-6 py-3 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold transition-all shadow-lg shadow-primary/20 flex items-center gap-2"
                    >
                      <Mail className="h-4 w-4" />
                      Email Privacy
                    </a>
                  </div>
                )
              }
            ].map((section, i) => (
              <motion.section 
                key={i} 
                variants={itemVariants}
                className="space-y-6"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 dark:bg-primary/20 flex items-center justify-center border border-primary/20 dark:border-primary/30">
                    <section.icon className="h-5 w-5 text-primary" />
                  </div>
                  <h2 className="text-2xl font-bold text-[#2D2118] dark:text-white">{section.title}</h2>
                </div>
                <div className="pl-14">
                  {section.content}
                </div>
              </motion.section>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
}

// Simple fallback components if icons are missing (just in case)
function ShieldCheck(props: any) { return <Shield {...props} /> }
function Edit(props: any) { return <Sparkles {...props} /> }

