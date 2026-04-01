'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'react-hot-toast';
import { MessageSquare, Send, Loader2, Bug, Lightbulb, MessageCircle, Heart, Star, CheckCircle } from 'lucide-react';

const categories = [
  { value: 'bug', label: 'Bug Report', icon: Bug, color: 'from-red-500 to-rose-500', shadow: 'shadow-red-500/30' },
  { value: 'feature', label: 'Feature Request', icon: Lightbulb, color: 'from-amber-500 to-yellow-500', shadow: 'shadow-amber-500/30' },
  { value: 'complaint', label: 'Complaint', icon: MessageCircle, color: 'from-orange-500 to-orange-600', shadow: 'shadow-orange-500/30' },
  { value: 'general', label: 'General', icon: Heart, color: 'from-violet-500 to-purple-500', shadow: 'shadow-violet-500/30' },
];

export default function FeedbackPage() {
  const [form, setForm] = useState({ category: 'general', message: '', rating: 0 });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
          <div className="relative rounded-2xl bg-card dark:bg-card/95 p-8 sm:p-12 text-center border border-border/50">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-500 flex items-center justify-center shadow-lg shadow-green-500/30">
              <CheckCircle className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Thank You!</h2>
            <p className="text-muted-foreground mb-6">Your feedback has been submitted and will be reviewed by our team.</p>
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
        <p className="text-muted-foreground mt-2 text-sm sm:text-base">Help us improve Abhayam with your feedback</p>
      </div>

      {/* Form Card */}
      <div className="relative rounded-2xl bg-gradient-to-br p-px">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-purple-500/10 opacity-50" />
        <div className="relative rounded-2xl bg-card dark:bg-card/95 p-5 sm:p-6 border border-border/50">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <Send className="h-5 w-5 text-primary" /> Submit Feedback
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Categories */}
            <div className="space-y-2">
              <Label>Category</Label>
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
                          : 'border border-border text-muted-foreground hover:bg-muted/60'
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
            <div className="space-y-2">
              <Label>Rating (Optional)</Label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setForm({ ...form, rating: star })}
                    className={`transition-all duration-300 hover:scale-125 ${
                      star <= form.rating ? 'text-yellow-500 drop-shadow-sm' : 'text-muted-foreground/30'
                    }`}
                  >
                    <Star className={`h-7 w-7 ${star <= form.rating ? 'fill-yellow-500' : ''}`} />
                  </button>
                ))}
              </div>
            </div>

            {/* Message */}
            <div className="space-y-2">
              <Label htmlFor="message">Your Feedback</Label>
              <Textarea
                id="message"
                placeholder="Tell us what you think, report a bug, or suggest a feature..."
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                rows={6}
                required
                className="resize-none"
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
