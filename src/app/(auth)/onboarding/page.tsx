'use client';

import { useState, useEffect } from 'react';
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
import { User, Phone, MapPin, FileText, ArrowRight, ArrowLeft, CheckCircle, Shield, Sparkles, Camera, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OnboardingPage() {
  const router = useRouter();
  const { user, profileCompleted } = useAuthContext();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    displayName: '',
    gender: '',
    age: '',
    phone: '',
    homeCity: '',
    bio: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelationship: '',
  });
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

  useEffect(() => {
    if (profileCompleted) {
      router.replace('/dashboard');
    }
  }, [profileCompleted, router]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setPhoto(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPhotoPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleNext = () => {
    if (step === 1 && (!form.displayName || !form.gender || !form.age)) {
      toast.error('Please fill all fields');
      return;
    }
    if (step === 2 && (!form.phone || !form.homeCity)) {
      toast.error('Please fill all fields');
      return;
    }
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
        displayName: form.displayName,
        gender: form.gender,
        age: parseInt(form.age),
        phone: form.phone,
        homeCity: form.homeCity,
        bio: form.bio,
        photoURL,
        emergencyContacts: [
          {
            name: form.emergencyContactName,
            phone: form.emergencyContactPhone,
            relationship: form.emergencyContactRelationship,
          },
        ],
        profileCompleted: true,
        updatedAt: serverTimestamp(),
      });

      toast.success('Profile completed!');
      router.push('/dashboard');
    } catch (error: any) {
      toast.error(error.message || 'Failed to complete profile');
    } finally {
      setLoading(false);
    }
  };

  const stepIcons = [User, Phone, FileText];
  const stepTitles = ['Basic Info', 'Contact & City', 'Bio & Emergency'];
  const StepIcon = stepIcons[step - 1];

  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] } },
    exit: { opacity: 0, x: -20, transition: { duration: 0.3 } },
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* 3D Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 left-10 w-72 h-72 bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/3 right-1/4 w-48 h-48 bg-violet-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }} />
        <div className="absolute bottom-1/3 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-2xl animate-float" style={{ animationDelay: '1s' }} />
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
        
        {/* Left: Welcome Content (Desktop only split) */}
        <div className="hidden lg:flex lg:w-2/5 bg-gradient-to-br from-orange-100/50 via-white to-orange-50 relative overflow-hidden group border-r">
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-16 -left-16 w-64 h-64 bg-primary/5 rounded-full blur-2xl" />
            <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/5 rounded-full blur-2xl" />
          </div>

          <div className="relative z-10 flex flex-col justify-between p-10 xl:p-12 w-full">
            <div>
              {/* Logo */}
              <div className="flex items-center gap-3 mb-8">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
                  <Shield className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <span className="text-xl font-bold text-slate-900 font-display block leading-tight">Abhayam</span>
                  <span className="text-[10px] text-slate-500 leading-tight uppercase tracking-wider font-bold">अभयम् · Safe Travels</span>
                </div>
              </div>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Sparkles className="h-3 w-3 text-primary" />
                <span className="text-xs font-bold text-primary italic">Almost there!</span>
              </div>

              {/* Heading */}
              <h1 className="text-3xl xl:text-4xl font-bold text-slate-900 leading-[1.1] mb-4">
                Complete Your<br />
                <span className="text-primary italic font-display">Profile</span>
              </h1>

              <p className="text-slate-600 text-sm leading-relaxed mb-8 max-w-sm">
                Help us personalize your travel experience and keep you safe on every journey.
              </p>

              {/* Step indicators */}
              <div className="space-y-4">
                {[
                  { num: 1, icon: User, title: 'Basic Info', desc: 'Name, gender, and age' },
                  { num: 2, icon: Phone, title: 'Contact Details', desc: 'Phone and home city' },
                  { num: 3, icon: FileText, title: 'Final Touches', desc: 'Bio and emergency contact' },
                ].map((s, i) => (
                  <div key={s.num} className={`flex items-center gap-4 transition-all duration-300 ${step === s.num ? 'opacity-100' : step > s.num ? 'opacity-60' : 'opacity-40'}`}>
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                      step > s.num 
                        ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                        : step === s.num 
                          ? 'bg-primary text-white shadow-lg shadow-primary/30 scale-110' 
                          : 'bg-slate-100 text-slate-400'
                    }`}>
                      {step > s.num ? <CheckCircle className="h-5 w-5" /> : <s.icon className="h-5 w-5" />}
                    </div>
                    <div>
                      <h3 className={`font-bold text-sm ${step === s.num ? 'text-slate-900' : 'text-slate-500'}`}>{s.title}</h3>
                      <p className="text-xs text-slate-400">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-8 font-medium">
              <Heart className="h-3.5 w-3.5 text-primary" />
              <span>Your safety is our priority</span>
            </div>
          </div>
        </div>

        {/* Right: Form Section */}
        <div className="flex-1 flex flex-col bg-slate-50/50 backdrop-blur-sm relative">
          {/* Mobile Branding */}
          <div className="lg:hidden w-full bg-gradient-to-br from-orange-50 via-white to-orange-50 p-6 pb-6 shadow-sm relative overflow-hidden border-b border-slate-100">
            <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-50">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/10 rounded-full blur-2xl" />
            </div>

            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center border border-slate-200 shadow-sm">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <span className="text-lg font-bold text-slate-900 font-display">Abhayam</span>
              </div>

              <div className="flex items-center gap-2 mb-2">
                {[1, 2, 3].map((s) => (
                  <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary flex-1' : 'bg-slate-200 flex-1'}`} />
                ))}
              </div>
              <p className="text-xs text-slate-500 font-medium">Step {step} of 3: {stepTitles[step - 1]}</p>
            </div>
          </div>

          {/* Form area */}
          <div className="flex-1 flex items-center justify-center p-6 sm:p-10 lg:p-12">
            <div className="w-full max-w-md">
              {/* Desktop step indicator */}
              <div className="hidden lg:flex items-center gap-3 mb-8">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-primary-glow flex items-center justify-center shadow-lg shadow-primary/20">
                  <StepIcon className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-900 font-display">{stepTitles[step - 1]}</h2>
                  <p className="text-sm text-slate-500">Step {step} of 3</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.div key="step1" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="displayName" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Full Name</Label>
                          <Input
                            id="displayName"
                            placeholder="Enter your full name"
                            value={form.displayName}
                            onChange={(e) => setForm({ ...form, displayName: e.target.value })}
                            required
                            className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="gender" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Gender</Label>
                          <select
                            id="gender"
                            className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
                            value={form.gender}
                            onChange={(e) => setForm({ ...form, gender: e.target.value })}
                            required
                          >
                            <option value="">Select gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                            <option value="prefer-not-to-say">Prefer not to say</option>
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="age" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Age</Label>
                          <Input
                            id="age"
                            type="number"
                            min={18}
                            max={120}
                            placeholder="Your age"
                            value={form.age}
                            onChange={(e) => setForm({ ...form, age: e.target.value })}
                            required
                            className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                          />
                        </div>
                        <Button type="button" onClick={handleNext} className="w-full btn-primary-enhanced h-12 text-base font-bold rounded-xl shadow-xl shadow-primary/20 mt-4">
                          Continue
                          <ArrowRight className="ml-2 h-5 w-5" />
                        </Button>
                      </div>
                    </motion.div>
                  )}

                  {step === 2 && (
                    <motion.div key="step2" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="phone" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Phone Number</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="+91 XXXXX XXXXX"
                            value={form.phone}
                            onChange={(e) => setForm({ ...form, phone: e.target.value })}
                            required
                            className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                          />
                        </div>
                        <div className="space-y-1.5">
                          <Label htmlFor="homeCity" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Home City</Label>
                          <select
                            id="homeCity"
                            className="flex h-12 w-full rounded-xl border-2 border-slate-200 bg-background px-4 py-2.5 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/20 focus-visible:border-primary transition-all font-medium"
                            value={form.homeCity}
                            onChange={(e) => setForm({ ...form, homeCity: e.target.value })}
                            required
                          >
                            <option value="">Select your city</option>
                            {CITIES.map((city) => (
                              <option key={city.name} value={city.name}>
                                {city.name}, {city.state}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Profile Photo</Label>
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              <div className={`w-20 h-20 rounded-2xl border-2 border-dashed ${photoPreview ? 'border-primary' : 'border-slate-300'} flex items-center justify-center overflow-hidden bg-slate-50 transition-all`}>
                                {photoPreview ? (
                                  <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                  <Camera className="h-6 w-6 text-slate-400" />
                                )}
                              </div>
                              <input
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                              />
                            </div>
                            <p className="text-xs text-slate-500">Click to upload<br />Optional but recommended</p>
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-12 rounded-xl font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button type="button" onClick={handleNext} className="flex-1 btn-primary-enhanced h-12 rounded-xl font-bold">
                            Continue
                            <ArrowRight className="ml-2 h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {step === 3 && (
                    <motion.div key="step3" variants={containerVariants} initial="hidden" animate="visible" exit="exit">
                      <div className="space-y-4">
                        <div className="space-y-1.5">
                          <Label htmlFor="bio" className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Bio</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell others about yourself..."
                            value={form.bio}
                            onChange={(e) => setForm({ ...form, bio: e.target.value })}
                            maxLength={300}
                            rows={3}
                            className="rounded-xl resize-none border-slate-200 focus:border-primary focus:ring-primary/10 transition-all font-medium"
                          />
                          <p className="text-xs text-slate-400 text-right">{form.bio.length}/300</p>
                        </div>
                        <div className="space-y-1.5">
                          <Label className="text-slate-700 text-xs font-bold uppercase tracking-wider ml-1">Emergency Contact</Label>
                          <div className="space-y-3">
                            <Input
                              placeholder="Contact Name"
                              value={form.emergencyContactName}
                              onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })}
                              required
                              className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                            />
                            <Input
                              placeholder="Contact Phone"
                              value={form.emergencyContactPhone}
                              onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })}
                              required
                              className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                            />
                            <Input
                              placeholder="Relationship (e.g., Mother, Friend)"
                              value={form.emergencyContactRelationship}
                              onChange={(e) => setForm({ ...form, emergencyContactRelationship: e.target.value })}
                              required
                              className="h-12 border-slate-200 focus:border-primary focus:ring-primary/10 rounded-xl transition-all font-medium"
                            />
                          </div>
                        </div>
                        <div className="flex gap-3 pt-2">
                          <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-12 rounded-xl font-bold">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back
                          </Button>
                          <Button type="submit" disabled={loading} className="flex-1 btn-primary-enhanced h-12 rounded-xl font-bold shadow-xl shadow-primary/20">
                            {loading ? (
                              'Saving...'
                            ) : (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Complete Profile
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
