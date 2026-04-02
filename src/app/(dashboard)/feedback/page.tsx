'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, Loader2, Bug, Lightbulb, MessageCircle, Heart, CheckCircle } from 'lucide-react';

const categories = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/30' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'from-amber-500 to-yellow-500', shadow: 'shadow-amber-500/30' },
  { value: 'complaint', label: 'Complaint', icon: MessageCircle, color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/30' },
  { value: 'general', label: 'General', icon: Heart, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/30' },
];

const starConfig = [
  { color: '#ef4444', label: 'Poor 😞' },
  { color: '#f97316', label: 'Fair 😐' },
  { color: '#eab308', label: 'Good 🙂' },
  { color: '#22c55e', label: 'Very Good 😊' },
  { color: '#10b981', label: 'Excellent 🤩' },
];

export default function FeedbackPage() {
  const [form, setForm] = useState({ category: 'general', message: '', rating: 0 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState<number | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.message.trim()) {
      toast.error('Please enter your feedback');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Failed to submit feedback');
      setSubmitted(true);
      toast.success('Feedback submitted. Thank you!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit feedback');
    } finally {
      setLoading(false);
    }
  };

  const selectedCat = categories.find((c) => c.value === form.category) || categories[3];
  const CatIcon = selectedCat.icon;

  if (submitted) {
    return (
      <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
        <div className="relative rounded-2xl bg-gradient-to-br p-px">
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-green-500/10 to-emerald-500/10 opacity-50" />
          <div className="relative rounded-2xl bg-card dark:bg-gray-800 p-8 sm:p-12 text-center border border-border/50 dark:border-gray-700">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2 dark:text-white">Thank You!</h2>
            <p className="text-muted-foreground dark:text-gray-400 mb-6">Your feedback has been submitted and will be reviewed by our team.</p>
            <Button onClick={() => { setSubmitted(false); setForm({ category: 'general', message: '', rating: 0 }); }}>
              Submit Another
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-3">
          <div className="w-12 h-12 bg-gradient-to-br from-violet-500 to-purple-500 rounded-xl flex items-center justify-center shadow-lg shadow-violet-500/25">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <span className="text-gradient">Feedback</span>
        </h1>
        <p className="text-muted-foreground dark:text-gray-400 mt-2 text-sm sm:text-base">Help us improve Abhayam with your feedback</p>
      </div>

      {/* Form Card */}
      <div className="relative rounded-2xl bg-gradient-to-br p-px">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-50 dark:opacity-30" />
        <div className="relative rounded-2xl bg-card dark:bg-gray-800 p-5 sm:p-6 border border-border/50 dark:border-gray-700">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2 dark:text-white">
            <Send className="h-5 w-5 text-primary" /> Submit Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <Label className="dark:text-gray-300">Category</Label>
              <div className="grid grid-cols-2 gap-2">
                {categories.map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = form.category === cat.value;
                  return (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setForm({ ...form, category: cat.value })}
                      className={`relative flex items-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                        isSelected
                          ? 'bg-primary text-white shadow-lg shadow-primary/30'
                          : 'border border-border dark:border-gray-600 text-muted-foreground dark:text-gray-400 hover:bg-muted/60 dark:hover:bg-gray-800'
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {cat.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Rating */}
            <div className="space-y-3">
              <Label className="dark:text-gray-300">Rating (Optional)</Label>
              <div className="flex gap-2">
                {starConfig.map((config, index) => {
                  const starNum = index + 1;
                  const isSelected = form.rating >= starNum;
                  const isHovered = hoveredStar !== null && hoveredStar >= starNum;
                  
                  return (
                    <button
                      key={starNum}
                      type="button"
                      onClick={() => setForm({ ...form, rating: starNum })}
                      onMouseEnter={() => setHoveredStar(starNum)}
                      onMouseLeave={() => setHoveredStar(null)}
                      className="text-3xl transition-all duration-200 hover:scale-125 focus:outline-none cursor-pointer"
                    >
                      {(isSelected || isHovered) ? (
                        <span style={{ color: config.color, textShadow: `0 0 10px ${config.color}` }}>★</span>
                      ) : (
                        <span className="text-gray-300">☆</span>
                      )}
                    </button>
                  );
                })}
              </div>
              {form.rating > 0 && (
                <p className="text-sm font-semibold" style={{ color: starConfig[form.rating - 1].color }}>
                  {starConfig[form.rating - 1].label}
                </p>
              )}
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message" className="dark:text-gray-300">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Tell us what you think, report a bug, or suggest a feature..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                required
                className="resize-none dark:bg-gray-800 dark:border-gray-600 dark:text-white"
              />
            </div>

            {/* Submit */}
            <Button type="submit" className="w-full h-11 text-base" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
